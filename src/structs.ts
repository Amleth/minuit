import type { LineTypeEnum, Token } from "./consts.ts";

export class Line {
	public number: number;
	public content: string;
	public type: LineTypeEnum;
	public tokens: Token[];
	public patternNumber: number;
	public patternValues: string;
	public isValid: boolean = true;

	constructor(
		number: number,
		content: string,
		type: LineTypeEnum,
		patternNumber: number,
		patternValues: string,
	) {
		this.number = number;
		this.content = content;
		this.type = type;
		this.tokens = [];
		this.patternNumber = patternNumber;
		this.patternValues = patternValues.trim();
	}
}
