from dataclasses import dataclass
from mido import Message


@dataclass
class NoteEvent:
    channel: int
    note_number: int
    velocity: int
    start: int
    end: int

    def to_midi_messages_with_absolute_time(self):
        return (
            MidiMessageWithAbsoluteTime(
                "note_on", self.channel, self.note_number, self.velocity, self.start
            ),
            MidiMessageWithAbsoluteTime(
                "note_off", self.channel, self.note_number, 0, self.end
            ),
        )


@dataclass()
class MidiMessageWithAbsoluteTime:
    type: str
    channel: int
    note_number: int
    velocity: int
    time: int


class Score:
    def __init__(self):
        self.note_events = list[NoteEvent]

    def sort(self):
        pass
