import { type LineTypeEnum, lineStarts } from "../consts.ts";
import { Line } from "../structs.ts";

//TODO d'abord rassembler les lignes séparées
export default function (input: string): Line[] {
	const lines: Line[] = [];
	const inputLines = input.split(/\r?\n/);
	for (let i = 0; i < inputLines.length; i++) {
		let matches = null;
		for (const lineType in lineStarts) {
			const regexp = lineStarts[lineType as LineTypeEnum].regexp;
			matches = inputLines[i].match(regexp);
			if (matches) {
				const line = new Line(
					i,
					inputLines[i],
					lineType as LineTypeEnum,
					parseInt(matches[2], 10),
					matches[3],
				);
				lines.push(line);
				break;
			}
		}
		if (!matches) {
			lines[i - 1].content += ` ${inputLines[i]}`;
			lines[i - 1].patternValues += ` ${inputLines[i]}`;
		}
	}
	return lines;
}
