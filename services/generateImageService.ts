import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

console.log("🚀 ~ process.env.API_KEY:", process.env.GEMINI_API_KEY)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MASTER_PROMPT_GENERATION_SYSTEM_INSTRUCTION = `
You are an expert literary analyst and AI prompt engineer.
Your task is to read an entire story provided by the user and extract the core elements needed to maintain visual consistency across a series of generated images.

From the entire story, identify:
1.  **Main Characters:** List the primary characters. For each, describe their consistent physical appearance (hair, eyes, build), signature clothing, and any unique marks or accessories.
2.  **Overall World/Setting:** Describe the key features of the world the story takes place in (e.g., futuristic cyberpunk city, high-fantasy medieval kingdom).
3.  **Photorealistic, highly detailed**


Synthesize all this information into a single, concise "Master Prompt" in ENGLISH. This prompt will be appended to other, more specific prompts. It should act as a foundation for consistency.
Return ONLY the generated Master Prompt in English, with no other text, explanation, or quotation marks.
`;

const PROMPT_GENERATION_SYSTEM_INSTRUCTION = `
You are a creative assistant expert in creating prompts for an AI image generator.
You will be given a segment of a story. Your task is to read the segment and create a single, detailed, and effective prompt in ENGLISH that describes a key, visually-rich scene from the text.

The prompt must include:
1.  **Main Subject:** A clear description of the main character(s), creature(s), or object(s) as they appear in the text.
2.  **Action/Emotion:** What the subject is doing or feeling.
3.  **Setting/Background:** The environment as described in the text.

IMPORTANT: Focus ONLY on describing the scene from the text. Do NOT add any art style, artist names, or technical details like 'cinematic lighting' or 'hyperrealistic'. The user will add these style details separately.

Return ONLY the English prompt, with no other text, explanation, or quotation marks around it.
Focus: Each prompt should focus on only 1-2 main characters or a scene.
Use keywords (Keywords): Instead of writing long sentences, use short keyword phrases, using commas.
Clear structure: Arrange keywords in order of priority: [Main subject] + [Detailed description of subject] + [Action/Pose] + [Setting] + [Atmosphere/Lighting] + [Style/Specifications].

Photorealistic, highly detailed, shallow depth of field
`;

const SANITIZE_PROMPT_SYSTEM_INSTRUCTION = `
You are an AI assistant that rephrases image generation prompts to make them compliant with safety policies. You will be given a prompt that was rejected by the image model.
Your task is to rewrite the prompt to be safe for generation while preserving the original intent, characters, and scene as much as possible.
Analyze the prompt for any content that could be interpreted as graphic violence, gore, hate speech, or sexually explicit material, and rephrase it to describe the scene in a non-violating way.
Focus on the narrative action and emotion. For example, instead of "a bloody sword fight", you might write "an intense duel, with sparks flying from clashing swords".
Return ONLY the safe, rewritten prompt in English, with no other text or explanations.
`;


export const generateMasterPrompt = async (fullStory: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: fullStory,
            config: {
                systemInstruction: MASTER_PROMPT_GENERATION_SYSTEM_INSTRUCTION,
                temperature: 1,
            }
        });

        const text = response.text?.trim() || '';
        return text;
    } catch (error) {
        console.error("Error generating master prompt:", error);
        throw new Error("Failed to communicate with the Gemini API for master prompt generation.");
    }
};

export const generateImagePrompt = async (storySegment: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: storySegment,
            config: {
                systemInstruction: PROMPT_GENERATION_SYSTEM_INSTRUCTION,
                temperature:1,
                topP: 1,
                topK: 32,
            }
        });

        const text = response.text?.trim() || '';
        return text;
    } catch (error) {
        console.error("Error generating image prompt:", error);
        throw new Error("Failed to communicate with the Gemini API for prompt generation.");
    }
};

export const sanitizePromptForSafety = async (rejectedPrompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: `The following prompt was rejected, please sanitize it: "${rejectedPrompt}"`,
            config: {
                systemInstruction: SANITIZE_PROMPT_SYSTEM_INSTRUCTION,
                temperature: 0.6,
            }
        });

        return response.text?.trim() || '';
    } catch (error) {
        console.error("Error sanitizing prompt:", error);
        throw new Error("Failed to communicate with the Gemini API for prompt sanitization.");
    }
};

export const generateImage = async (prompt: string): Promise<string[]> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: {
                numberOfImages: 4,
                outputMimeType: 'image/jpeg',
                aspectRatio: "16:9"
            },
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages.map(img => img.image?.imageBytes || '').filter(Boolean) as string[];
        } else {
            throw new Error("No image was generated. The prompt might have been blocked.");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        if (error instanceof Error && (error.message.includes("blocked") || error.message.includes("SAFETY"))) {
             throw new Error("No image was generated. The prompt might have been blocked.");
        }
        throw new Error("Failed to communicate with the Gemini API for image generation.");
    }
};
