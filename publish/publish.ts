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
import {ManagedPath} from "./ManagedPath";
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

const INTEGRITY_ALGO = "sha512";

export interface Syntax {
  asset: Asset;
  fileKey?: string;
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
  asset: (key: string) => Asset;
  assetForLanguage: (langId: string) => Asset;
  languageLabelOf: (source: WalkthroughSource) => string;
  languagesOf: (item: HasSingleLanguage | HasMultiLanguage) => string[];
  markup: (data: string) => string;
  unique: <T>(items: T[]) => T[];
}

export interface Asset {
  href: string;
  integrity: string;
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
    asset: (assetKey: string): Asset => {
      const asset = assets.find(a => a.key === assetKey);
      if (asset == null) {
        throw new Error(`Unknown assetPath: ${assetKey}`);
      }
      return asset;
    },
    assetForLanguage: langId => languages[langId].asset,
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
  console.log(`.  ${name}: ${data.title}`);
  return {
    fileName,
    name,
    slug: name.replace(/\.ya?ml$/, ""),
    walkthrough: data,
  };
}

const fileHash: ((filePath: string, mangle: boolean) => string) & {rehash: (fileName: string, content: string) => void} = (() => {
  const cache: Record<string, string> = {};
  const maybeMangle: (hash: string, mangle: boolean) => string = (hash, mangle) => {
    return mangle ? hash.replace(/[^a-zA-Z0-9]+/g, "") : hash;
  };
  function makeHash(text: string): string {
    return crypto
      .createHash(INTEGRITY_ALGO)
      .update(text)
      .digest("base64")
  }
  function fileHash(filePath: string, mangle: boolean): string {
    const existing = cache[filePath];
    if (existing != null) {
      return maybeMangle(existing, mangle);
    }
    const hash = makeHash(fs.readFileSync(filePath, {encoding: "utf8"}));
    cache[filePath] = hash;
    return maybeMangle(hash, mangle);
  }
  fileHash.rehash = function rehash(fileName: string, content: string): void {
    cache[fileName] = makeHash(content);
  };
  return fileHash;
})();

function scriptHash(scriptPath: string, mangle: boolean): string {
  return fileHash(`./node_modules/${scriptPath}`, mangle);
}

function langScriptHash(langId: string, mangle: boolean): string {
  return scriptHash(`prismjs/components/prism-${langId}.min.js`, mangle);
}

export const WALKTHROUGH_REF_REGEX = /^walkthrough\s+(\S+)$/;

const walkthroughContainerHandler = (
  lesson: Lesson,
  walksthrough: WalkthroughResource[],
  renderWalkthrough: Renderer<LessonAndWalkthrough>,
  templateTools: TemplateTools,
  languages: Record<string, Syntax>,
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
      console.log(`*  ${lesson.relative} references ${walkthrough.name}`);
      const summary: WalkthroughSummary = {
        fileName: walkthrough.fileName,
        languages: (walkthrough.walkthrough.sources || []).flatMap(s => hasSingleLanguage(s) ? s.language : s.languages),
        name: walkthrough.name,
        slug: walkthrough.slug,
        title: walkthrough.walkthrough.title,
      };
      lesson.walksthrough.push(summary);
      summary.languages.map(langId => languages[langId].fileKey || langId).forEach(langId => {
        if (!lesson.languages.includes(langId)) {
          lesson.languages.push(langId);
        }
      });
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
  managedPath: ManagedPath,
  walksthrough: WalkthroughResource[],
  renderLessonHtml: Renderer<Lesson & TemplateTools>,
  renderWalkthrough: Renderer<LessonAndWalkthrough>,
  templateTools: TemplateTools,
  languages: Record<string, Syntax>,
): void {
  const md = new MarkdownIt(markdownItOptions)
    .use(MarkdownItContainer, "walkthrough", walkthroughContainerHandler(lesson, walksthrough, renderWalkthrough, templateTools, languages));
  lesson.html = md.render(lesson.body);
  const outHtml = renderLessonHtml(Object.assign({}, lesson, templateTools));
  managedPath.mkDir(lesson.meta.slug);
  managedPath.write(path.join(lesson.meta.slug,"index.html"), outHtml);
}

