import type { LineTypesEnum } from "../consts.ts";
import type { Token } from "./Token.ts";

export default class Line {
	public number: number;
	public content: string;
	public type: LineTypesEnum;
	public tokens: Token[];

	constructor(number: number, content: string, type: LineTypesEnum) {
		this.number = number;
		this.content = content;
		this.type = type;
		this.tokens = [];
	}
}
