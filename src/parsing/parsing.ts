import {
	CLOSE_GROUP,
	OPEN_GROUP,
	CLOSE_PATTERN_SYMBOL,
	OPEN_PATTERN_SYMBOL,
} from "../consts.ts";
import { unbalancedSymbolsError } from "../errors.ts";
import type { Line } from "../structs.ts";
import { areSymbolsBalanced } from "./common.ts";

export default function parseLine(line: Line): Line {
	for (const pair of [
		[OPEN_GROUP, CLOSE_GROUP],
		[OPEN_PATTERN_SYMBOL, CLOSE_PATTERN_SYMBOL],
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
