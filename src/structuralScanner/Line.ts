import type { LineTypesEnum } from "../consts.ts";

export default class Line {
	public input: string;
	public type: LineTypesEnum;
	public value: string;

	constructor(input: string, type: LineTypesEnum, value: string) {
		this.input = input;
		this.type = type;
		this.value = value.trim();
	}
}
