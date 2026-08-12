import type { LineTypesEnum } from "../consts.ts";
import Line from "./Line.ts";

export class PatternLine extends Line {
	public patternNumber: number;

	constructor(
		input: string,
		type: LineTypesEnum,
		value: string,
		patternNumber: number,
	) {
		super(input, type, value);
		this.patternNumber = patternNumber;
	}
}
