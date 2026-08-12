import {
	SYMBOL_FUNCTION_OPEN,
	SYMBOL_FUNCTION_TRANSFORMATOR,
} from "../consts.ts";
import type PatternItem from "./patternItems/PatternItem.ts";
import PatternStringValues from "./patternItems/PatternStringValues.ts";

enum Contexts {
	IN_FUNCTION_GENERATOR,
	IN_FUNCTION_TRANSFORMATOR,
	IN_GROUP,
	IN_CHORD,
	IN_SUB,
}

export default function scanPatternValues(input: string): PatternItem[] {
	const patternItems: PatternItem[] = [];
	let pos: number = 0;
	let currentContiguousPatternValues: string = "";

	function flushPatternStringValues() {
		if (currentContiguousPatternValues === "") return;
		patternItems.push(new PatternStringValues(currentContiguousPatternValues));
		currentContiguousPatternValues = "";
	}

	while (pos < input.length) {
		let char = input[pos];

		if (char === SYMBOL_FUNCTION_TRANSFORMATOR) {
			flushPatternStringValues();
			pos++;
			char = input[pos];
			if (char !== SYMBOL_FUNCTION_OPEN) {
				throw new Error(
					`a "${SYMBOL_FUNCTION_TRANSFORMATOR}" must be followed by a "${SYMBOL_FUNCTION_OPEN}"`,
				);
			}
			pos++;
			continue;
		}

		currentContiguousPatternValues += char;
		pos++;
	}

	flushPatternStringValues();

	return patternItems;
}
