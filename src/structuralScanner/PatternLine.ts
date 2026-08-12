import type { LineTypesEnum } from "../consts.ts";
import Line from "./Line.ts";
import type PatternItem from "./patternItems/PatternItem.ts";

export class PatternLine extends Line {
	public patternNumber: number;
	public items: PatternItem[] = [];

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
