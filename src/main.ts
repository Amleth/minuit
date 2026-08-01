import type { Line, Token } from "./consts.ts";
import parseLine from "./parsing/parsing.ts";
import clean from "./preprocesing/cleaning.ts";
import substituteSymboles from "./preprocesing/symbolSubstitution.ts";
import analyse from "./tokenization/lineAnalysis.ts";
import { chooseTokenizer } from "./tokenization/tokenization.ts";

const sep = () => console.log("🌲".repeat(33));

sep();
let input = Deno.readTextFileSync(Deno.args[0]);
input = substituteSymboles(input);
input = clean(input);
const lines: Line[] = analyse(input);
for (const line of lines) {
	console.log(line);
	chooseTokenizer(line);
	console.log(line);
	parseLine(line);
	console.log(line);
}
