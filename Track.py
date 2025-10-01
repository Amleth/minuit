from enum import Enum
import re

X = 20
DEFAULT_MIDI_NOTE = 60
DEFAULT_RHYTHM_VALUE = 4
DEFAULT_PITCH_CLASS_SYMBOLS_TO_MIDI_NOTES = {
    '0': DEFAULT_MIDI_NOTE,
    '1': DEFAULT_MIDI_NOTE + 1,
    '2': DEFAULT_MIDI_NOTE + 2,
    '3': DEFAULT_MIDI_NOTE + 3,
    '4': DEFAULT_MIDI_NOTE + 4,
    '5': DEFAULT_MIDI_NOTE + 5,
    '6': DEFAULT_MIDI_NOTE + 6,
    '7': DEFAULT_MIDI_NOTE + 7,
    '8': DEFAULT_MIDI_NOTE + 8,
    '9': DEFAULT_MIDI_NOTE + 9,
    'A': DEFAULT_MIDI_NOTE + 10,
    'B': DEFAULT_MIDI_NOTE + 11,
    'a': DEFAULT_MIDI_NOTE + 10,
    'b': DEFAULT_MIDI_NOTE + 11,
}


class PatternLaneTypes(Enum):
    NOTES_AS_PITCH_CLASSES = 'npc'
    GRID = 'g'
    RHYTHM = 'r'


class Pattern:
    def __init__(self):
        self.notes = []
        self.rhythm = []

    def complete(self):
        if len(self.rhythm) == 0:
            for i in self.notes:
                self.rhythm.append(DEFAULT_RHYTHM_VALUE)
        if len(self.notes) == 0:
            for i in self.rhythm:
                self.notes.append(DEFAULT_MIDI_NOTE)

    def check(self):
        if len(self.notes) != len(self.rhythm):
            raise BaseException("Inconsistency between notes and rhythm values lists lengths.")


class Track:
    def __init__(self, lines: list[str]):

        # 1. Set up
        self.patterns: dict[str, Pattern] = {}

        # 2. Parse lines
        self.lines = lines
        for line in self.lines:
            line = line.strip()
            if line != "" and not line.startswith("#"):
                self.parse_line(line)

        # 3. Check patterns & complete with defaults values
        for pattern_name, pattern in self.patterns.items():
            pattern.complete()
            pattern.check()

        # 4. 🌲
        for pattern_name, pattern in self.patterns.items():
            print(pattern_name, pattern.notes)
            print(pattern_name, pattern.rhythm)

    def parse_line(self, line: str):
        matched = False

        # Pattern declaration
        if not matched:
            match = re.search(r"(P[a-zA-Z0-9])\.([a-zA-Z]*)(.*)=(.*)", line)
            if match:
                pattern_var_name = match.group(1).strip().lower()
                self.patterns[pattern_var_name] = Pattern()

                pattern_lane_type = match.group(2).strip().lower()
                pattern_parameters = match.group(3).strip().lower()
                pattern_value = match.group(4).strip().lower()
                if pattern_lane_type == PatternLaneTypes.NOTES_AS_PITCH_CLASSES.value:
                    notes_symbols = []
                    for i in range(0, len(pattern_value)):
                        if pattern_value[i] in ['+', '-']:
                            if len(notes_symbols) > 1:
                                notes_symbols[-1] += pattern_value[i]
                            else:
                                raise BaseException(
                                    "A pitch class pattern must not being with an octave switch symbol ('+' or '-")
                        else:
                            if pattern_value[i] not in DEFAULT_PITCH_CLASS_SYMBOLS_TO_MIDI_NOTES.keys():
                                raise BaseException("Unknown pitch class symbol:", pattern_value[i])
                            notes_symbols.append(pattern_value[i])

                    for x in notes_symbols:
                        self.patterns[pattern_var_name].notes.append(Track.pitch_class_symbol_to_midi_note(x))
                matched = True

        if not matched:
            print("Unparsable line:".ljust(X), line)

    @staticmethod
    def pitch_class_symbol_to_midi_note(x: str) -> int:
        r = rf"([{''.join(DEFAULT_PITCH_CLASS_SYMBOLS_TO_MIDI_NOTES.keys())}])([+-]*)"
        match = re.search(r, x)
        pc = match.group(1)
        oct = match.group(2)

        if not match:
            raise BaseException("Unknown pitch class symbol:", x)
        if pc not in DEFAULT_PITCH_CLASS_SYMBOLS_TO_MIDI_NOTES.keys():
            raise BaseException('Unknown pitch class symbol:', x)

        midi_note_number = DEFAULT_PITCH_CLASS_SYMBOLS_TO_MIDI_NOTES[pc]

        if '-' in oct:
            midi_note_number = midi_note_number - 12 * len(oct)
        elif '+' in oct:
            midi_note_number = midi_note_number + 12 * len(oct)

        if midi_note_number > 127:
            while midi_note_number > 127:
                midi_note_number -= 12
        elif midi_note_number < 0:
            while midi_note_number < 0:
                midi_note_number += 12

        return midi_note_number
