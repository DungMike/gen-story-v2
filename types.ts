export interface StoryFormData {
  topic: string;
  narrativeStyle: string;
  mainCharacterName: string;
  mainCharacterDesc: string;
  setting: string;
  settingDesc: string;
  chapters: Record<string, string>;
  wordCount: number;
}

export interface TemplateField {
  id: string;
  label: string;
  type: "select" | "text" | "textarea";
  options?: string[];
  placeholder?: string;
  chapter: number;
  description: string;
}

export interface StoryTemplate {
  id: string;
  name: string;
  description: string;
  gradient: string;
  chapters: Record<number, string>;
  fields: TemplateField[];
}

export interface ChapterContent {
  title: string;
  content: string;
}