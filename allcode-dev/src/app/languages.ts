export enum CodeLanguage {
  c = 'c',
  cpp = 'cpp',
  csharp = 'csharp',
  java = 'java',
  php = 'php',
  typescript = 'typescript',
}

export type CodeLanguageKey = keyof typeof CodeLanguage;
