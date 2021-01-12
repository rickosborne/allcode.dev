import {Injectable, OnInit} from '@angular/core';

import * as prism from 'prismjs';

import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-basic';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-pascal';
import 'prismjs/components/prism-perl';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-typescript';

declare var Prism: any;

export type CachingHighlighter = (code: string, language: string) => string;

export const opNames: Record<string, string> = {
  '+': 'plus',
  '-': 'minus',
  '*': 'star',
  '/': 'slash',
  '\\': 'backslash',
  '++': 'plusplus',
  '--': 'minusminus',
  '**': 'starstar',
  '^': 'caret',
  '!': 'bang',
  '%': 'percent',
  '&&': 'andand',
  '&amp;&amp;': 'andand',
  '&': 'and',
  '&amp;': 'and',
  '||': 'oror',
  '|': 'or',
  '=': 'eq',
  '>': 'gt',
  '&gt;': 'gt',
  '>=': 'gte',
  '&gt;=': 'gte',
  '<': 'lt',
  '&lt;': 'lt',
  '<=': 'lte',
  '&lt;=': 'lte',
  '==': 'eqeq',
  '<>': 'gtlt',
  '&lt;&gt;': 'gtlt',
  '!=': 'neq',
  '?': 'q',
  ':': 'colon',
  ':=': 'coloneq',
  '=>': 'eqgt',
  '=&gt;': 'eqgt',
  '->': 'rarr',
  '-&gt;': 'rarr',
};

function highlight(code: string, language: string): string {
  const grammar = prism.languages[language];
  if (grammar == null) {
    console.warn(`No grammar for language: ${language}`);
    return '';
  }
  try {
    const typeCounts: Record<string, number> = {};
    const cleanAndCount = (prefix: string, value: string): string[] => {
      const clean = value.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
      const key = `${prefix}-${clean}`;
      const count = (typeCounts[key] || 0) + 1;
      typeCounts[key] = count;
      return [key, `${key}-${count}`];
    };

    return prism.highlight(code, grammar, language)
      .split(/\r\n|[\r\n]/g)
      .map((line, index) => {
        const l = line
          .replace(/<span\s+class="(.+?)">(.*?)<\/span>/g, (all, classNames: string, value: string) => {
            const cns = classNames.split(/\s+/g);
            for (const type of ['variable', 'keyword', 'class-name', 'annotation', 'boolean', 'namespace', 'number']) {
              if (cns.includes(type)) {
                cns.push(...cleanAndCount(type, value));
              }
            }
            if (cns.includes('operator')) {
              const opName = opNames[value];
              if (opName != null) {
                cns.push(...cleanAndCount('operator', opName));
              }
            }
            return `<span class="${cns.join(' ')}">${value}</span>`;
          })
          .replace(/((?:^|<\/span>)[ \t]*)([a-zA-Z0-9_]+)([ \t]*(?:<span|$))/, (all, pre: string, mid: string, post: string) => {
            return `${pre}<span class="bare ${cleanAndCount('bare', mid).join(' ')}">${mid}</span>${post}`;
          });
        return `<span class="line line-${index + 1}">${l}</span>`;
      })
      .join('\n');
  } catch (err) {
    console.error('Error while highlighting', language, code, err);
  }
  return '!';
}


@Injectable({
  providedIn: 'root'
})
export class HighlightService implements OnInit {
  constructor() {
  }

  public buildCachingHighlighter(): CachingHighlighter {
    const cache: Record<string, Record<string, string>> = {};
    return (code, language): string => {
      let snips = cache[language];
      if (snips == null) {
        snips = {};
        cache[language] = snips;
      }
      let html = snips[code];
      if (html != null) {
        return html;
      }
      html = highlight(code, language);
      snips[code] = html;
      return html;
    };
  }

  ngOnInit(): void {
    Prism.manual = true;
    (prism as unknown as Record<string, any>)['manual'] = true;
  }
}
