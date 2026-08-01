import type { Line } from "../structs.ts";
import { areParenthesesBalanced } from "./common.ts";

export default function parseLine(line: Line): Line {
	if (!areParenthesesBalanced(line.patternValues)) {
		line.isValid = false;
	}
	return line;
}
