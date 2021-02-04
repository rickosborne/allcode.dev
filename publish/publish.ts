/* eslint-disable @typescript-eslint/no-var-requires */
import "prismjs";

import {Command} from "commander";
import * as console from "console";
import * as ejs from "ejs";
import * as frontMatter from "front-matter";
import fs from "fs";
import MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";
import MarkdownItContainer from "markdown-it-container";
import path from "path";
import process from "process";
import yaml from "yaml";

import {isLessonFrontMatter, LessonFrontMatter} from "./LessonFrontMatter";
import * as pkg from "./package.json";
import {HasTitle} from "./RefLink";
import {walk, WalkResult} from "./walk";
import {
  HasMultiLanguage,
  HasSingleLanguage,
  hasSingleLanguage,
  isWalkthrough,
  Walkthrough,
  WalkthroughSource,
} from "./Walkthrough";

const perl = require("prismjs/components/prism-perl.js");
const java = require("prismjs/components/prism-java.js");
const c = require("prismjs/components/prism-c.js");
const cpp = require("prismjs/components/prism-cpp.js");
const csharp = require("prismjs/components/prism-csharp.js");
const typescript = require("prismjs/components/prism-typescript.js");
const php = require("prismjs/components/prism-php.js");
const ruby = require("prismjs/components/prism-ruby.js");
const bash = require("prismjs/components/prism-bash.js");
const basic = require("prismjs/components/prism-basic.js");
const pascal = require("prismjs/components/prism-pascal.js");
const python = require("prismjs/components/prism-python.js");
const javascript = require("prismjs/components/prism-javascript.js");

export interface Syntax {
  fileKey?: string;
  label: string;
  prism: unknown;
}

const LANGUAGES: Record<string, Syntax> = {
  bash: {label: "Bash", prism: bash},
  basic: {label: "BASIC", prism: basic},
  c: {label: "C", prism: c},
  cpp: {label: "C++", prism: cpp},
  csharp: {label: "C#", prism: csharp},
  ecmascript6: {fileKey: "javascript", label: "Ecmascript 6", prism: javascript},
  java: {label: "Java", prism: java},
  javascript: {label: "Javascript", prism: javascript},
  pascal: {label: "Pascal", prism: pascal},
  perl: {label: "Perl 5", prism: perl},
  php: {label: "PHP", prism: php},
  python: {label: "Python", prism: python},
  ruby: {label: "Ruby", prism: ruby},
  typescript: {label: "TypeScript", prism: typescript},
};

export type Renderer<T> = (data: T) => string;

export interface WalkthroughResource {
  fileName: string;
  name: string;
  slug: string;
  walkthrough: Walkthrough;
}

export type WalkthroughSummary = HasTitle & HasMultiLanguage & Partial<WalkthroughResource>;

export interface Lesson {
  absolute: string;
  body: string;
  bodyBegin?: number;
  html: string;
  languages: string[];
  meta: LessonFrontMatter;
  name: string;
  relative: string;
  // noinspection SpellCheckingInspection
  walksthrough: WalkthroughSummary[];
}

export interface TemplateTools {
  languageLabelOf: (source: WalkthroughSource) => string;
  languagesOf: (item: HasSingleLanguage | HasMultiLanguage) => string[];
  markup: (data: string) => string;
}

export interface LessonAndWalkthrough extends WalkthroughResource, TemplateTools {
  lesson: Lesson;
}

const markdownItOptions = {
  html: true,
  typographer: true,
};

const templateTools: TemplateTools = {
  languageLabelOf: (source: WalkthroughSource) => {
    return `${(hasSingleLanguage(source) ? [source.language] : source.languages).map(lang => {
      const syntax = LANGUAGES[lang];
      if (syntax == null) {
        throw new Error(`No such language "${lang}" in walkthrough`);
      }
      return syntax.label;
    }).join(" | ")}`;
  },
  languagesOf: item => {
    if (hasSingleLanguage(item)) {
      return [item.language];
    } else {
      return item.languages;
    }
  },
  markup: (() => {
    const md = new MarkdownIt(markdownItOptions);
    return (data: string): string => md.renderInline(data).trim();
  })(),
};

