import { MidnightSymbols, TokenType } from "../consts.ts";
import { unbalancedSymbolsError } from "../errors.ts";
import type { Line } from "../structs.ts";
import { areSymbolsBalanced } from "./common.ts";

export default function parseLine(line: Line): Line {
	for (const pair of [
		[
			MidnightSymbols[TokenType.SYMBOL_CHORD_OPEN],
			MidnightSymbols[TokenType.SYMBOL_CHORD_CLOSE],
		],
		[
			MidnightSymbols[TokenType.SYMBOL_GROUP_OPEN],
			MidnightSymbols[TokenType.SYMBOL_GROUP_CLOSE],
		],
		[
			MidnightSymbols[TokenType.SYMBOL_PATTERN_VARIABLE_OPEN],
			MidnightSymbols[TokenType.SYMBOL_PATTERN_VARIABLE_CLOSE],
		],
	]) {
		if (!areSymbolsBalanced(line.patternValues, pair[0], pair[1])) {
			throw unbalancedSymbolsError(line, pair[0], pair[1]);
		}
	}

	for (const token of line.tokens) {
		console.log(`Token: type=${token.type}, value=${token.value}`);
	}

	return line;
}
