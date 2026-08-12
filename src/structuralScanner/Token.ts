import type { TokenType } from "../consts.ts";
import { PatternItem } from "./PatternItem.ts";

export class Token extends PatternItem {
	public type: TokenType;

	constructor(type: TokenType, value: string) {
		super(value);
		this.type = type;
	}
}
