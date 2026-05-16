import * as ohm from "https://esm.sh/ohm-js";
import { Score } from "./model/Score.ts";
import { Pattern } from "./model/Pattern.ts";

export type Context = {
    patternId?: string;
};

export function makeScore(grammar: ohm.Grammar, match: ohm.MatchResult): Score {
    const score = new Score();
    const semantics = grammar.createSemantics();
    semantics.addOperation("ast", {
        Start(lines) {
            return {
                lines: lines.children.map(line => line.ast())
            };
        },
        Line(line) {
            return line.ast();
        },
        PatternPitchLaneLine(_patternId, _1: string, _2: string, _3: string, lane: string) {
            return {
                patternId: _patternId.sourceString,
                pitchLane: lane.ast()
            }
        },
        PatternRhythmLaneLine(_patternId, _1: string, _2: string, _3: string, lane: string) {
            return {
                patternId: _patternId.sourceString,
                rhythmLane: lane.ast()
            }
        },
        PitchLane(pitchSymbolNodes) {
            // return pitchSymbolNodes.children.map(n => n.sourceString);
            return pitchSymbolNodes.children.map(n => n.ast());
        },
        pitchClassDodecaSymbol(_1, _2) {
            return this.sourceString;
        },
        pitchClassLetterSymbol(_1, _2, _3) {
            return this.sourceString;
        },
        chord(_1, pitchSymbols, _2) {
            return {
                chord: pitchSymbols.children.map(n => n.ast())
            };
        },
        RhythmLane(rhythmSymbolNodes) {
            return rhythmSymbolNodes.children.map(n => n.ast());
        },
        decimal(_1, _2, _3) {
            return this.sourceString;
        },
        fraction(_1, _2, _3) {
            return this.sourceString;
        },
        integer(_1) {
            return this.sourceString;
        },
        tie(_1, _2, _3) {
            return {
                tie: this.sourceString.split("_")
            };
        },
        SequencingLine(_1, sequencedItems) {
            return {
                sequencedItems: sequencedItems.children.map(n => n.ast())
            };
        },
        SequencedItem(_1) {
            if (_1.isIteration()) {
                return _1.asIteration().map(n => n.ast());
            }
            else if (_1.isTerminal()) {
                return _1.sourceString;
            }
            else if (_1.isNonterminal()) {
                return _1.ast();
            }
        },
        HorizontalGroup(_leftSquareBracket, content, _rightSquareBracket) {
            return {
                sequencedItems: content.children.map(n => n.ast())
            }
        },
        VerticalGroup(_leftAngleBracket, content, _rightAngleBracket) {
            return {
                parallelItems: content.children.map(n => n.ast())
            }
        },
        patternName(_1, _2) {
            return this.sourceString;
        },
        _terminal() {
            return this.sourceString;
        },
        _iter(...children) {
            // return children.map(n => n.ast());
        }
    });
    const ast = semantics(match).ast();
    console.log(JSON.stringify(ast, null, 4));

    return score;
}