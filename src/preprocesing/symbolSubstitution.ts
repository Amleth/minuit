import emojiRegex from "npm:emoji-regex";

export default function process(input: string): string {
	let lines = input.split(/\r?\n/);
	const symbolsDict: Record<string, string> = {};

	for (const line of lines) {
		if (line.startsWith("$")) {
			const symbolMatch = line.match(/\$(.*?)=(.*)/);
			if (symbolMatch) {
				if (emojiRegex().test(symbolMatch[1])) {
					symbolsDict[symbolMatch[1]] = symbolMatch[2];
				}
			}
		}
	}

	lines = lines.filter((line) => !line.startsWith("$"));

	for (const [symbol, symbolValue] of Object.entries(symbolsDict)) {
		for (let i = 0; i < lines.length; i++) {
			lines[i] = lines[i].replaceAll(symbol, symbolValue);
		}
	}

	return lines.join("\n");
}
