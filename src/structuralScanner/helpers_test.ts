import { assertEquals, assertThrows } from "@std/assert";
import { getClosingCharacterDistance } from "./helpers.ts";

Deno.test("get closing character distance", () => {
	assertEquals(getClosingCharacterDistance("(...)", "(", ")"), 4);
	assertEquals(getClosingCharacterDistance("...)", "(", ")"), 3);
	assertThrows(() => getClosingCharacterDistance("...", "(", ")"), Error);
});
