import { checkPrime } from "node:crypto";
import {
	functionNameRegExp,
	SYMBOL_FUNCTION_CLOSE,
	SYMBOL_FUNCTION_OPEN,
	SYMBOL_FUNCTION_PARAMETER_SEPARATOR,
	SYMBOL_FUNCTION_TRANSFORMATOR,
} from "../consts.ts";
import { getClosingCharacterDistance } from "./helpers.ts";
import Generator from "./patternItems/Generator.ts";
import type ContextPatternItem from "./patternItems/InterfaceContextPatternItem.ts";
import type PatternItem from "./patternItems/PatternItem.ts";
import PatternStringValues from "./patternItems/PatternStringValues.ts";
import Transformator from "./patternItems/Transformator.ts";

const transformatorBeginRegExp = new RegExp(
	`^${SYMBOL_FUNCTION_TRANSFORMATOR}\\((${functionNameRegExp}):`,
);

const generatorBeginRegExp = new RegExp(`^\\((${functionNameRegExp}):`);

export default function scanPattern(input: string, depth = 0): PatternItem[] {
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
		const char = input[pos];

		if (transformatorBeginRegExp.test(input.slice(pos))) {
			const match = input.slice(pos).match(transformatorBeginRegExp);
			if (match) {
				const functionName = match[1];
				const i = new Transformator(functionName);
				const z =
					getClosingCharacterDistance(
						input.slice(pos),
						SYMBOL_FUNCTION_OPEN,
						SYMBOL_FUNCTION_CLOSE,
					) + 1;
				const parameters = input
					.slice(pos, z + pos)
					.slice(3 + functionName.length, -1)
					.split(SYMBOL_FUNCTION_PARAMETER_SEPARATOR);

				patternItems.push(i);
				pos += z;

				for (const parameter of parameters) {
					if (parameter.length > 0) {
						i.parameters.push(scanPattern(parameter, depth + 1));
					}
				}
			}
			continue;
		}

		if (generatorBeginRegExp.test(input.slice(pos))) {
			const match = input.slice(pos).match(transformatorBeginRegExp);
			if (match) {
				const functionName = match[1];
				const i = new Generator(functionName);
				const z =
					getClosingCharacterDistance(
						input.slice(pos),
						SYMBOL_FUNCTION_OPEN,
						SYMBOL_FUNCTION_CLOSE,
					) + 1;
				const parameters = input
					.slice(pos, z + pos)
					.slice(2 + functionName.length, -1)
					.split(SYMBOL_FUNCTION_PARAMETER_SEPARATOR);

				patternItems.push(i);
				pos += z;

				for (const parameter of parameters) {
					if (parameter.length > 0) {
						i.parameters.push(scanPattern(parameter, depth + 1));
					}
				}
			}
			continue;
		}

		currentContiguousPatternValues += char;
		pos++;
	}

	flushPatternStringValues();

	return patternItems;
}
