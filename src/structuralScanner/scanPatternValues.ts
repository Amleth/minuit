import {
	functionNameRegExp,
	SYMBOL_FUNCTION_NAME,
	SYMBOL_FUNCTION_OPEN,
	SYMBOL_FUNCTION_TRANSFORMATOR,
	PITCH_DUODECIMAL_VALUES,
} from "../consts.ts";
import type ContextPatternItem from "./patternItems/InterfaceContextPatternItem.ts";
import type PatternItem from "./patternItems/PatternItem.ts";
import PatternStringValues from "./patternItems/PatternStringValues.ts";
import Transformator from "./patternItems/Transformator.ts";

export default function scanPatternValues(input: string): PatternItem[] {
	const patternItems: PatternItem[] = [];
	const context: PatternItem[] = [];
	let pos: number = 0;
	let currentContiguousPatternValues: string = "";

	function flushPatternStringValues() {
		if (currentContiguousPatternValues === "") return;
		const item = new PatternStringValues(currentContiguousPatternValues);
		if (context.length === 0) {
			patternItems.push(item);
		} else {
			(context.at(-1) as ContextPatternItem).addChild(item);
		}
		currentContiguousPatternValues = "";
	}

	while (pos < input.length) {
		let char = input[pos];

		console.log(context);

		if (PITCH_DUODECIMAL_VALUES.includes(char)) {
			currentContiguousPatternValues += char;
		} else {
			flushPatternStringValues();
		}

		if (char === SYMBOL_FUNCTION_TRANSFORMATOR) {
			// Attempt to read the function name
			const match = input
				.slice(pos)
				.match(new RegExp(`^\\~\\((${functionNameRegExp}):`));
			if (match) {
				const functionName = match[1];
				pos = pos + match[0].length;
				const i = new Transformator(functionName);
				patternItems.push(i);
				context.push(i);
				continue;
			} else {
				throw new Error(
					`A "${SYMBOL_FUNCTION_TRANSFORMATOR}" must be followed by a valid function.`,
				);
			}
		}

		pos++;
	}

	flushPatternStringValues();

	return patternItems;
}
