export type CachingHighlighter = (code: string, language: string) => Promise<string>;

export const OP_NAMES: Record<string, string> = {
	'!': 'bang',
	'!=': 'neq',
	'%': 'percent',
	'&': 'and',
	'&&': 'andand',
	'&amp;': 'and',
	'&amp;&amp;': 'andand',
	'&gt;': 'gt',
	'&gt;=': 'gte',
	'&lt;': 'lt',
	'&lt;&gt;': 'gtlt',
	'&lt;=': 'lte',
	'*': 'star',
	'**': 'starstar',
	'+': 'plus',
	'++': 'plusplus',
	'-': 'minus',
	'-&gt;': 'rarr',
	'--': 'minusminus',
	'->': 'rarr',
	'/': 'slash',
	':': 'colon',
	':=': 'coloneq',
	'<': 'lt',
	'<=': 'lte',
	'<>': 'gtlt',
	'=': 'eq',
	'=&gt;': 'eqgt',
	'==': 'eqeq',
	'=>': 'eqgt',
	'>': 'gt',
	'>=': 'gte',
	'?': 'q',
	'\\': 'backslash',
	'^': 'caret',
	'|': 'or',
	'||': 'oror',
};

export const COUNTED_CLASS_NAMES = ['variable', 'keyword', 'class-name', 'annotation', 'boolean', 'namespace', 'number'];

function getPrism(): Promise<unknown> {
	return new Promise<unknown>((resolve, reject) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const existing = ((window as unknown) as any).Prism;
		if (existing != null) {
			resolve(existing);
		} else {
			document.addEventListener('load', () => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const loaded = ((window as unknown) as any).Prism;
				if (loaded == null) {
					reject(new Error('Prism not configured.'));
				} else {
					resolve(loaded);
				}
			});
		}
	});
}

function formatSource(code: string, language: string): Promise<string> {
	return getPrism().then((prism) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const grammar = (prism as any).languages[language];
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

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return (prism as any)
				.highlight(code, grammar, language)
				.split(/\r\n|[\r\n]/g)
				.map((line: string, index: number) => {
					const l = line
						.replace(/<span\s+class="(.+?)">(.*?)<\/span>/g, (all, classNames: string, value: string) => {
							const cns = classNames.split(/\s+/g);
							for (const type of COUNTED_CLASS_NAMES) {
								if (cns.includes(type)) {
									cns.push(...cleanAndCount(type, value));
								}
							}
							if (cns.includes('operator')) {
								const opName = OP_NAMES[value];
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
		return code;
	});
}

export function cachingHighlighter(): CachingHighlighter {
	const cache: Record<string, Record<string, string>> = {};
	return (code, language): Promise<string> => {
		let snips = cache[language];
		if (snips == null) {
			snips = {};
			cache[language] = snips;
		}
		const html = snips[code];
		if (html != null) {
			return Promise.resolve(html);
		}
		const detabified = code.replace(/\t/g, '  ');
		return formatSource(detabified, language).then((html) => {
			snips[code] = html;
			return html;
		});
	};
}
