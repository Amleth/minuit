import { Line, type LineTypeEnum, lineStarts } from "../consts.ts";

export default function (input: string): Line[] {
	const lines: Line[] = [];
	const inputLines = input.split(/\r?\n/);
	for (let i = 0; i < inputLines.length; i++) {
		let matches = null;
		for (const lineType in lineStarts) {
			const regexp = lineStarts[lineType as LineTypeEnum].regexp;
			matches = inputLines[i].match(regexp);
			if (matches) {
				const line = new Line(i, inputLines[i], lineType as LineTypeEnum);
				lines.push(line);
				break;
			}
		}
		if (!matches) {
			lines[i - 1].content += ` ${inputLines[i]}`;
		}
	}

	return lines;
}
