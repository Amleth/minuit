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
						i,
						inputLines[i],
						lineTypeData.type as LineTypesEnum,
						parseInt(matches[2], 10),
						matches[3],
					);
					lines.push(line);
					break;
				}
			}
		}
		if (!matches && lines.length > 1) {
			lines[i - 1].content += ` ${inputLines[i]}`;
			if (lines[i - 1] instanceof PatternLine) {
				(lines[i - 1] as PatternLine).patternValues += ` ${inputLines[i]}`;
			}
		}
	}
	return lines;
}
