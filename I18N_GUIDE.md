# Internationalization (i18n) Guide

This project has been fully internationalized to support Vietnamese (vi) and English (en) languages.

## 🌍 Languages Supported
- **Vietnamese (vi)** - Default language
- **English (en)** - Secondary language

## 📁 File Structure

```
├── locales/
│   ├── vi.json          # Vietnamese translations
│   └── en.json          # English translations
├── components/
│   └── LanguageSwitcher.tsx  # Language switching component
├── hooks/
│   └── useI18n.ts       # Custom i18n hook
├── i18n.ts              # i18n configuration
├── i18nConstants.ts     # Internationalized constants and templates
└── I18N_GUIDE.md        # This guide
```

## 🚀 Quick Start

### Language Switching
Users can switch languages using the language switcher in the header:
- **VI** - Vietnamese
- **EN** - English

The selected language is saved in localStorage and will persist across sessions.

### Using Translations in Components

```tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const MyComponent: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('app.title')}</h1>
      <p>{t('app.subtitle')}</p>
    </div>
  );
};
```

### Using the Custom Hook

```tsx
import { useI18n } from '../hooks/useI18n';

const MyComponent: React.FC = () => {
  const { 
    t, 
    changeLanguage, 
    getCurrentLanguage, 
    isVietnamese, 
    isEnglish 
  } = useI18n();
  
  return (
    <div>
      <p>Current language: {getCurrentLanguage()}</p>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('vi')}>Tiếng Việt</button>
    </div>
  );
};
```

## 📝 Translation Structure

### Main Categories

1. **app** - Application-level text
2. **form** - Form labels and UI elements
3. **templates** - Story templates and their fields
4. **styles** - Narrative style prompts
5. **prompts** - AI prompt generation text
6. **ui** - General UI elements

### Example Translation Keys

```json
{
  "app": {
    "title": "AI Story Generator",
    "subtitle": "Craft magical worlds from your ideas."
  },
  "form": {
    "sections": {
      "coreIdea": "Core Idea",
      "characterSetting": "Characters & Setting"
    },
    "fields": {
      "mainTopic": "Main Topic",
      "wordCount": "Total Word Count"
    }
  }
}
```

## 🎭 Template Internationalization

Templates are fully internationalized and include:
- Template names and descriptions
- Chapter titles
- Field labels and descriptions
- Option values
- Placeholder text

### Dynamic Template Loading

Templates are loaded dynamically based on the current language:

```tsx
import { getStoryTemplates } from './i18nConstants';

const templates = getStoryTemplates(); // Returns localized templates
```

## 🤖 AI Prompt Optimization

The AI prompts are optimized for each language:

### Vietnamese Prompts
- Use formal Vietnamese writing style
- Include Vietnamese-specific narrative techniques
- Optimized for Vietnamese literary conventions

### English Prompts
- Use professional English writing style
- Include English narrative techniques
- Optimized for English literary conventions

### Accessing Localized Style Prompts

```tsx
import { getStylePrompt } from './i18nConstants';

const stylePrompt = getStylePrompt(); // Returns localized style prompt
```

## 🛠️ Adding New Translations

### 1. Add to Translation Files

**Vietnamese (locales/vi.json):**
```json
{
  "newSection": {
    "newKey": "Văn bản tiếng Việt"
  }
}
```

**English (locales/en.json):**
```json
{
  "newSection": {
    "newKey": "English text"
  }
}
```

### 2. Use in Components

```tsx
const { t } = useTranslation();
return <span>{t('newSection.newKey')}</span>;
```

## 🔧 Configuration

### Default Settings
- **Default Language**: Vietnamese (vi)
- **Fallback Language**: Vietnamese (vi)
- **Storage**: localStorage
- **Detection Order**: localStorage → navigator → htmlTag

### Changing Default Language

To change the default language, modify `i18n.ts`:

```tsx
i18n.init({
  // ...
  fallbackLng: 'en', // Change to 'en' for English default
  lng: 'en',         // Change to 'en' for English default
  // ...
});
```

## 📚 Template Structure

Each template includes:

```typescript
interface StoryTemplate {
  id: string;
  name: string;        // Localized
  description: string; // Localized
  gradient: string;
  chapters: Record<number, string>; // Localized
  fields: TemplateField[];          // Fully localized
}

interface TemplateField {
  id: string;
  label: string;       // Localized
  type: "select" | "text" | "textarea";
  options?: string[];  // Localized
  placeholder?: string; // Localized
  chapter: number;
  description: string; // Localized
}
```

## 🎨 UI Components

### Language Switcher
- Located in the header
- Shows current language with visual indication
- Smooth transitions between languages
- Responsive design

### Form Elements
- All labels are translated
- Placeholder text is localized
- Error messages are translated
- Button text changes with language

## 🚨 Error Handling

All error messages are internationalized:

```tsx
// Error display
{error && (
  <div className="error">
    {t('app.generateError')}
  </div>
)}
```

## 📱 Responsive Design

The language switcher and all internationalized content work seamlessly across:
- Desktop
- Tablet
- Mobile devices

## 🔍 Debugging

To debug i18n issues:

1. **Enable debug mode** in `i18n.ts`:
```tsx
i18n.init({
  // ...
  debug: true,
  // ...
});
```

2. **Check console** for missing translations
3. **Verify translation keys** match exactly
4. **Test language switching** functionality

## 📈 Performance

- **Translations loaded once** at app initialization
- **Templates generated dynamically** when language changes
- **Efficient re-rendering** with React.useMemo
- **LocalStorage caching** for language preference

## 🎯 Best Practices

1. **Use semantic keys**: `form.fields.mainTopic` instead of `mainTopic`
2. **Keep translations consistent** across languages
3. **Test both languages** thoroughly
4. **Use the custom hook** for complex i18n operations
5. **Group related translations** logically

## 🔄 Future Enhancements

Potential improvements:
- Add more languages (French, Spanish, Chinese, etc.)
- Implement plural forms
- Add context-aware translations
- Create translation management interface
- Add automated translation validation

## ✅ Testing

To test the i18n implementation:

1. **Switch languages** using the UI
2. **Check all text elements** are translated
3. **Verify form functionality** in both languages
4. **Test story generation** with different language prompts
5. **Check localStorage persistence**

---

**Note**: This implementation provides a complete internationalization solution optimized for the AI Story Generator application, with special attention to prompt optimization for each language. 