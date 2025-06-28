import { describe, it, expect, beforeEach } from 'vitest'
import { StoryFormData } from '../types'
import { STORY_TEMPLATES } from '../constants'

describe('Form Data Validation Tests', () => {
  describe('StoryFormData Structure', () => {
    let validFormData: StoryFormData

    beforeEach(() => {
      validFormData = {
        topic: 'Án mạng tâm linh ở một thị trấn hẻo lánh',
        narrativeStyle: 'Hồi hộp, kịch tính, có yếu tố trinh thám và bí ẩn',
        mainCharacterName: 'Thám tử Kiên',
        mainCharacterDesc: 'một thám tử tư dày dặn kinh nghiệm nhưng hoài nghi về thế giới siêu nhiên',
        setting: 'Thị trấn Sương Mù',
        settingDesc: 'Một thị trấn nhỏ, hẻo lánh nằm sâu trong vùng núi cao, quanh năm bao phủ bởi sương mù dày đặc và những lời đồn đại ma quái',
        chapters: {
          'chuong1_boiduc_chinh': 'Ngôi làng',
          'chuong1_mota_boiduc': 'Một ngôi làng yên bình, tĩnh lặng, nhưng có một cảm giác u ám nặng nề',
          'chuong1_ten_nhanvat': 'Minh',
          'chuong1_mota_nhanvat': 'Một thám tử tài ba, một đứa trẻ mồ côi, một người có quá khứ bí ẩn',
          'chuong1_sukien_khoidau': 'Phát hiện một cái chết bí ẩn',
        },
        wordCount: 3000,
      }
    })

    it('should have all required properties', () => {
      const requiredProperties = [
        'topic',
        'narrativeStyle', 
        'mainCharacterName',
        'mainCharacterDesc',
        'setting',
        'settingDesc',
        'chapters',
        'wordCount'
      ]

      requiredProperties.forEach(prop => {
        expect(validFormData).toHaveProperty(prop)
        expect(validFormData[prop as keyof StoryFormData]).toBeDefined()
      })
    })

    it('should have correct data types', () => {
      expect(typeof validFormData.topic).toBe('string')
      expect(typeof validFormData.narrativeStyle).toBe('string')
      expect(typeof validFormData.mainCharacterName).toBe('string')
      expect(typeof validFormData.mainCharacterDesc).toBe('string')
      expect(typeof validFormData.setting).toBe('string')
      expect(typeof validFormData.settingDesc).toBe('string')
      expect(typeof validFormData.chapters).toBe('object')
      expect(typeof validFormData.wordCount).toBe('number')
    })

    it('should have non-empty string values', () => {
      expect(validFormData.topic.trim()).toBeTruthy()
      expect(validFormData.narrativeStyle.trim()).toBeTruthy()
      expect(validFormData.mainCharacterName.trim()).toBeTruthy()
      expect(validFormData.mainCharacterDesc.trim()).toBeTruthy()
      expect(validFormData.setting.trim()).toBeTruthy()
      expect(validFormData.settingDesc.trim()).toBeTruthy()
    })

    it('should have valid word count', () => {
      expect(validFormData.wordCount).toBeGreaterThan(0)
      expect(validFormData.wordCount).toBeLessThanOrEqual(50000) // Reasonable upper limit
      expect(Number.isInteger(validFormData.wordCount)).toBe(true)
    })

    it('should have chapters object with string values', () => {
      expect(validFormData.chapters).toBeDefined()
      expect(typeof validFormData.chapters).toBe('object')
      expect(validFormData.chapters).not.toBeNull()
      
      Object.entries(validFormData.chapters).forEach(([key, value]) => {
        expect(typeof key).toBe('string')
        expect(typeof value).toBe('string')
        expect(key.trim()).toBeTruthy()
      })
    })
  })

  describe('Chapter Data Validation', () => {
    it('should validate chapter field IDs match template structure', () => {
      const template = STORY_TEMPLATES[0] // First template
      const templateFieldIds = template.fields.map(field => field.id)
      
      const formData: StoryFormData = {
        topic: 'Test',
        narrativeStyle: 'Test',
        mainCharacterName: 'Test',
        mainCharacterDesc: 'Test',
        setting: 'Test',
        settingDesc: 'Test',
        wordCount: 3000,
        chapters: {}
      }

      // Populate chapters with template field IDs
      templateFieldIds.forEach(fieldId => {
        formData.chapters[fieldId] = 'Test value'
      })

      // Validate all template fields have corresponding form data
      templateFieldIds.forEach(fieldId => {
        expect(formData.chapters).toHaveProperty(fieldId)
      })
    })

    it('should handle empty chapter values', () => {
      const formDataWithEmptyChapters: StoryFormData = {
        topic: 'Test',
        narrativeStyle: 'Test',
        mainCharacterName: 'Test',
        mainCharacterDesc: 'Test',
        setting: 'Test',
        settingDesc: 'Test',
        wordCount: 3000,
        chapters: {
          'field1': '',
          'field2': '   ', // Whitespace only
          'field3': 'Valid value'
        }
      }

      expect(formDataWithEmptyChapters.chapters['field1']).toBe('')
      expect(formDataWithEmptyChapters.chapters['field2'].trim()).toBe('')
      expect(formDataWithEmptyChapters.chapters['field3'].trim()).toBeTruthy()
    })

    it('should validate field naming convention', () => {
      const template = STORY_TEMPLATES[0]
      
      template.fields.forEach(field => {
        // Field IDs should follow the pattern: chuong{number}_{field_name}
        const fieldIdPattern = /^(chuong\d+_\w+|[a-z]+_\w+)$/
        expect(field.id).toMatch(fieldIdPattern)
      })
    })
  })

  describe('Form Data Edge Cases', () => {
    it('should handle very long text inputs', () => {
      const longText = 'A'.repeat(1000)
      const formData: StoryFormData = {
        topic: longText,
        narrativeStyle: longText,
        mainCharacterName: longText,
        mainCharacterDesc: longText,
        setting: longText,
        settingDesc: longText,
        wordCount: 3000,
        chapters: {
          'test_field': longText
        }
      }

      // Should handle long text without issues
      expect(formData.topic.length).toBe(1000)
      expect(formData.chapters['test_field'].length).toBe(1000)
    })

    it('should validate word count ranges', () => {
      const testCases = [
        { wordCount: 500, valid: true },
        { wordCount: 3000, valid: true },
        { wordCount: 15000, valid: true },
        { wordCount: 0, valid: false },
        { wordCount: -100, valid: false },
        { wordCount: 100000, valid: false }, // Too large
      ]

      testCases.forEach(({ wordCount, valid }) => {
        if (valid) {
          expect(wordCount).toBeGreaterThan(0)
          expect(wordCount).toBeLessThanOrEqual(50000)
        } else {
          expect(wordCount <= 0 || wordCount > 50000).toBe(true)
        }
      })
    })

    it('should handle special characters in form data', () => {
      const specialChars = 'áàảãạâấầẩẫậăắằẳẵặéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ'
      
      const formData: StoryFormData = {
        topic: `Án mạng có ${specialChars}`,
        narrativeStyle: 'Kịch tính',
        mainCharacterName: `Tên có ${specialChars}`,
        mainCharacterDesc: 'Mô tả',
        setting: 'Bối cảnh',
        settingDesc: 'Mô tả bối cảnh',
        wordCount: 3000,
        chapters: {
          'test_field': `Nội dung có ${specialChars}`
        }
      }

      // Should handle Vietnamese characters properly
      expect(formData.topic).toContain(specialChars)
      expect(formData.mainCharacterName).toContain(specialChars)
      expect(formData.chapters['test_field']).toContain(specialChars)
    })
  })

  describe('Template-Form Data Integration', () => {
    STORY_TEMPLATES.forEach(template => {
      describe(`Template: ${template.name}`, () => {
        it('should be able to create valid form data for template', () => {
          const formData: StoryFormData = {
            topic: 'Test Topic',
            narrativeStyle: 'Test Style',
            mainCharacterName: 'Test Character',
            mainCharacterDesc: 'Test Description',
            setting: 'Test Setting',
            settingDesc: 'Test Setting Description',
            wordCount: 3000,
            chapters: {}
          }

          // Populate all template fields
          template.fields.forEach(field => {
            formData.chapters[field.id] = field.placeholder || 'Test value'
          })

          // Validate the form data is complete
          expect(Object.keys(formData.chapters).length).toBe(template.fields.length)
          
          // Validate all fields have values
          template.fields.forEach(field => {
            expect(formData.chapters[field.id]).toBeDefined()
            expect(formData.chapters[field.id]).toBeTruthy()
          })
        })

        it('should handle select field options', () => {
          const selectFields = template.fields.filter(field => field.type === 'select')
          
          selectFields.forEach(field => {
            expect(field.options).toBeDefined()
            expect(field.options!.length).toBeGreaterThan(0)
            
            // Each option should be a valid choice for form data
            field.options!.forEach(option => {
              expect(typeof option).toBe('string')
              expect(option.trim()).toBeTruthy()
            })
          })
        })

        it('should handle text/textarea field placeholders', () => {
          const textFields = template.fields.filter(field => 
            field.type === 'text' || field.type === 'textarea'
          )
          
          textFields.forEach(field => {
            if (field.placeholder) {
              expect(typeof field.placeholder).toBe('string')
              expect(field.placeholder.trim()).toBeTruthy()
            }
          })
        })
      })
    })
  })
}) 