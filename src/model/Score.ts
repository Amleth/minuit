import { Pattern } from "./Pattern.ts"

export class Score {
    private patterns: Map<string, Pattern> = new Map();

    addPattern(pattern: Pattern) {
        this.patterns.set(pattern.id, pattern);
    }

    getPattern(id: string): Pattern | undefined {
        let p = this.patterns.get(id);
        if (p) return p;
        else {
            p = new Pattern(id);
            this.addPattern(p)
            return this.getPattern(id);
        }
    }

    emoji(): string {
        return '💾'
    }

    print() {
        console.log(this.emoji());
        this.patterns.forEach(pattern => {
            console.log('🧊', pattern.id);
            console.log('    🌴 pitch lane:', pattern.pitchLane.join(' '));
            console.log('    👾 rhythm lane:', pattern.rhythmLane.join(' '));
        });
    }
}