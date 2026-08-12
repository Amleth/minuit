import PatternGroupItem from "./PatternGroupItem.ts";

export default class Functionn extends PatternGroupItem {
	public name: string;

	constructor(name: string) {
		super();
		this.name = name;
	}
}
