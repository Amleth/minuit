import * as ohm from "https://esm.sh/ohm-js";

const input = Deno.readTextFileSync(Deno.args[0]);
const grammar = ohm.grammar(Deno.readTextFileSync("src/minuit.ohm"));

const match = grammar.match(input);
if (match.succeeded()) {
    console.log('✅ Syntaxe valide');
} else {
    console.log('❌', match.message);
}

const semantics = grammar.createSemantics();

semantics.addOperation('eval', {
    Exp_plus(left, _op, right) {
        return left.eval() + right.eval();
    },
    Term_times(left, _op, right) {
        return left.eval() * right.eval();
    },
    Fact_paren(_open, exp, _close) {
        return exp.eval();
    },
    number(digits) {
        return parseInt(this.sourceString, 10);
    }
});

const result = semantics(match).eval();
console.log(result); // 11