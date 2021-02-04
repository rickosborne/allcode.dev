/* eslint-disable @typescript-eslint/no-var-requires */
import "prismjs";

import {Command} from "commander";
import * as console from "console";
import * as crypto from "crypto";
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
  hash: string;
  href: string;
  label: string;
  prism: unknown;
}

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
  hashedAssetPath: (assetPath: string) => string;
  languageAssetPath: (langId: string) => string;
  languageLabelOf: (source: WalkthroughSource) => string;
  languagesOf: (item: HasSingleLanguage | HasMultiLanguage) => string[];
  markup: (data: string) => string;
  unique: <T>(items: T[]) => T[];
}

export interface Asset {
  href: string;
  key: string;
}

export interface LessonAndWalkthrough extends WalkthroughResource, TemplateTools {
  lesson: Lesson;
}

const markdownItOptions = {
  html: true,
  typographer: true,
};

function buildTemplateTools(
  languages: Record<string, Syntax>,
  assets: Asset[],
): TemplateTools {
  return {
    hashedAssetPath: (assetKey: string): string => {
      const asset = assets.find(a => a.key === assetKey);
      if (asset == null) {
        throw new Error(`Unknown assetPath: ${assetKey}`);
      }
      return asset.href;
    },
    languageAssetPath: (langId: string): string => {
      return languages[langId].href;
    },
    languageLabelOf: (source: WalkthroughSource): string => {
      return `${(hasSingleLanguage(source) ? [source.language] : source.languages).map(lang => {
        const syntax = languages[lang];
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
    unique: <T>(items: T[]): T[] => items.reduce((prev, cur) => {
      if (!prev.includes(cur)) {
        prev.push(cur);
      }
      return prev;
    }, [] as T[]),
  };
}

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

const fileHash: (filePath: string) => string = (() => {
  const cache: Record<string, string> = {};
  return function fileHash(filePath: string): string {
    const existing = cache[filePath];
    if (existing != null) {
      return existing;
    }
    const hash = crypto
      .createHash("sha256")
      .update(fs.readFileSync(filePath, {encoding: "utf8"}))
      .digest("base64")
      .replace(/[^a-zA-Z0-9]+/g, "");
    cache[filePath] = hash;
    return hash;
  };
})();

function scriptHash(scriptPath: string): string {
  return fileHash(`./node_modules/${scriptPath}`)
}

function langScriptHash(langId: string): string {
  return scriptHash(`prismjs/components/prism-${langId}.min.js`);
}

export const WALKTHROUGH_REF_REGEX = /^walkthrough\s+(\S+)$/;

const walkthroughContainerHandler = (
  lesson: Lesson,
  walksthrough: WalkthroughResource[],
  renderWalkthrough: Renderer<LessonAndWalkthrough>,
  templateTools: TemplateTools,
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
  templateTools: TemplateTools,
): void {
  const lessonDir = path.join(outDir, lesson.meta.slug);
  const md = new MarkdownIt(markdownItOptions)
    .use(MarkdownItContainer, "walkthrough", walkthroughContainerHandler(lesson, walksthrough, renderWalkthrough, templateTools));
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

function copyAsset(
  outRelative: string,
  outDir: string,
  inDir = path.resolve(__dirname, "../assets"),
  inRelative: string = outRelative,
  addHash = true,
): Asset {
  const inPath = path.join(inDir, inRelative);
  let fileName = outRelative;
  if (addHash) {
    fileName = fileName.replace(".", `-${fileHash(inPath)}.`);
  }
  fs.mkdirSync(path.join(outDir, "assets", path.dirname(fileName)), {recursive: true});
  const outPath = path.join(outDir, "assets", fileName);
  console.log(`=> ${outRelative}`);
  fs.copyFileSync(inPath, outPath);
  return {
    href: "/assets/" + fileName,
    key: outRelative,
  };
}

function copyAssets(outDir: string, languages: Record<string, Syntax>): Asset[] {
  const assets = [
    copyAsset("prismjs/prism.js", outDir, "./node_modules"),
    copyAsset("ac-logo.svg", outDir),
  ];
  assets.push(...Object.keys(languages).map(langId => {
    const key = languages[langId].fileKey || langId;
    return copyAsset(
      `prismjs/prism-${langId}.min.js`,
      outDir,
      "./node_modules",
      `prismjs/components/prism-${key}.min.js`,
    );
  }));
  return assets;
}

function objectMap<T, U>(value: Record<string, T>, mapper: (key: string, value: T) => U): Record<string, U> {
  return Object.keys(value).reduce((prev, key) => {
    prev[key] = mapper(key, value[key]);
    return prev;
  }, {} as Record<string, U>);
}

function publishLessons(inDir: string, outDir: string, languages: Record<string, Syntax>, assets: Asset[]): void {
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
  const templateTools = buildTemplateTools(languages, assets);

  lessons.forEach(lesson => {
    renderLesson(lesson, outDir, walksthrough, renderLessonHtml, renderWalkthrough, templateTools);
  });
}

function loadLanguages(): Record<string, Syntax> {
  return objectMap({
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
  }, (langId, orig) => {
    const key = orig.fileKey || langId;
    const hash = langScriptHash(key);
    return Object.assign({
      hash,
      href: `/assets/prismjs/prism-${key}-${hash}.min.js`,
    }, orig);
  });
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
  const languages = loadLanguages();
  const assets = copyAssets(options.out, languages);
  publishLessons(options.in, options.out, languages, assets);
}

run();
