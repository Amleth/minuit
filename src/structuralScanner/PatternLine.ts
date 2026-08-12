import type { LineTypesEnum } from "../consts.ts";
import Line from "./Line.ts";

export class PatternLine extends Line {
	public patternNumber: number;
	public patternValues: string;

	constructor(
		number: number,
		content: string,
		type: LineTypesEnum,
		patternNumber: number,
		patternValues: string,
	) {
		super(number, content, type);
		this.patternNumber = patternNumber;
		this.patternValues = patternValues.trim();
	}
}
