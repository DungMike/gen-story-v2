// Test setup file
import { vi } from 'vitest'

// Mock environment variables for testing
process.env.GEMINI_API_KEY = 'test-api-key-for-testing'

// Mock console.log to avoid noise in tests
vi.spyOn(console, 'log').mockImplementation(() => {})
vi.spyOn(console, 'error').mockImplementation(() => {}) 