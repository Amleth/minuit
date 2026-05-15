import { Pattern } from "./Pattern.ts"

export class Score {
    private patterns: Map<string, Pattern> = new Map();

    addPattern(pattern: Pattern) {
        this.patterns.set(pattern.id, pattern);
    }

    emoji():string {
        return '💾'
    }
}