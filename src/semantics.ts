import * as ohm from "https://esm.sh/ohm-js";
import { Score } from "./model/Score.ts";
import { Pattern } from "./model/Pattern.ts";

export type Context = {
    patternId?: string;
};

export function makeScore(grammar: ohm.Grammar, match: ohm.MatchResult): Score {
    const score = new Score();
    const semantics = grammar.createSemantics();
    semantics.addOperation("ast(ctx)", {
        Start(lines) {
            return lines.children.map(line => line.ast({ ...this.args.ctx } as Context));
        },
        Line(lane) {
            return lane.ast({ ...this.args.ctx } as Context);
        },
        PatternPitchLaneLine(_patternId, _: string, __: string, ___: string, lane: string) {
            this.args.ctx.patternId = _patternId.sourceString;
            return lane.ast({ ...this.args.ctx } as Context);
        },
        PatternRhythmLaneLine(_patternId, _: string, __: string, ___: string, lane: string) {
            this.args.ctx.patternId = _patternId.sourceString;
            return lane.ast({ ...this.args.ctx } as Context);
        },
        PitchLane(pitchSymbolNodes) {
            const pattern = score.getPattern(this.args.ctx.patternId);
            if (pattern) {
                pattern.pitchLane = pitchSymbolNodes.children.map(n => n.sourceString);
            }
        },
        RhythmLane(rhythmSymbolNodes) {
            const pattern = score.getPattern(this.args.ctx.patternId);
            if (pattern) {
                pattern.rhythmLane = rhythmSymbolNodes.children.map(n => n.sourceString);
            }
        },
    });
    const ast = semantics(match).ast({ patternId: "", laneType: "" } as Context);

    return score;
}