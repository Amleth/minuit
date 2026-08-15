import type ContextPatternItem from "./InterfaceContextPatternItem.ts";
import PatternGroupItem from "./PatternGroupItem.ts";
import type PatternItem from "./PatternItem.ts";

export default class Functionn
	extends PatternGroupItem
	implements ContextPatternItem
{
	public name: string;
	public parameters: string[] = [];

	constructor(name: string) {
		super();
		this.name = name;
	}

	addChild(item: PatternItem): void {
		this.children.push(item);
	}
}
