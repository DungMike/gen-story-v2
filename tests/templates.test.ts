import { describe, it, expect } from 'vitest'
import { STORY_TEMPLATES } from '../constants'
import { StoryTemplate, TemplateField } from '../types'

describe('Template Structure Tests', () => {
  describe('Templates Array', () => {
    it('should have at least one template', () => {
      expect(STORY_TEMPLATES).toBeDefined()
      expect(STORY_TEMPLATES.length).toBeGreaterThan(0)
    })

    it('should have unique template IDs', () => {
      const ids = STORY_TEMPLATES.map(template => template.id)
      const uniqueIds = [...new Set(ids)]
      expect(ids.length).toBe(uniqueIds.length)
    })
  })

  describe('Template Structure', () => {
    STORY_TEMPLATES.forEach((template: StoryTemplate) => {
      describe(`Template: ${template.name}`, () => {
        it('should have required properties', () => {
          expect(template.id).toBeDefined()
          expect(template.name).toBeDefined()
          expect(template.description).toBeDefined()
          expect(template.gradient).toBeDefined()
          expect(template.chapters).toBeDefined()
          expect(template.fields).toBeDefined()
        })

        it('should have non-empty properties', () => {
          expect(template.id.trim()).toBeTruthy()
          expect(template.name.trim()).toBeTruthy()
          expect(template.description.trim()).toBeTruthy()
          expect(template.gradient.trim()).toBeTruthy()
        })

        it('should have chapters as Record<number, string>', () => {
          expect(typeof template.chapters).toBe('object')
          const chapterKeys = Object.keys(template.chapters)
          expect(chapterKeys.length).toBeGreaterThan(0)
          
          chapterKeys.forEach(key => {
            expect(Number.isInteger(parseInt(key))).toBe(true)
            expect(typeof template.chapters[parseInt(key)]).toBe('string')
            expect(template.chapters[parseInt(key)].trim()).toBeTruthy()
          })
        })

        it('should have fields array', () => {
          expect(Array.isArray(template.fields)).toBe(true)
          expect(template.fields.length).toBeGreaterThan(0)
        })

        describe('Template Fields', () => {
          template.fields.forEach((field: TemplateField, index: number) => {
            describe(`Field ${index + 1}: ${field.label}`, () => {
              it('should have required field properties', () => {
                expect(field.id).toBeDefined()
                expect(field.label).toBeDefined()
                expect(field.type).toBeDefined()
                expect(field.chapter).toBeDefined()
                expect(field.description).toBeDefined()
              })

              it('should have valid field type', () => {
                expect(['select', 'text', 'textarea']).toContain(field.type)
              })

              it('should have valid chapter number', () => {
                expect(Number.isInteger(field.chapter)).toBe(true)
                expect(field.chapter).toBeGreaterThan(0)
                expect(template.chapters[field.chapter]).toBeDefined()
              })

              it('should have unique field ID', () => {
                const fieldIds = template.fields.map(f => f.id)
                const uniqueIds = [...new Set(fieldIds)]
                expect(fieldIds.length).toBe(uniqueIds.length)
              })

              if (field.type === 'select') {
                it('should have options for select field', () => {
                  expect(field.options).toBeDefined()
                  expect(Array.isArray(field.options)).toBe(true)
                  expect(field.options!.length).toBeGreaterThan(0)
                  
                  field.options!.forEach(option => {
                    expect(typeof option).toBe('string')
                    expect(option.trim()).toBeTruthy()
                  })
                })
              }
              
              if (field.type === 'text' || field.type === 'textarea') {
                it('should have placeholder for text/textarea field', () => {
                  expect(field.placeholder).toBeDefined()
                  expect(typeof field.placeholder).toBe('string')
                })
              }
            })
          })
        })

        it('should have consistent chapter numbering', () => {
          const chapterNumbers = Object.keys(template.chapters).map(k => parseInt(k)).sort((a, b) => a - b)
          const fieldChapters = [...new Set(template.fields.map(f => f.chapter))].sort((a, b) => a - b)
          
          // All field chapters should correspond to existing chapters
          fieldChapters.forEach(chapterNum => {
            expect(chapterNumbers).toContain(chapterNum)
          })
        })
      })
    })
  })

  describe('Specific Template Tests', () => {
    it('should have "an-mang-tam-linh" template', () => {
      const template = STORY_TEMPLATES.find(t => t.id === 'an-mang-tam-linh')
      expect(template).toBeDefined()
      expect(template!.name).toBe('Án mạng tâm linh')
    })

    it('should have proper chapter structure for first template', () => {
      const template = STORY_TEMPLATES[0]
      const chapterNumbers = Object.keys(template.chapters).map(k => parseInt(k)).sort((a, b) => a - b)
      
      expect(chapterNumbers[0]).toBe(1) // Should start with chapter 1
      expect(chapterNumbers.length).toBeGreaterThanOrEqual(3) // Should have at least 3 chapters
      
      // Should have sequential chapter numbers
      for (let i = 1; i < chapterNumbers.length; i++) {
        expect(chapterNumbers[i]).toBe(chapterNumbers[i-1] + 1)
      }
    })
  })
}) 