function loadLesson(inDir: string, relative: string, name: string): Lesson {
  const absolute = path.join(inDir, relative);
  const text = fs.readFileSync(absolute, {encoding: "utf8"});
  const maybeMatter = frontMatter.default<unknown>(text);
  const expectedSlug = relative
    .replace(/\.md$/i, "")
    .replace(/\/?index$/i, "")
  ;
  if (!isLessonFrontMatter(maybeMatter.attributes, true)) {
    throw new Error(`Failed to parse front matter in ${relative}`)
  }
  const matter: LessonFrontMatter = Object.assign({}, maybeMatter.attributes);
  console.log(`.  ${name}: ${maybeMatter.attributes.title || "?"}`);
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

function copyAsset(
  outRelative: string,
  managedPath: ManagedPath,
  inDir = path.resolve(__dirname, "../assets"),
  inRelative: string = outRelative,
  addHash = true,
  rootDirName = "assets",
  processor?: (text: string) => string,
): Asset {
  const inPath = path.join(inDir, inRelative);
  let fileName = outRelative;
  let content: string | undefined;
  if (processor != null) {
    content = processor(fs.readFileSync(inPath, {encoding: "utf8"}));
    fileHash.rehash(inPath, content);
  }
  if (addHash) {
    fileName = fileName.replace(".", `-${fileHash(inPath, true)}.`);
  }
  const asset: Asset = {
    href: `/${rootDirName}/${fileName}`,
    integrity: INTEGRITY_ALGO + "-" + fileHash(inPath, false),
    key: outRelative,
  };
  managedPath.mkDir(rootDirName, path.dirname(fileName));
  if (processor == null || content == null) {
    managedPath.copy(inPath, rootDirName, fileName);
  } else {
    managedPath.write(path.join(rootDirName, fileName), content);
  }
  return asset;
}

function copyAssets(managedPath: ManagedPath, languages: Record<string, Syntax>): Asset[] {
  const viewer = copyAsset("AmbleViewerElement.css", managedPath, "../webcomponents/src");
  const button = copyAsset("AmbleButtonElement.css", managedPath, "../webcomponents/src");
  const code = copyAsset("AmbleCodeElement.css", managedPath, "../webcomponents/src");
  const assets = [
    copyAsset("prismjs/prism.js", managedPath, "./node_modules"),
    copyAsset("ac-logo.svg", managedPath),
    copyAsset("allcode.css", managedPath),
    copyAsset("LessonFrontMatter-v1.schema.json", managedPath, ".", undefined, false, "schema"),
    copyAsset("Walkthrough-v1.schema.json", managedPath, ".", undefined, false, "schema"),
    copyAsset("amble.css", managedPath, "../webcomponents/src"),
    copyAsset("prismjs/prism-markup-templating.min.js", managedPath, "./node_modules", "prismjs/components/prism-markup-templating.min.js"),
    viewer,
    button,
    code,
    copyAsset("allcode-amble.js.map", managedPath, "../webcomponents", "allcode-amble.js.map", false),
    copyAsset("allcode-amble.js", managedPath, "../webcomponents", "allcode-amble.js", true, undefined, js => {
      return js.replace(/"src\/([^.]+\.css)"/g, (all, fileName) => {
        for (const asset of [viewer, button, code]) {
          if (fileName === asset.key) {
            return `"${asset.href}"`;
          }
        }
        throw new Error(`Tried to replace href for unknown asset ${fileName}`);
      });
    }),
  ];
  assets.push(...Object.keys(languages).map(langId => {
    const key = languages[langId].fileKey || langId;
    const newAsset = copyAsset(
      `prismjs/prism-${langId}.min.js`,
      managedPath,
      "./node_modules",
      `prismjs/components/prism-${key}.min.js`,
    );
    languages[langId].asset = newAsset;
    return newAsset
  }));
  return assets;
}

function objectMap<T, U>(value: Record<string, T>, mapper: (key: string, value: T) => U): Record<string, U> {
  return Object.keys(value).reduce((prev, key) => {
    prev[key] = mapper(key, value[key]);
    return prev;
  }, {} as Record<string, U>);
}

function publishLessons(inDir: string, managedPath: ManagedPath, languages: Record<string, Syntax>, assets: Asset[]): void {
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
        console.warn(`!! unknown file type: ${file.name}`);
      }
    } else if (file.isDirectory()) {
      console.log(`.  ${relative}/`);
      managedPath.mkDir(relative);
    }
    return WalkResult.CONTINUE;
  });

  const walkthroughHtml = fs.readFileSync(path.join(__dirname, "walkthroughTemplate.ejs.html"), {encoding: "utf8"});
  const renderWalkthrough: Renderer<LessonAndWalkthrough> = ejs.compile(walkthroughHtml);
  const lessonHtml = fs.readFileSync(path.join(__dirname, "lesson.ejs.html"), {encoding: "utf8"});
  const renderLessonHtml: Renderer<Lesson & TemplateTools> = ejs.compile(lessonHtml);
  const templateTools = buildTemplateTools(languages, assets);

  lessons.forEach(lesson => {
    renderLesson(lesson, managedPath, walksthrough, renderLessonHtml, renderWalkthrough, templateTools, languages);
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
    const cleanHash = langScriptHash(key, false);
    const mangledHash = langScriptHash(key, true);
    return Object.assign({
      asset: {
        href: `/assets/prismjs/prism-${key}-${mangledHash}.min.js`,
        integrity: `${INTEGRITY_ALGO}-${cleanHash}`,
        key: `prismjs/prism-${langId}.min.js`,
      },
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

  const managedPath = new ManagedPath(options.out);
  if (options.clean) {
    managedPath.markAllForRemoval();
  }
  const languages = loadLanguages();
  const assets = copyAssets(managedPath, languages);
  publishLessons(options.in, managedPath, languages, assets);
  managedPath.applyChanges();
}

run();
