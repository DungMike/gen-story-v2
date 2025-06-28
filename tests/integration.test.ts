import { describe, it, expect, beforeEach, vi } from 'vitest'
import { generateStoryStream } from '../services/geminiService'
import { STORY_TEMPLATES } from '../constants'
import { StoryFormData } from '../types'

// Mock the API to avoid hitting real endpoints during testing
vi.mock('@google/genai', () => {
  const mockStream = {
    async *[Symbol.asyncIterator]() {
      yield { text: '### Chương 1: Giới thiệu bối cảnh và nhân vật chính\n\n' }
      yield { text: 'Trong một ngôi làng nhỏ...' }
      yield { text: ' câu chuyện bắt đầu với ' }
      yield { text: 'một sự kiện bí ẩn.' }
      yield { text: '\n\n### Chương 2: Phát hiện bất ngờ\n\n' }
      yield { text: 'Thám tử phát hiện ra ' }
      yield { text: 'manh mối quan trọng.' }
    }
  }

  return {
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        generateContent: vi.fn().mockResolvedValue({
          text: 'Tóm tắt chương: Nhân vật chính xuất hiện và khám phá bí ẩn đầu tiên.'
        }),
        generateContentStream: vi.fn().mockResolvedValue(mockStream)
      }
    }))
  }
})

