export abstract class Event {
    type: string
    channel: number
    start: number
    end: number

    constructor(type: string, channel: number, start: number, end: number) {
        this.type = type;
        this.channel = channel;
        this.start = start;
        this.end = end;
    }
}

export class NoteEvent extends Event {
    noteNumber: number
    velocity: number


    constructor(channel: number, noteNumber: number, velocity: number, start: number, end: number) {
        super("note", channel, start, end);
        this.noteNumber = noteNumber;
        this.velocity = velocity;
    }

    to_midi_messages_with_absolute_time(): [MidiMessageWithAbsoluteTime, MidiMessageWithAbsoluteTime] {
        return [
            new MidiMessageWithAbsoluteTime(
                "note_on", this.channel, this.noteNumber, this.velocity, this.start
            ),
            new MidiMessageWithAbsoluteTime(
                "note_off", this.channel, this.noteNumber, 0, this.end
            )
        ]
    }
}

export class MidiMessageWithAbsoluteTime {
    type: string
    channel: number
    note_number: number
    velocity: number
    time: number

    constructor(type: string, channel: number, note_number: number, velocity: number, time: number) {
        this.type = type;
        this.channel = channel;
        this.note_number = note_number;
        this.velocity = velocity;
        this.time = time;
    }
}

export class Track {
    events: NoteEvent[] = [];
}