import { Line } from "./consts.ts";
import clean from "./preprocesing/cleaning.ts";
import substituteSymboles from "./preprocesing/symbolSubstitution.ts";
import analyse from "./tokenization/lineAnalysis.ts";

const sep = () => console.log("🌲".repeat(33));

sep();
let input = Deno.readTextFileSync(Deno.args[0]);
input = substituteSymboles(input);
input = clean(input);
const lines: Line[] = analyse(input);
console.log(lines);
