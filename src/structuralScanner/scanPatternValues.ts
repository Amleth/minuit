import {
	functionNameRegExp,
	SYMBOL_FUNCTION_NAME,
	SYMBOL_FUNCTION_OPEN,
	SYMBOL_FUNCTION_TRANSFORMATOR,
} from "../consts.ts";
import type PatternItem from "./patternItems/PatternItem.ts";
import PatternStringValues from "./patternItems/PatternStringValues.ts";
import Transformator from "./patternItems/Transformator.ts";

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

			// Check that the transformator symbol is followed by the open function symbol
			if (char !== SYMBOL_FUNCTION_OPEN) {
				throw new Error(
					`a "${SYMBOL_FUNCTION_TRANSFORMATOR}" must be followed by a "${SYMBOL_FUNCTION_OPEN}"`,
				);
			}

			// Attempt to read the function name
			const match = input
				.slice(pos)
				.match(new RegExp(`^\\((${functionNameRegExp}):`));
			if (match) {
				const functionName = match[1];
				pos = pos + 2 + functionName.length;
				patternItems.push(new Transformator(functionName));
				continue;
			} else {
				throw new Error(
					`A "${SYMBOL_FUNCTION_TRANSFORMATOR}${SYMBOL_FUNCTION_OPEN}" must be followed by a valid function name and then by a "${SYMBOL_FUNCTION_NAME}"`,
				);
			}
		}

		currentContiguousPatternValues += char;
		pos++;
	}

	flushPatternStringValues();

	return patternItems;
}
