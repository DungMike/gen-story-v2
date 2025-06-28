import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { StoryFormData, StoryTemplate } from '../types';
import { getStylePrompt } from '../i18nConstants';
import i18n from '../i18n';
import { MODELS } from '@/constant/model-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const modelName = MODELS.GEMINI_2_5_PRO;

// Helper function to build chapter structure from template fields
function buildChapterStructure(chapterNum: number, template: StoryTemplate, formData: StoryFormData): string {
  const t = i18n.t;
  const chapterFields = template.fields.filter(field => field.chapter === chapterNum);
  
  if (chapterFields.length === 0) {
    return t('prompts.storyGeneration.noSpecificDetails');
  }
  
  let structure = t('prompts.storyGeneration.detailsToFollow') + '\n';
  
  chapterFields.forEach(field => {
    const fieldValue = formData.chapters[field.id] || field.placeholder || t('prompts.storyGeneration.nothingHappened');
    structure += `\n- **${field.label}:** ${fieldValue}`;
    if (field.description) {
      structure += `\n  (${field.description})`;
    }
  });
  
  return structure;
}

export async function* generateStoryStream(formData: StoryFormData, template: StoryTemplate, selectedModel: string = MODELS.GEMINI_2_5_FLASH_001): AsyncGenerator<string, void, unknown> {
  const t = i18n.t;
  let previousChaptersSummary = t('prompts.storyGeneration.nothingHappened');
  const totalWords = formData.wordCount || 8000; // Fallback to 8000 words if not provided
  console.log("🚀 ~ function*generateStoryStream ~ totalWords:", totalWords)
  
  const chapterNumbers = Object.keys(template.chapters).map(num => parseInt(num)).sort((a, b) => a - b);
  console.log("🚀 ~ function*generateStoryStream ~ chapters.length:", chapterNumbers.length)
  const wordsPerChapter = Math.floor(totalWords / chapterNumbers.length);

  for (const chapterNum of chapterNumbers) {
    const chapterTitle = template.chapters[chapterNum];
    const chapterStructure = buildChapterStructure(chapterNum, template, formData);
    
    // Yield chapter title as a markdown header before generating content
    
    const prompt = `
      ${t('prompts.storyGeneration.masterNovelist')}
      ${t('prompts.storyGeneration.missionDescription')}

      ${t('prompts.storyGeneration.storyOverview')}
      - ${t('prompts.storyGeneration.theme')} ${formData.topic}
      - ${t('prompts.storyGeneration.narrativeStyle')} ${getStylePrompt()}
      - ${t('prompts.storyGeneration.totalLength')} ${totalWords} words for the entire story.
      - ${t('prompts.storyGeneration.mainCharacter')} ${formData.mainCharacterName}, ${formData.mainCharacterDesc}.
      - ${t('prompts.storyGeneration.setting')} ${formData.setting}, ${formData.settingDesc}.
      - ${t('prompts.storyGeneration.onlyResult')}
      
      ${t('prompts.storyGeneration.previousChaptersSummary')}
      ${previousChaptersSummary}

      ${t('prompts.storyGeneration.currentChapterRequirements')} (${chapterTitle}):**
      ${t('prompts.storyGeneration.writeFullContent')} ${wordsPerChapter} ${t('prompts.storyGeneration.writingGuidelines')}
      
      ---
      ${chapterStructure}
      ---
      
      ${t('prompts.storyGeneration.beginWriting')} ${chapterTitle}:
    `;
    console.log("🚀 ~ function*generateStoryStream ~ prompt:", prompt)

    try {
        const stream = await ai.models.generateContentStream({
            model: selectedModel,
            contents: prompt,
            config: {
                // Disable thinking for lower latency on this creative task
                // thinkingConfig: { thinkingBudget: 0 } 
            }
        });

        let currentChapterContent = "";

        for await (const chunk of stream) {
            const chunkText = chunk.text;
            if (chunkText) {
                currentChapterContent += chunkText;
                yield chunkText;
            }
        }
        
        // After the chapter is fully generated, create a summary for the next iteration
        const summaryPrompt = `Summarize the following story chapter content in 20-30 concise sentences for use in writing the next chapter. Only provide the summary, don't add any introductory words:\n\n${currentChapterContent}`;
        
        const summaryResult: GenerateContentResponse = await ai.models.generateContent({
            model: selectedModel,
            contents: summaryPrompt
        });
        
        previousChaptersSummary += ` ${summaryResult.text}`;

    } catch (error) {
        console.error(`Error generating chapter ${chapterNum}:`, error);
        yield `\n\n${t('prompts.storyGeneration.errorGenerating')} ${chapterTitle}. ${t('prompts.storyGeneration.pleaseRetry')}\n\n`;
        // Stop generation if one chapter fails
        return;
    }
  }
}

// Simple test function for testing Gemini API
export async function testGeminiHelloWorld(): Promise<string> {
  try {
    const prompt = "Hello world! Please respond with a friendly greeting.";
    
    const result = await ai.models.generateContent({
      model: modelName,
      contents: prompt
    });
    
    return result.text || "No response received";
  } catch (error) {
    console.error("Error testing Gemini API:", error);
    throw error;
  }
}