export class Pattern {
    id: string;

    constructor(id: string) {
        this.id = id;
    }

    emoji():string {
        return `🧊 ${this.id}`;
    }
}
