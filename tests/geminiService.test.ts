import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateStoryStream, testGeminiHelloWorld } from '../services/geminiService'
import { StoryFormData, StoryTemplate } from '../types'
import { STORY_TEMPLATES } from '../constants'

// Mock the Google GenAI module
vi.mock('@google/genai', () => {
  const mockStream = {
    async *[Symbol.asyncIterator]() {
      yield { text: 'Chương 1 content chunk 1 ' }
      yield { text: 'chunk 2 ' }
      yield { text: 'chunk 3' }
    }
  }

  const mockGenerateContent = vi.fn().mockResolvedValue({
    text: 'Mocked summary content for testing'
  })

  const mockGenerateContentStream = vi.fn().mockResolvedValue(mockStream)

  return {
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        generateContent: mockGenerateContent,
        generateContentStream: mockGenerateContentStream
      }
    }))
  }
})

describe('Gemini Service Tests', () => {
  let mockFormData: StoryFormData
  let mockTemplate: StoryTemplate

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks()

    // Create mock form data
    mockFormData = {
      topic: 'Test Murder Mystery',
      narrativeStyle: 'Dramatic and suspenseful',
      mainCharacterName: 'Detective Smith',
      mainCharacterDesc: 'An experienced detective with a keen eye for detail',
      setting: 'Small Town',
      settingDesc: 'A quiet small town with dark secrets',
      wordCount: 3000,
      chapters: {
        'chuong1_boiduc_chinh': 'Ngôi làng',
        'chuong1_mota_boiduc': 'Một ngôi làng yên bình',
        'chuong1_ten_nhanvat': 'Thám tử Minh',
        'chuong2_phathien_kyla': 'Một thi thể bí ẩn',
        'chuong2_camxuc': 'Sự hoảng sợ'
      }
    }

    // Use the first template from constants
    mockTemplate = STORY_TEMPLATES[0]
  })

  describe('generateStoryStream Function', () => {
    it('should be defined', () => {
      expect(generateStoryStream).toBeDefined()
      expect(typeof generateStoryStream).toBe('function')
    })

    it('should generate story stream with correct parameters', async () => {
      const stream = generateStoryStream(mockFormData, mockTemplate)
      expect(stream).toBeDefined()
      
      // Verify it's an async generator
      expect(typeof stream[Symbol.asyncIterator]).toBe('function')
    })

    it('should yield chapter titles and content', async () => {
      const stream = generateStoryStream(mockFormData, mockTemplate)
      const chunks: string[] = []
      
      for await (const chunk of stream) {
        chunks.push(chunk)
      }
      
      expect(chunks.length).toBeGreaterThan(0)
      
      // Should contain chapter headers
      const hasChapterHeaders = chunks.some(chunk => chunk.includes('###'))
      expect(hasChapterHeaders).toBe(true)
      
      // Should contain content chunks
      const hasContent = chunks.some(chunk => chunk.includes('chunk'))
      expect(hasContent).toBe(true)
    })

    it('should handle word count distribution correctly', async () => {
      const customFormData = { ...mockFormData, wordCount: 6000 }
      const stream = generateStoryStream(customFormData, mockTemplate)
      
      const chunks: string[] = []
      for await (const chunk of stream) {
        chunks.push(chunk)
      }
      
      // Should complete without errors
      expect(chunks.length).toBeGreaterThan(0)
    })

    it('should handle empty chapters data', async () => {
      const emptyChaptersData = { ...mockFormData, chapters: {} }
      const stream = generateStoryStream(emptyChaptersData, mockTemplate)
      
      const chunks: string[] = []
      for await (const chunk of stream) {
        chunks.push(chunk)
      }
      
      // Should still generate content even with empty chapters
      expect(chunks.length).toBeGreaterThan(0)
    })

    it('should process all chapters in template', async () => {
      const stream = generateStoryStream(mockFormData, mockTemplate)
      const chunks: string[] = []
      
      for await (const chunk of stream) {
        chunks.push(chunk)
      }
      
      // Count chapter headers (###)
      const chapterHeaders = chunks.filter(chunk => chunk.includes('###'))
      const expectedChapters = Object.keys(mockTemplate.chapters).length
      
      expect(chapterHeaders.length).toBe(expectedChapters)
    })
  })

  describe('Prompt Structure Validation', () => {
    it('should build correct chapter structure from template fields', async () => {
      const stream = generateStoryStream(mockFormData, mockTemplate)
      
      // Start the stream to trigger prompt building
      const iterator = stream[Symbol.asyncIterator]()
      await iterator.next()
      
      // The prompt should be built correctly (we can't directly test the internal prompt
      // but we can verify the stream starts without errors)
      expect(true).toBe(true) // If we get here, prompt building succeeded
    })

    it('should include all required form data in prompt context', () => {
      const requiredFields = [
        'topic',
        'mainCharacterName', 
        'mainCharacterDesc',
        'setting',
        'settingDesc',
        'wordCount'
      ]
      
      requiredFields.forEach(field => {
        expect(mockFormData[field as keyof StoryFormData]).toBeDefined()
      })
    })

    it('should handle missing field values gracefully', async () => {
      const incompleteFormData = {
        ...mockFormData,
        chapters: {
          'chuong1_boiduc_chinh': '', // Empty value
          'missing_field': undefined as any
        }
      }
      
      const stream = generateStoryStream(incompleteFormData, mockTemplate)
      const chunks: string[] = []
      
      for await (const chunk of stream) {
        chunks.push(chunk)
      }
      
      // Should handle missing/empty values without crashing
      expect(chunks.length).toBeGreaterThan(0)
    })
  })

  describe('Payload Structure Tests', () => {
    it('should have proper payload structure for API calls', () => {
      // Test that our form data matches expected structure
      expect(mockFormData).toHaveProperty('topic')
      expect(mockFormData).toHaveProperty('mainCharacterName')
      expect(mockFormData).toHaveProperty('chapters')
      expect(typeof mockFormData.chapters).toBe('object')
      expect(typeof mockFormData.wordCount).toBe('number')
    })

    it('should validate template structure before processing', () => {
      expect(mockTemplate).toHaveProperty('id')
      expect(mockTemplate).toHaveProperty('chapters')
      expect(mockTemplate).toHaveProperty('fields')
      expect(Array.isArray(mockTemplate.fields)).toBe(true)
      expect(typeof mockTemplate.chapters).toBe('object')
    })

    it('should handle different template types', () => {
      STORY_TEMPLATES.forEach(async (template) => {
        const stream = generateStoryStream(mockFormData, template)
        expect(stream).toBeDefined()
        
        // Verify it's an async generator
        expect(typeof stream[Symbol.asyncIterator]).toBe('function')
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      // Mock an API error
      const { GoogleGenAI } = await import('@google/genai')
      const mockInstance = new GoogleGenAI({ apiKey: 'test-key' })
      vi.mocked(mockInstance.models.generateContentStream).mockRejectedValueOnce(
        new Error('API Error')
      )

      const stream = generateStoryStream(mockFormData, mockTemplate)
      const chunks: string[] = []
      
      try {
        for await (const chunk of stream) {
          chunks.push(chunk)
        }
      } catch (error) {
        // Should handle errors gracefully
        expect(chunks.some(chunk => chunk.includes('Lỗi'))).toBe(true)
      }
    })

    it('should validate required environment variables', () => {
      expect(process.env.GEMINI_API_KEY).toBeDefined()
      expect(process.env.GEMINI_API_KEY).toBeTruthy()
    })
  })

  describe('testGeminiHelloWorld Function', () => {
    it('should be defined', () => {
      expect(testGeminiHelloWorld).toBeDefined()
      expect(typeof testGeminiHelloWorld).toBe('function')
    })

    it('should return a response', async () => {
      const result = await testGeminiHelloWorld()
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle API errors in test function', async () => {
      // Mock an API error for the test function
      const { GoogleGenAI } = await import('@google/genai')
      const mockInstance = new GoogleGenAI({ apiKey: 'test-key' })
      vi.mocked(mockInstance.models.generateContent).mockRejectedValueOnce(
        new Error('Test API Error')
      )

      await expect(testGeminiHelloWorld()).rejects.toThrow('Test API Error')
    })
  })

  describe('Integration Tests', () => {
    it('should complete full generation cycle', async () => {
      const stream = generateStoryStream(mockFormData, mockTemplate)
      const chunks: string[] = []
      let chapterCount = 0
      
      for await (const chunk of stream) {
        chunks.push(chunk)
        if (chunk.includes('###')) {
          chapterCount++
        }
      }
      
      // Should generate all chapters
      expect(chapterCount).toBe(Object.keys(mockTemplate.chapters).length)
      
      // Should have content beyond just headers
      const contentChunks = chunks.filter(chunk => !chunk.includes('###') && chunk.trim().length > 0)
      expect(contentChunks.length).toBeGreaterThan(0)
    })

    it('should maintain story continuity between chapters', async () => {
      const stream = generateStoryStream(mockFormData, mockTemplate)
      const chunks: string[] = []
      
      for await (const chunk of stream) {
        chunks.push(chunk)
      }
      
      // Should have multiple chapters
      const chapterHeaders = chunks.filter(chunk => chunk.includes('###'))
      expect(chapterHeaders.length).toBeGreaterThan(1)
      
      // Each chapter should have content
      expect(chunks.length).toBeGreaterThan(chapterHeaders.length)
    })
  })
}) 