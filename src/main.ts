import * as ohm from "https://esm.sh/ohm-js";
import { Score } from "./model/Score.ts";
import { process } from "./scoreFileStringProcessing.ts";
import { makeScore } from "./semantics.ts";

const sep = () => console.log('🍣'.repeat(33));

const input = Deno.readTextFileSync(Deno.args[0]);
const grammar = ohm.grammar(Deno.readTextFileSync("src/minuit.ohm"));

sep();
const scoreString: string = process(input);

sep();
console.log(scoreString);
const match = grammar.match(scoreString);
if (!match.succeeded()) {
    console.log('❌', (match as ohm.FailedMatchResult).message);
    Deno.exit(1);
}

sep();
const score: Score = makeScore(grammar, match);
score.print();