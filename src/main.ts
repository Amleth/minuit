import * as ohm from "https://esm.sh/ohm-js";
import { process } from "./ScoreFileStringProcessing.ts";
import { debug } from "./ohm.ts";
import { Score } from "./model/Score.ts";

const sep = () => console.log('🍣'.repeat(33));

const input = Deno.readTextFileSync(Deno.args[0]);
const grammar = ohm.grammar(Deno.readTextFileSync("src/minuit.ohm"));

const scoreString: string = process(input)
sep();
console.log(scoreString);

const match = grammar.match(scoreString);
if (!match.succeeded()) {
    console.log('❌', match.message);
}

// debug(grammar, match);

sep();
const score = new Score();
const semantics = grammar.createSemantics();
semantics.addOperation("ast", {
    Start(lines) {
        console.log(score.emoji());
        return lines.children.map(line => line.ast());
    },
    Line(lane) {
        return lane.ast();
    },
    PatternPitchLaneLine(a, b, c, d, e) {
        console.log(a.sourceString);
        console.log(b.sourceString);
        console.log(c.sourceString);
        console.log(d.sourceString);
        console.log(e.sourceString);
        return "coucou";
    },
    PatternRhythmLaneLine(a, b, c, d, e) {
        return "kiki";
    },
});
const ast = semantics(match).ast();
console.log(ast);