import { assertEquals } from "@std/assert";
import Generator from "./patternItems/Generator.ts";
import PatternStringValue from "./patternItems/PatternStringValues.ts";
import Transformator from "./patternItems/Transformator.ts";
import scanPattern from "./scanPattern.ts";

Deno.test("scan pattern", () => {
	let x = "";
	let res = null;

	res = scanPattern("0");
	assertEquals(res.length, 1);
	assertEquals(res[0] instanceof PatternStringValue, true);
	assertEquals((res[0] as PatternStringValue).value === "0", true);

	res = scanPattern("~(f:)");
	assertEquals(res.length, 1);
	assertEquals(res[0] instanceof Transformator, true);

	res = scanPattern("~(f:p1;p2;p3)");
	assertEquals(res.length, 1);
	assertEquals(res[0] instanceof Transformator, true);
	assertEquals((res[0] as Transformator).parameters.length, 3);

	res = scanPattern("(g:)~(f:p1;p2;p3)");
	assertEquals(res.length, 2);
	assertEquals(res[0] instanceof Generator, true);
	assertEquals((res[0] as Generator).name === "g", true);
	assertEquals((res[0] as Generator).parameters.length, 0);
	assertEquals(res[1] instanceof Transformator, true);
	assertEquals((res[1] as Transformator).name === "f", true);
	assertEquals((res[1] as Transformator).parameters.length, 3);
});
