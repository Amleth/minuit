export class Pattern {
    id: string;
    pitchLane: string[] = [];
    rhythmLane: string[] = [];

    constructor(id: string) {
        this.id = id;
    }
}
