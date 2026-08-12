import { LineTypesEnum } from "../consts.ts";
import type Line from "../structuralScanner/Line.ts";

export function chooseTokenizer(line: Line): void {
	switch (line.type) {
		case LineTypesEnum.PatternDeclarationCC:
		case LineTypesEnum.PatternDeclarationG:
		case LineTypesEnum.PatternDeclarationPA:
		case LineTypesEnum.PatternDeclarationPD:
			// line.tokens = new DuodecimalPitchValuesSequenceLexer(
			// 	line.patternValues,
			// ).tokenize();
			break;
		case LineTypesEnum.PatternDeclarationPL:
		case LineTypesEnum.PatternDeclarationPM:
		case LineTypesEnum.PatternDeclarationR:
		case LineTypesEnum.PatternDeclarationRS:
		case LineTypesEnum.PatternDeclarationV:
	}
}
