import { LINE_TYPES, type LineTypesEnum } from "../consts.ts";
import { Line } from "../structs.ts";

export default function (input: string): Line[] {
	const lines: Line[] = [];
	const inputLines = input.split(/\r?\n/);
	for (let i = 0; i < inputLines.length; i++) {
		let matches = null;
		for (const [lineType, lineTypeData] of Object.entries(LINE_TYPES)) {
			matches = inputLines[i].match(lineTypeData.lineRegExp);
			if (matches) {
				const line = new Line(
					i,
					inputLines[i],
					lineType as LineTypesEnum,
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
