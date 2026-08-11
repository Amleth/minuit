import { LineTypesEnum } from "../consts.ts";
import type { Line } from "../structs.ts";
import DuodecimalPitchValuesSequenceLexer from "./DuodecimalPitchValuesSequenceLexer.ts";

export function chooseTokenizer(line: Line) {
	switch (line.type) {
		case LineTypesEnum.CC:
		case LineTypesEnum.G:
		case LineTypesEnum.PA:
		case LineTypesEnum.PD:
			line.tokens = new DuodecimalPitchValuesSequenceLexer(
				line.patternValues,
			).tokenize();
			break;
		case LineTypesEnum.PL:
		case LineTypesEnum.PM:
		case LineTypesEnum.R:
		case LineTypesEnum.RS:
		case LineTypesEnum.V:
	}
}
