import check from "./checking/check.ts";
import clean from "./preprocesing/cleaning.ts";
import analyseLines from "./preprocesing/lineAnalysis.ts";
import substituteSymbols from "./preprocesing/symbolsSubstitution.ts";
import { Structure } from "./structuralScanner/Structure.ts";

const sep = () => console.log("🌲".repeat(33));

sep();

let input = Deno.readTextFileSync(Deno.args[0]);
input = substituteSymbols(input);
input = clean(input);

const structure = new Structure();
structure.lines = analyseLines(input);
for (const line of structure.lines) {
	check(line.value);
	// chooseTokenizer(line);
	// console.log(line);
	// parseLine(line);
}
console.log(structure);
