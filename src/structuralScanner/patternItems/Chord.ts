import type ContextPatternItem from "./InterfaceContextPatternItem.ts";
import PatternGroupItem from "./PatternGroupItem.ts";
import type PatternItem from "./PatternItem.ts";

export default class Chord
	extends PatternGroupItem
	implements ContextPatternItem
{
	addChild(item: PatternItem): void {
		this.children.push(item);
	}
}
