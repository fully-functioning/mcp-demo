import fs from "fs/promises";
import path from "path";
import yaml from "js-yaml";

export interface PromptMetadata {
  name: string;
  languages: string[];
  description: string;
  version: string;
  category?: string;
}

export interface LoadedPrompt {
  metadata: PromptMetadata;
  content: string;
}

export class PromptLoader {
  private prompts = new Map<string, LoadedPrompt>();
  private promptsDir: string;

  constructor(promptsDir?: string) {
    this.promptsDir = promptsDir || path.join(process.cwd(), "prompts");
  }

  async loadAllPrompts(): Promise<void> {
    try {
      const files = await fs.readdir(this.promptsDir);
      
      for (const file of files.filter(f => f.endsWith('.txt'))) {
        const filePath = path.join(this.promptsDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        
        // Check if file has frontmatter (starts with ---)
        if (content.startsWith('---\n')) {
          const parts = content.split('---\n');
          if (parts.length >= 3) {
            try {
              const metadata = yaml.load(parts[1]) as PromptMetadata;
              const promptContent = parts.slice(2).join('---\n').trim();
              
              this.prompts.set(metadata.name, {
                metadata,
                content: promptContent
              });
            } catch (yamlError) {
              console.error(`Error parsing YAML in ${file}:`, yamlError);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error loading prompts:", error);
    }
  }

  getAllSupportedLanguages(): string[] {
    const languages = new Set<string>();
    this.prompts.forEach(prompt => {
      prompt.metadata.languages.forEach(lang => languages.add(lang));
    });
    return Array.from(languages).sort();
  }

  getPromptByName(name: string): LoadedPrompt | undefined {
    return this.prompts.get(name);
  }

  getPromptsByLanguage(language: string): LoadedPrompt[] {
    return Array.from(this.prompts.values())
      .filter(prompt => prompt.metadata.languages.includes(language));
  }

  getPromptsByCategory(category: string): LoadedPrompt[] {
    return Array.from(this.prompts.values())
      .filter(prompt => prompt.metadata.category === category);
  }

  listAllPrompts(): Array<{ name: string; metadata: PromptMetadata }> {
    return Array.from(this.prompts.entries()).map(([name, prompt]) => ({
      name,
      metadata: prompt.metadata
    }));
  }
} 