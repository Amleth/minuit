import analyse from "./lexing/lineAnalysis.ts";
import { chooseTokenizer } from "./lexing/tokenization.ts";
import parseLine from "./parsing/parsing.ts";
import clean from "./preprocesing/cleaning.ts";
import substituteSymbols from "./preprocesing/symbolsSubstitution.ts";
import type { Line } from "./structs.ts";

const sep = () => console.log("🌲".repeat(33));

sep();
let input = Deno.readTextFileSync(Deno.args[0]);
input = substituteSymbols(input);
input = clean(input);
const lines: Line[] = analyse(input);
for (const line of lines) {
	chooseTokenizer(line);
	const parsedLine = parseLine(line);
	console.log(parsedLine);
}
