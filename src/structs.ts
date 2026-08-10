import type { LineTypeEnum, Token } from "./consts.ts";

export class Line {
	public number: number;
	public content: string;
	public type: object;
	public tokens: Token[];
	public patternNumber: number;
	public patternValues: string;

	constructor(
		number: number,
		content: string,
		type: object,
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
