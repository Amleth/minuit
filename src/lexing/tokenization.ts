import { LineTypeEnum } from "../consts.ts";
import type { Line } from "../structs.ts";
import { tokenize } from "./duodecimalPitchPattern.ts";

export function chooseTokenizer(line: Line): Line {
	switch (line.type) {
		case LineTypeEnum.CC:
		case LineTypeEnum.G:
		case LineTypeEnum.PA:
		case LineTypeEnum.PD:
			line.tokens = tokenize(line.patternValues);
			break;
		case LineTypeEnum.PL:
		case LineTypeEnum.PM:
		case LineTypeEnum.R:
		case LineTypeEnum.RS:
		case LineTypeEnum.V:
	}

	return line;
}
