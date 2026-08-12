import { assertEquals } from "@std/assert";
import { areSymbolsBalanced } from "./balance.ts";

Deno.test("check balance", () => {
	assertEquals(true, areSymbolsBalanced("", "(", ")"));
	assertEquals(true, areSymbolsBalanced("()", "(", ")"));
	assertEquals(true, areSymbolsBalanced("(0)", "(", ")"));
	assertEquals(true, areSymbolsBalanced("(0(0))", "(", ")"));
	assertEquals(true, areSymbolsBalanced("(0(0(0)))", "(", ")"));
	assertEquals(false, areSymbolsBalanced("(", "(", ")"));
	assertEquals(false, areSymbolsBalanced(")", "(", ")"));
	assertEquals(false, areSymbolsBalanced("(0(0(0))", "(", ")"));
	assertEquals(false, areSymbolsBalanced("(00(0)))", "(", ")"));
});
