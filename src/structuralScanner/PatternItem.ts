export class PatternItem {
	public value: string;
	public children: PatternItem[] = [];

	constructor(value: string) {
		this.value = value;
	}
}
