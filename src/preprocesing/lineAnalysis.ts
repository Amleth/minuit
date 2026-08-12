import {
	LINE_TYPES,
	LineTypeCategoryEnum,
	type LineTypesEnum,
} from "../consts.ts";
import type Line from "../structuralScanner/Line.ts";
import { PatternLine } from "../structuralScanner/PatternLine.ts";

export default function (input: string): Line[] {
	const lines: Line[] = [];
	const inputLines = input.split(/\r?\n/);

	for (let i = 0; i < inputLines.length; i++) {
		let matches = null;

		for (const lineTypeData of LINE_TYPES) {
			matches = inputLines[i].match(lineTypeData.lineRegExp);
			if (matches) {
				if (lineTypeData.category === LineTypeCategoryEnum.PatternDeclaration) {
					const line = new PatternLine(
						inputLines[i],
						lineTypeData.type as LineTypesEnum,
						matches[3],
						parseInt(matches[2], 10),
					);
					lines.push(line);
					break;
				}
			}
		}

		if (!matches && lines.length >= 1) {
			lines.slice(-1)[0].input += ` ${inputLines[i]}`;
			lines.slice(-1)[0].value += ` ${inputLines[i]}`;
		}
	}
	return lines;
}
