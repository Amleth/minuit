import type PatternItem from "./PatternItem.ts";

export default interface ContextPatternItem {
	addChild(item: PatternItem): void;
}
