import PatternItem from "./PatternItem.ts";

export default class PatternGroupItem
	extends PatternItem
	implements PatternGroupItem
{
	public children: PatternItem[] = [];
}
