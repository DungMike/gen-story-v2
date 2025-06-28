import { GoogleGenAI } from '@google/genai';
import { v4 as uuidv4 } from 'uuid';

if (!process.env.GEMINI_API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Rate limiting for TTS model
interface TTSRateLimit {
  requests: number[];
  queue: Array<{
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
    params: { text: string; chunkIndex: number; totalChunks: number; voiceName?: string };
  }>;
  processing: boolean;
}

const ttsRateLimit: TTSRateLimit = {
  requests: [],
  queue: [],
  processing: false
};

const MAX_REQUESTS_PER_MINUTE = 10;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const QUEUE_DELAY = 115 * 1000; // 115 seconds in milliseconds

// Function to check if we can make a request
function canMakeRequest(): boolean {
  const now = Date.now();
  // Remove requests older than 1 minute
  ttsRateLimit.requests = ttsRateLimit.requests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
  
  return ttsRateLimit.requests.length < MAX_REQUESTS_PER_MINUTE;
}

// Function to add request timestamp
function addRequestTimestamp(): void {
  ttsRateLimit.requests.push(Date.now());
}

// Function to process queued requests
async function processQueue(): Promise<void> {
  if (ttsRateLimit.processing || ttsRateLimit.queue.length === 0) {
    return;
  }

  ttsRateLimit.processing = true;

  while (ttsRateLimit.queue.length > 0) {
    if (canMakeRequest()) {
      const queuedRequest = ttsRateLimit.queue.shift();
      if (queuedRequest) {
        try {
          addRequestTimestamp();
          const result = await makeActualTTSRequest(queuedRequest.params);
          queuedRequest.resolve(result);
        } catch (error) {
          queuedRequest.reject(error);
        }
      }
    } else {
      // Wait 115 seconds before processing next batch
      console.log(`Rate limit exceeded. Waiting 115 seconds before processing next TTS request...`);
      await new Promise(resolve => setTimeout(resolve, QUEUE_DELAY));
    }
  }

  ttsRateLimit.processing = false;
}

// Function to make rate-limited TTS request
function makeRateLimitedTTSRequest(params: { text: string; chunkIndex: number; totalChunks: number; voiceName?: string }): Promise<any> {
  return new Promise((resolve, reject) => {
    if (canMakeRequest()) {
      // Can make request immediately
      console.log(`Making TTS request immediately for chunk ${params.chunkIndex + 1}. Requests in current minute: ${ttsRateLimit.requests.length + 1}/${MAX_REQUESTS_PER_MINUTE}`);
      addRequestTimestamp();
      makeActualTTSRequest(params)
        .then(resolve)
        .catch(reject);
    } else {
      // Add to queue
      console.log(`Rate limit reached (${MAX_REQUESTS_PER_MINUTE}/minute). Queueing chunk ${params.chunkIndex + 1}. Queue size: ${ttsRateLimit.queue.length + 1}`);
      ttsRateLimit.queue.push({ resolve, reject, params });
      processQueue(); // Start processing queue if not already processing
    }
  });
}

// The actual TTS request function
async function makeActualTTSRequest(params: { text: string; chunkIndex: number; totalChunks: number; voiceName?: string }): Promise<any> {
  const { text, chunkIndex, totalChunks, voiceName = 'Kore' } = params;
  
  const prompt = `Hãy đọc đoạn văn bản sau bằng giọng đọc tự nhiên, rõ ràng và có cảm xúc phù hợp với nội dung:

${text}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
          voiceConfig: {
             prebuiltVoiceConfig: { voiceName },
          },
       },
    }
  });

  const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!data) {
    throw new Error(`No audio data received for chunk ${chunkIndex + 1}`);
  }

  return data;
}

interface TTSProgress {
  current: number;
  total: number;
  currentChunk: string;
  status: 'processing' | 'completed' | 'error';
}

// Helper function to create downloadable audio blob
function createAudioBlob(audioBuffer: ArrayBuffer): Blob {
  return new Blob([audioBuffer], { type: 'audio/wav' });
}

// Helper function to download blob as file
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Function to split text into chunks of maximum word count
function splitTextIntoChunks(text: string, maxWords = 1500): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  
  for (let i = 0; i < words.length; i += maxWords) {
    const chunk = words.slice(i, i + maxWords).join(' ');
    chunks.push(chunk);
  }
  
  return chunks;
}

// Function to convert single chunk to speech
async function convertChunkToSpeech(
  text: string,
  chunkIndex: number,
  totalChunks: number,
  onProgress?: (progress: TTSProgress) => void,
  voiceName: string = 'Kore'
): Promise<{blob: Blob, filename: string, url: string}> {
  try {
    onProgress?.({
      current: chunkIndex + 1,
      total: totalChunks,
      currentChunk: text.substring(0, 100) + '...',
      status: 'processing'
    });

    // Use rate-limited TTS request
    console.log(`Converting chunk ${chunkIndex + 1}/${totalChunks} with voice ${voiceName} and rate limiting...`);
    const data = await makeRateLimitedTTSRequest({
      text,
      chunkIndex,
      totalChunks,
      voiceName
    });

    // Convert base64 to ArrayBuffer
    const binaryString = atob(data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const audioBlob = createAudioBlob(bytes.buffer);
    const fileName = `story_chunk_${chunkIndex + 1}.wav`;
    
    // Return the blob URL and filename for download
    return {
      blob: audioBlob,
      filename: fileName,
      url: URL.createObjectURL(audioBlob)
    };
  } catch (error) {
    console.error(`Error converting chunk ${chunkIndex + 1} to speech:`, error);
    throw error;
  }
}

// Main function to convert full text to speech
export async function convertTextToSpeech(
  text: string,
  onProgress?: (progress: TTSProgress) => void,
  voiceName: string = 'Kore'
): Promise<Array<{blob: Blob, filename: string, url: string}>> {
  try {
    // Split text into chunks
    const chunks = splitTextIntoChunks(text, 1500);
    console.log(`Text split into ${chunks.length} chunks using voice ${voiceName}`);

    // Convert chunks to speech with rate limiting (sequential processing)
    const audioFiles: Array<{blob: Blob, filename: string, url: string}> = [];
    
    for (let i = 0; i < chunks.length; i++) {
      try {
        const audioFile = await convertChunkToSpeech(chunks[i], i, chunks.length, onProgress, voiceName);
        audioFiles.push(audioFile);
      } catch (error) {
        console.error(`Failed to convert chunk ${i + 1}:`, error);
        // Continue with next chunk instead of failing completely
        onProgress?.({
          current: i + 1,
          total: chunks.length,
          currentChunk: `Failed to convert chunk ${i + 1}`,
          status: 'error'
        });
      }
    }

    onProgress?.({
      current: chunks.length,
      total: chunks.length,
      currentChunk: 'Completed all chunks',
      status: 'completed'
    });

    return audioFiles;
  } catch (error) {
    console.error('Error in convertTextToSpeech:', error);
    onProgress?.({
      current: 0,
      total: 0,
      currentChunk: 'Error occurred',
      status: 'error'
    });
    throw error;
  }
}

// Function to download all audio files
export function downloadAllAudioFiles(audioFiles: Array<{blob: Blob, filename: string, url: string}>): void {
  audioFiles.forEach((file, index) => {
    setTimeout(() => {
      downloadBlob(file.blob, file.filename);
    }, index * 100); // Small delay between downloads
  });
}

// Function to save story to localStorage with title and template
export function saveStoryToLocalStorage(
  story: string, 
  templateName?: string,
  timestamp: string = new Date().toISOString()
): string {
  const storyId = uuidv4();
  
  try {
    const existingStories = getStoriesFromLocalStorage();
    
    // Get next sequential number for this template
    const templateStories = existingStories.filter(s => s.templateName === templateName);
    const nextNumber = templateStories.length + 1;
    
    // Create story title with format "Truyện - Template - Number"
    const storyTitle = templateName 
      ? `Truyện - ${templateName} - ${nextNumber}`
      : `Truyện - ${nextNumber}`;
    
    const storyData = {
      content: story,
      timestamp,
      id: storyId,
      title: storyTitle,
      templateName: templateName || 'Unknown'
    };
    
    const updatedStories = [storyData, ...existingStories];
    localStorage.setItem('generated_stories', JSON.stringify(updatedStories));
    return storyId;
  } catch (error) {
    console.error('Error saving story to localStorage:', error);
    return '';
  }
}

// Interface for stored story data
export interface StoredStory {
  content: string;
  timestamp: string;
  id: string;
  title?: string;
  templateName?: string;
}

// Function to get stories from localStorage
export function getStoriesFromLocalStorage(): StoredStory[] {
  try {
    const stories = localStorage.getItem('generated_stories');
    return stories ? JSON.parse(stories) : [];
  } catch (error) {
    console.error('Error getting stories from localStorage:', error);
    return [];
  }
}

// Function to get story by ID from localStorage
export function getStoryByIdFromLocalStorage(storyId: string): StoredStory | null {
  try {
    const stories = getStoriesFromLocalStorage();
    const story = stories.find(s => s.id === storyId);
    return story || null;
  } catch (error) {
    console.error('Error getting story by ID from localStorage:', error);
    return null;
  }
}

// Function to get rate limiting status
export function getTTSRateLimitStatus(): {
  requestsInCurrentMinute: number;
  maxRequestsPerMinute: number;
  queueSize: number;
  isProcessing: boolean;
} {
  const now = Date.now();
  // Clean old requests
  ttsRateLimit.requests = ttsRateLimit.requests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
  
  return {
    requestsInCurrentMinute: ttsRateLimit.requests.length,
    maxRequestsPerMinute: MAX_REQUESTS_PER_MINUTE,
    queueSize: ttsRateLimit.queue.length,
    isProcessing: ttsRateLimit.processing
  };
}

// Function to delete story from localStorage
export function deleteStoryFromLocalStorage(storyId: string): boolean {
  try {
    const stories = getStoriesFromLocalStorage();
    const updatedStories = stories.filter(s => s.id !== storyId);
    localStorage.setItem('generated_stories', JSON.stringify(updatedStories));
    return true;
  } catch (error) {
    console.error('Error deleting story from localStorage:', error);
    return false;
  }
}

export type { TTSProgress }; 