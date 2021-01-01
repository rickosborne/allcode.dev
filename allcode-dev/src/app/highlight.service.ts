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

function highlight(code: string, language: string): string {
  const grammar = prism.languages[language];
  if (grammar == null) {
    console.warn(`No grammar for language: ${language}`);
    return '';
  }
  try {
    return prism.highlight(code, grammar, language)
      .split(/\r\n|[\r\n]/g)
      .map((line, index) => `<span class="line line-${index+1}">${line}</span>`)
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
  ngOnInit(): void {
    Prism.manual = true;
    (prism as unknown as Record<string, any>)['manual'] = true;
  }

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
}
