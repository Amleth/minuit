import * as ohm from "https://esm.sh/ohm-js";
import { process } from "./ScoreFileStringProcessing.ts";
import { debug } from "./ohm.ts";

const input = Deno.readTextFileSync(Deno.args[0]);
const grammar = ohm.grammar(Deno.readTextFileSync("src/minuit.ohm"));

const score: string = process(input)
console.log('🍣'.repeat(33));
console.log(score);

const match = grammar.match(score);
if (!match.succeeded()) {
    console.log('❌', match.message);
}

debug(grammar, match);