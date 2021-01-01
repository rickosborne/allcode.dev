export enum CodeLanguage {
  bash = 'bash',
  basic = 'basic',
  c = 'c',
  cpp = 'cpp',
  csharp = 'csharp',
  java = 'java',
  js = 'js',
  pascal = 'pascal',
  perl = 'perl',
  php = 'php',
  python = 'python',
  ruby = 'ruby',
  typescript = 'typescript',
}

export type CodeLanguageKey = keyof typeof CodeLanguage;

export const LANGUAGE_NAME: Record<CodeLanguage, string> = {
  bash: 'Bash',
  basic: 'BASIC',
  c: 'C',
  cpp: 'C++',
  csharp: 'C#',
  java: 'Java',
  js: 'Javascript',
  pascal: 'Pascal',
  perl: 'Perl',
  php: 'PHP',
  python: 'Python',
  ruby: 'Ruby',
  typescript: 'TypeScript'
};
