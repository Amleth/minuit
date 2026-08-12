import PatternItem from "./PatternItem.ts";

export default class PatternStringValue extends PatternItem {
	public value: string;

	constructor(value: string) {
		super();
		this.value = value;
	}
}
