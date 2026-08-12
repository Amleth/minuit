import {
	SYMBOL_CHORD_CLOSE,
	SYMBOL_CHORD_OPEN,
	SYMBOL_FUNCTION_CLOSE,
	SYMBOL_FUNCTION_OPEN,
	SYMBOL_GROUP_CLOSE,
	SYMBOL_GROUP_OPEN,
	SYMBOL_PATTERN_VARIABLE_CLOSE,
	SYMBOL_PATTERN_VARIABLE_OPEN,
	SYMBOL_SUB_CLOSE,
	SYMBOL_SUB_OPEN,
} from "../consts.ts";
import { areSymbolsBalanced } from "./balance.ts";

export default function (input: string) {
	for (const symbols of [
		[SYMBOL_GROUP_OPEN, SYMBOL_GROUP_CLOSE],
		[SYMBOL_FUNCTION_OPEN, SYMBOL_FUNCTION_CLOSE],
		[SYMBOL_PATTERN_VARIABLE_OPEN, SYMBOL_PATTERN_VARIABLE_CLOSE],
		[SYMBOL_CHORD_OPEN, SYMBOL_CHORD_CLOSE],
		[SYMBOL_SUB_OPEN, SYMBOL_SUB_CLOSE],
	]) {
		if (!areSymbolsBalanced(input, symbols[0], symbols[1])) {
			throw new Error(
				`Unbalanced "${symbols[0]}${symbols[1]}" in: "${input}".`,
			);
		}
	}
}