function loadWalkthrough(inDir: string, fileName: string, name: string): WalkthroughResource {
  const fullPath = path.join(path.join(inDir, fileName));
  const text = fs.readFileSync(fullPath, {encoding: "utf8"});
  let data;
  try {
    data = yaml.parse(text, {prettyErrors: true});
  } catch (e) {
    const message: string = e.message;
    let linePart = "";
    const match = message == null ? undefined : message.match(/at line (\d+)/);
    if (match != null) {
      linePart = `:${match[1]}`;
    }
    console.error(`Error while parsing YAML:\n${path.resolve(fullPath)}${linePart}`);
    throw e;
  }
  if (!isWalkthrough(data, true)) {
    throw new Error(`Invalid data in: ${fileName}`);
  }
  console.log(`  ${name}: ${data.title}`);
  return {
    fileName,
    name,
    slug: name.replace(/\.ya?ml$/, ""),
    walkthrough: data,
  };
}

export const WALKTHROUGH_REF_REGEX = /^walkthrough\s+(\S+)$/;

const walkthroughContainerHandler = (
  lesson: Lesson,
  walksthrough: WalkthroughResource[],
  renderWalkthrough: Renderer<LessonAndWalkthrough>,
): unknown => {
  const getWalkthroughName: (info: string) => string | undefined = info => {
    if (info == null) {
      return undefined;
    }
    const line = info.trim().match(WALKTHROUGH_REF_REGEX);
    if (line == null || line[1] == null) {
      return undefined;
    }
    const name = line[1].trim();
    return name === "" ? undefined : name;
  };
  return {
    render: (tokens: Token[], index: number): string => {
      const token = tokens[index];
      const walkthroughName = getWalkthroughName(token.info);
      if (walkthroughName == null) {
        return "";
      }
      const walkthrough = walksthrough.find(w => w.slug === walkthroughName);
      if (walkthrough == null) {
        throw new Error(`Unknown walkthrough "${walkthroughName}" in ${lesson.relative}`);
      }
      console.log(`${lesson.relative} references ${walkthrough.name}`);
      const summary: WalkthroughSummary = {
        fileName: walkthrough.fileName,
        languages: (walkthrough.walkthrough.sources || []).flatMap(s => hasSingleLanguage(s) ? s.language : s.languages),
        name: walkthrough.name,
        slug: walkthrough.slug,
        title: walkthrough.walkthrough.title,
      };
      lesson.walksthrough.push(summary);
      lesson.languages.push(...summary.languages.filter(l => !lesson.languages.includes(l)));
      return renderWalkthrough(Object.assign({
        lesson,
      }, walkthrough, templateTools));
    },
    validate: (text: string): boolean => {
      return getWalkthroughName(text) !== undefined;
    },
  };
};

function renderLesson(
  lesson: Lesson,
  outDir: string,
  walksthrough: WalkthroughResource[],
  renderLessonHtml: Renderer<Lesson & TemplateTools>,
  renderWalkthrough: Renderer<LessonAndWalkthrough>,
): void {
  const lessonDir = path.join(outDir, lesson.meta.slug);
  const md = new MarkdownIt(markdownItOptions)
    .use(MarkdownItContainer, "walkthrough", walkthroughContainerHandler(lesson, walksthrough, renderWalkthrough));
  lesson.html = md.render(lesson.body);
  const outHtml = renderLessonHtml(Object.assign({}, lesson, templateTools));
  fs.mkdirSync(lessonDir, {recursive: true});
  fs.writeFileSync(path.join(lessonDir, "index.html"), outHtml, {encoding: "utf8"})
  console.log(`${lesson.relative}: ${outHtml.length} bytes`);
}

function loadLesson(inDir: string, relative: string, name: string): Lesson {
  const absolute = path.join(inDir, relative);
  const text = fs.readFileSync(absolute, {encoding: "utf8"});
  const maybeMatter = frontMatter.default<unknown>(text);
  const expectedSlug = relative.replace(/\.md$/i, "");
  if (!isLessonFrontMatter(maybeMatter.attributes, true)) {
    throw new Error(`Failed to parse front matter in ${relative}`)
  }
  const matter: LessonFrontMatter = Object.assign({}, maybeMatter.attributes);
  console.log(`  ${name}: ${maybeMatter.attributes.title || "?"}`);
  if (matter.slug == null) {
    matter.slug = expectedSlug;
  } else if (matter.slug !== expectedSlug) {
    throw new Error(`Mismatching slug in ${relative}: expected "${expectedSlug}", found "${maybeMatter.attributes.slug}"`);
  }
  // noinspection SpellCheckingInspection
  return {
    absolute,
    body: maybeMatter.body,
    bodyBegin: maybeMatter.bodyBegin,
    html: "",
    languages: [],
    meta: matter,
    name,
    relative,
    walksthrough: [],
  };
}

