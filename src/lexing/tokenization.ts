import { LineTypeEnum } from "../consts.ts";
import type { Line } from "../structs.ts";
import DuodecimalPitchValuesSequenceLexer from "./DuodecimalPitchValuesSequenceLexer.ts";

export function chooseTokenizer(line: Line) {
	switch (line.type) {
		case LineTypeEnum.CC:
		case LineTypeEnum.G:
		case LineTypeEnum.PA:
		case LineTypeEnum.PD:
			line.tokens = new DuodecimalPitchValuesSequenceLexer(
				line.patternValues,
			).tokenize();
			break;
		case LineTypeEnum.PL:
		case LineTypeEnum.PM:
		case LineTypeEnum.R:
		case LineTypeEnum.RS:
		case LineTypeEnum.V:
	}
}
