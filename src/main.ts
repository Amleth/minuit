import * as ohm from "https://esm.sh/ohm-js";
import { process } from "./ScoreFileStringProcessing.ts";
import { makeScore } from "./semantics.ts";
import { Score } from "./model/Score.ts";

const sep = () => console.log('🍣'.repeat(33));

const input = Deno.readTextFileSync(Deno.args[0]);
const grammar = ohm.grammar(Deno.readTextFileSync("src/minuit.ohm"));

sep();
const scoreString: string = process(input)
console.log(scoreString);
const match = grammar.match(scoreString);
if (!match.succeeded()) {
    console.log('❌', match.message);
}

sep();
const score: Score = makeScore(grammar, match);
score.print();