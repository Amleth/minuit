import { PATTERN_TYPES } from "../consts.ts";
import { Line } from "../structs.ts";

export default function (input: string): Line[] {
	const lines: Line[] = [];
	const inputLines = input.split(/\r?\n/);
	for (let i = 0; i < inputLines.length; i++) {
		let matches = null;
		for (const [k, v] of Object.entries(PATTERN_TYPES)) {
			matches = inputLines[i].match(v.lineRegex);
			if (matches) {
				const line = new Line(
					i,
					inputLines[i],
					v,
					parseInt(matches[2], 10),
					matches[3],
				);
				lines.push(line);
				break;
			}
		}
		if (!matches && lines.length > 1) {
			lines[i - 1].content += ` ${inputLines[i]}`;
			lines[i - 1].patternValues += ` ${inputLines[i]}`;
		}
	}
	return lines;
}
