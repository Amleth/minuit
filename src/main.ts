import check from "./checking/check.ts";
import clean from "./preprocesing/cleaning.ts";
import analyseLines from "./preprocesing/lineAnalysis.ts";
import substituteSymbols from "./preprocesing/symbolsSubstitution.ts";
import type { Line } from "./structs.ts";

const sep = () => console.log("🌲".repeat(33));

sep();

let input = Deno.readTextFileSync(Deno.args[0]);
input = substituteSymbols(input);
input = clean(input);
const lines: Line[] = analyseLines(input);
for (const line of lines) {
	check(line.patternValues);
	console.log(line);
	// chooseTokenizer(line);
	// console.log(line);
	// parseLine(line);
}
