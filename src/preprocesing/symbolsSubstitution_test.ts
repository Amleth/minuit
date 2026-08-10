import { assertEquals } from "@std/assert";
import process from "./symbolsSubstitution.ts";

Deno.test("symbols substitution", () => {
	assertEquals(process("🌲=038\nPD0=🌲"), "PD0=038");
});
