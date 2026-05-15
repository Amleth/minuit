import * as ohm from "https://esm.sh/ohm-js";

export function debug(grammar: ohm.Grammar, match: ohm.MatchResult): void {
    const semantics = grammar.createSemantics();

    semantics.addOperation("ast", {
        _nonterminal(...children) {
            return {
                type: this.ctorName,
                children: children.map(c => c.ast()),
            };
        },
        _terminal() {
            return this.sourceString;
        },
        _iter(...children) {
            return children.map(c => c.ast());
        },
        pitchSymbol(a) {
            return this.sourceString;
        },
        rhythmSymbol(a) {
            return this.sourceString;
        },
    });

    const ast = semantics(match).ast();
    console.log(JSON.stringify(ast, null, 4));
    console.log(ast.children.length);
}