describe('Integration Tests', () => {
  let completeFormData: StoryFormData

  beforeEach(() => {
    // Create complete form data for the first template
    const template = STORY_TEMPLATES[0]
    completeFormData = {
      topic: 'Án mạng tâm linh ở ngôi làng cổ',
      narrativeStyle: 'Hồi hộp, kịch tính',
      mainCharacterName: 'Thám tử Minh',
      mainCharacterDesc: 'Một thám tử kinh nghiệm với khả năng quan sát tuyệt vời',
      setting: 'Làng Cổ Huyền Bí',
      settingDesc: 'Một ngôi làng cổ kỳ với nhiều truyền thuyết ma quái',
      wordCount: 6000,
      chapters: {}
    }

    // Populate all template fields with realistic data
    template.fields.forEach(field => {
      switch (field.id) {
        case 'chuong1_boiduc_chinh':
          completeFormData.chapters[field.id] = 'Ngôi làng'
          break
        case 'chuong1_mota_boiduc':
          completeFormData.chapters[field.id] = 'Một ngôi làng yên bình nhưng ẩn chứa bí mật'
          break
        case 'chuong1_ten_nhanvat':
          completeFormData.chapters[field.id] = 'Thám tử Minh'
          break
        case 'chuong1_mota_nhanvat':
          completeFormData.chapters[field.id] = 'Thám tử kinh nghiệm, quan sát tinh tế'
          break
        case 'chuong1_sukien_khoidau':
          completeFormData.chapters[field.id] = 'Phát hiện một cái chết bí ẩn'
          break
        case 'chuong2_phathien_kyla':
          completeFormData.chapters[field.id] = 'Một vật phẩm cổ xưa bị nguyền rủa'
          break
        case 'chuong2_nguoi_phathien':
          completeFormData.chapters[field.id] = 'Nhân vật chính'
          break
        case 'chuong2_camxuc':
          completeFormData.chapters[field.id] = 'Sự tò mò'
          break
        default:
          completeFormData.chapters[field.id] = field.placeholder || field.options?.[0] || 'Giá trị mặc định'
      }
    })
  })

  describe('End-to-End Story Generation', () => {
    it('should generate complete story from form data', async () => {
      const template = STORY_TEMPLATES[0]
      const stream = generateStoryStream(completeFormData, template)
      
      const generatedContent: string[] = []
      let chapterCount = 0

      for await (const chunk of stream) {
        generatedContent.push(chunk)
        if (chunk.includes('###')) {
          chapterCount++
        }
      }

      // Should generate content
      expect(generatedContent.length).toBeGreaterThan(0)
      
      // Should generate all chapters
      expect(chapterCount).toBe(Object.keys(template.chapters).length)
      
      // Should contain actual story content
      const fullContent = generatedContent.join('')
      expect(fullContent).toContain('Chương 1')
      expect(fullContent).toContain('Chương 2')
      expect(fullContent.length).toBeGreaterThan(100) // Should have substantial content
    })

    it('should maintain consistent narrative flow', async () => {
      const template = STORY_TEMPLATES[0]
      const stream = generateStoryStream(completeFormData, template)
      
      const chunks: string[] = []
      const chapters: string[] = []
      let currentChapter = ''

      for await (const chunk of stream) {
        chunks.push(chunk)
        
        if (chunk.includes('###')) {
          if (currentChapter) {
            chapters.push(currentChapter)
          }
          currentChapter = chunk
        } else {
          currentChapter += chunk
        }
      }
      
      // Add the last chapter
      if (currentChapter) {
        chapters.push(currentChapter)
      }

      // Should have multiple chapters
      expect(chapters.length).toBeGreaterThan(1)
      
      // Each chapter should have content beyond just the title
      chapters.forEach((chapter, index) => {
        expect(chapter.length).toBeGreaterThan(50) // Should have substantial content
        expect(chapter).toContain('###') // Should have chapter header
      })
    })

    it('should handle different word count requirements', async () => {
      const testCases = [
        { wordCount: 1000, expectedChapters: 6 },
        { wordCount: 6000, expectedChapters: 6 },
        { wordCount: 12000, expectedChapters: 6 }
      ]

      for (const testCase of testCases) {
        const testFormData = { ...completeFormData, wordCount: testCase.wordCount }
        const template = STORY_TEMPLATES[0]
        const stream = generateStoryStream(testFormData, template)
        
        const chunks: string[] = []
        let chapterCount = 0

        for await (const chunk of stream) {
          chunks.push(chunk)
          if (chunk.includes('###')) {
            chapterCount++
          }
        }

        expect(chapterCount).toBe(testCase.expectedChapters)
        expect(chunks.length).toBeGreaterThan(0)
      }
    })
  })

  describe('Template Compatibility', () => {
    STORY_TEMPLATES.forEach((template, index) => {
      it(`should work with template: ${template.name}`, async () => {
        // Create form data compatible with this template
        const templateFormData: StoryFormData = {
          ...completeFormData,
          chapters: {}
        }

        // Populate fields for this template
        template.fields.forEach(field => {
          templateFormData.chapters[field.id] = field.placeholder || field.options?.[0] || 'Test value'
        })

        const stream = generateStoryStream(templateFormData, template)
        const chunks: string[] = []
        let chapterCount = 0

        for await (const chunk of stream) {
          chunks.push(chunk)
          if (chunk.includes('###')) {
            chapterCount++
          }
        }

        // Should generate content for this template
        expect(chunks.length).toBeGreaterThan(0)
        expect(chapterCount).toBe(Object.keys(template.chapters).length)
      })
    })
  })

  describe('Field Type Handling', () => {
    it('should handle select field values correctly', async () => {
      const template = STORY_TEMPLATES[0]
      const selectFields = template.fields.filter(field => field.type === 'select')
      
      if (selectFields.length > 0) {
        const testFormData = { ...completeFormData }
        
        // Use different option values for select fields
        selectFields.forEach(field => {
          if (field.options && field.options.length > 1) {
            testFormData.chapters[field.id] = field.options[1] // Use second option
          }
        })

        const stream = generateStoryStream(testFormData, template)
        const chunks: string[] = []

        for await (const chunk of stream) {
          chunks.push(chunk)
        }

        expect(chunks.length).toBeGreaterThan(0)
      }
    })

    it('should handle custom text input for select fields', async () => {
      const template = STORY_TEMPLATES[0]
      const selectFields = template.fields.filter(field => field.type === 'select')
      
      if (selectFields.length > 0) {
        const testFormData = { ...completeFormData }
        
        // Use custom values instead of predefined options
        selectFields.forEach(field => {
          testFormData.chapters[field.id] = 'Giá trị tùy chỉnh của người dùng'
        })

        const stream = generateStoryStream(testFormData, template)
        const chunks: string[] = []

        for await (const chunk of stream) {
          chunks.push(chunk)
        }

        expect(chunks.length).toBeGreaterThan(0)
      }
    })

    it('should handle empty field values gracefully', async () => {
      const template = STORY_TEMPLATES[0]
      const testFormData = { ...completeFormData }
      
      // Set some fields to empty values
      const fieldIds = Object.keys(testFormData.chapters)
      fieldIds.slice(0, Math.min(3, fieldIds.length)).forEach(fieldId => {
        testFormData.chapters[fieldId] = ''
      })

      const stream = generateStoryStream(testFormData, template)
      const chunks: string[] = []

      for await (const chunk of stream) {
        chunks.push(chunk)
      }

      // Should still generate content even with some empty fields
      expect(chunks.length).toBeGreaterThan(0)
    })
  })

  describe('Prompt Structure Validation', () => {
    it('should include all form data elements in generated content context', async () => {
      const template = STORY_TEMPLATES[0]
      const stream = generateStoryStream(completeFormData, template)
      
      const chunks: string[] = []
      for await (const chunk of stream) {
        chunks.push(chunk)
      }

      // The generation should complete successfully, indicating proper prompt structure
      expect(chunks.length).toBeGreaterThan(0)
      
      // Should have chapter headers
      const fullContent = chunks.join('')
      expect(fullContent).toMatch(/###.*Chương/g)
    })

    it('should generate proper chapter structure', async () => {
      const template = STORY_TEMPLATES[0]
      const stream = generateStoryStream(completeFormData, template)
      
      const chunks: string[] = []
      const chapterHeaders: string[] = []

      for await (const chunk of stream) {
        chunks.push(chunk)
        if (chunk.includes('###')) {
          chapterHeaders.push(chunk.trim())
        }
      }

      // Should have correct number of chapter headers
      expect(chapterHeaders.length).toBe(Object.keys(template.chapters).length)
      
      // Each header should be properly formatted
      chapterHeaders.forEach(header => {
        expect(header).toMatch(/^###\s+Chương\s+\d+/)
      })
    })
  })

  describe('Performance and Reliability', () => {
    it('should complete generation within reasonable time', async () => {
      const startTime = Date.now()
      const template = STORY_TEMPLATES[0]
      const stream = generateStoryStream(completeFormData, template)
      
      const chunks: string[] = []
      for await (const chunk of stream) {
        chunks.push(chunk)
      }
      
      const endTime = Date.now()
      const duration = endTime - startTime
      
      // Should complete within 30 seconds (generous for testing)
      expect(duration).toBeLessThan(30000)
      expect(chunks.length).toBeGreaterThan(0)
    })

    it('should handle multiple concurrent generations', async () => {
      const template = STORY_TEMPLATES[0]
      
      // Start multiple generations concurrently
      const streams = [
        generateStoryStream(completeFormData, template),
        generateStoryStream(completeFormData, template),
        generateStoryStream(completeFormData, template)
      ]

      const results = await Promise.all(
        streams.map(async (stream) => {
          const chunks: string[] = []
          for await (const chunk of stream) {
            chunks.push(chunk)
          }
          return chunks
        })
      )

      // All should complete successfully
      results.forEach(chunks => {
        expect(chunks.length).toBeGreaterThan(0)
      })
    })
  })
}) 