function clean(dir: string): void {
  const dirs: string[] = [];
  walk(dir, ({file, relative}) => {
    if (file.isFile()) {
      console.log(`~ ${relative}`);
      fs.rmSync(path.join(dir, relative));
    } else if (file.isDirectory()) {
      dirs.push(relative);
    }
    return WalkResult.CONTINUE;
  });
  let todo: string | undefined;
  while ((todo = dirs.pop())) {
    console.log(`~ ${todo}/`);
    fs.rmdirSync(path.join(dir, todo));
  }
}

function ensureLanguageScripts(outDir: string, lessons: Lesson[]): void {
  const allLangIds = lessons.reduce((prev, cur) => {
    cur.languages.map(l => LANGUAGES[l].fileKey || l).forEach(l => {
      if (!prev.includes(l)) {
        prev.push(l);
      }
    });
    return prev;
  }, [] as string[]);
  const PRISM_OUT = path.join(outDir, "assets", "prismjs");
  fs.mkdirSync(PRISM_OUT, {recursive: true});
  fs.copyFileSync("./node_modules/prismjs/prism.js", path.join(PRISM_OUT, "prism.js"));
  allLangIds.forEach(langId => {
    console.log(`Language: ${langId}`);
    const langOut = path.join(PRISM_OUT, `prism-${langId}.min.js`);
    fs.copyFileSync(`./node_modules/prismjs/components/prism-${langId}.min.js`, langOut);
  });
}

function copyAssets(outDir: string): void {
  const ASSETS_IN_PATH = path.resolve(__dirname, "../assets");
  fs.mkdirSync(path.join(outDir, "assets"), {recursive: true});
  walk(ASSETS_IN_PATH, ({file, relative}) => {
    if (file.name.startsWith(".")) {
      return WalkResult.SKIP;
    }
    const outPath = path.join(outDir, "assets", relative);
    if (file.isFile()) {
      console.log(`assets/${relative}`);
      fs.copyFileSync(path.join(ASSETS_IN_PATH, relative), outPath);
    } else if (file.isDirectory()) {
      console.log(relative + "/");
      fs.mkdirSync(outPath, {recursive: true});
    }
    return WalkResult.CONTINUE;
  });
}

function publishLessons(inDir: string, outDir: string): void {
  // noinspection SpellCheckingInspection
  const walksthrough: WalkthroughResource[] = [];
  const lessons: Lesson[] = [];

  walk(inDir, ({file, relative}) => {
    if (file.name.startsWith(".")) {
      return WalkResult.SKIP;
    }
    if (file.isFile()) {
      if (file.name.endsWith(".md")) {
        lessons.push(loadLesson(inDir, relative, file.name));
      } else if (file.name.match(/\.ya?ml$/i)) {
        walksthrough.push(loadWalkthrough(inDir, relative, file.name));
      } else {
        console.warn(` ! unknown file type: ${file.name}`);
      }
    } else if (file.isDirectory()) {
      console.log(relative + "/");
      fs.mkdirSync(path.join(outDir, relative), {recursive: true});
    }
    return WalkResult.CONTINUE;
  });

  const walkthroughHtml = fs.readFileSync(path.join(__dirname, "walkthroughTemplate.ejs.html"), {encoding: "utf8"});
  const renderWalkthrough: Renderer<LessonAndWalkthrough> = ejs.compile(walkthroughHtml);
  const lessonHtml = fs.readFileSync(path.join(__dirname, "lesson.ejs.html"), {encoding: "utf8"});
  const renderLessonHtml: Renderer<Lesson & TemplateTools> = ejs.compile(lessonHtml);

  lessons.forEach(lesson => renderLesson(lesson, outDir, walksthrough, renderLessonHtml, renderWalkthrough));

  ensureLanguageScripts(outDir, lessons);
}

function run(args: string[] = process.argv): void {
  const program = new Command();
// noinspection RequiredAttributes
  program
    .version(pkg.version)
    .option("-c,--clean", "clean first", false)
    .requiredOption("-i,--in <path>", "input source directory")
    .requiredOption("-o,--out <path>", "output destination directory")
    .parse(args)
  ;

  const options = program.opts() as unknown as {
    clean: boolean,
    in: string,
    out: string
  };

  if (options.clean) {
    clean(options.out);
  }
  publishLessons(options.in, options.out);
  copyAssets(options.out);
}

run();
