import { assertEquals } from "@std/assert";
import shiftGroup from "./shiftGroup.ts";

Deno.test("shift group", () => {
	assertEquals(shiftGroup("(f:)crabaraque", "(", ")"), "(f:)");
	assertEquals(shiftGroup("(f:0;(0))crabaraque", "(", ")"), "(f:0;(0))");
});
