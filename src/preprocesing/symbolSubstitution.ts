export default function process(input: string): string {
	let lines = input.split(/\r?\n/);
	const symbolsDict: Record<string, string> = {};
	const r: RegExp = /(\p{Extended_Pictographic})=(.*)/u;

	for (const line of lines) {
		const symbolMatch = line.match(r);
		if (symbolMatch) {
			symbolsDict[symbolMatch[1]] = symbolMatch[2];
		}
	}

	lines = lines.filter((line) => line.match(r) === null);

	for (const [symbol, symbolValue] of Object.entries(symbolsDict)) {
		for (let i = 0; i < lines.length; i++) {
			lines[i] = lines[i].replaceAll(symbol, symbolValue);
		}
	}

	return lines.join("\n");
}
