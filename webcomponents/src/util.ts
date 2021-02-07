export function spinal(s: string | null | undefined): string {
	return (s == null ? '' : s)
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-');
}

export function detectEOL(s: string): string {
	for (const eol of ['\r\n', '\r', '\n']) {
		if (s.includes(eol)) {
			return eol;
		}
	}
	return '';
}

export function unindent(source: string): string {
	const delimiter = detectEOL(source);
	if (delimiter === '') {
		// single line
		return source.replace(/^\s+|\s+$/g, '');
	}
	const lines = source.split(delimiter);
	while (lines.length > 0 && lines[0].match(/^\s*$/)) {
		lines.shift();
	}
	while (lines.length > 0 && lines[lines.length - 1].match(/^\s*$/)) {
		lines.pop();
	}
	if (lines.length === 0) {
		return '';
	}
	const first = lines[0];
	const initialMatch = first.match(/^(\s+)/);
	if (initialMatch == null) {
		return lines.join(delimiter);
	}
	const leading = initialMatch[0];
	return lines
		.map((line) => {
			if (line.startsWith(leading)) {
				return line.substr(leading.length);
			}
			return line;
		})
		.join(delimiter);
}

export function undefIfEmpty(value: string | null | undefined): string | undefined {
	return value == null || value === '' ? undefined : value;
}

export function catchAndLog(promise: Promise<unknown> | undefined | null, message?: string): void {
	if (promise != null) {
		promise.catch((err) => console.error(message, err));
	}
}

export function isNothing(value: unknown): boolean {
  return value == null || value === '';
}
