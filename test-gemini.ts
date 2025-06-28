// Simple test script for Gemini API
import { testGeminiHelloWorld } from './services/geminiService.js';

async function runTest() {
  console.log("🧪 Testing Gemini API with 'Hello World' prompt...");
  
  try {
    const response = await testGeminiHelloWorld();
    console.log("✅ Success! Gemini API Response:");
    console.log(response);
  } catch (error: any) {
    console.error("❌ Test failed:");
    console.error(error.message || error);
  }
}

runTest(); 