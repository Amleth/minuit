import re
from enum import Enum
from mido import MidiFile, MidiTrack
from . import Score
from pprint import pprint
from pathlib import Path
from . import helpers
from . import constants


class PatternLaneTypes(Enum):
    NOTES_AS_PITCH_CLASSES = "npc"
    GRID = "g"
    RHYTHM = "r"


class Pattern:
    def __init__(self):
        self.channel = 0
        self.notes_numbers_lane: list[int] = []
        self.rhythm_values_lane: list[float] = []
        self.velocity_values_lane: list[int] = []
        self.lengths_lane: list[float] = []

    def get_longest_lane_len(self):
        return len(max([self.notes_numbers_lane, self.rhythm_values_lane], key=len))

    def complete(self):
        if len(self.notes_numbers_lane) == 0:
            self.notes_numbers_lane.append(constants.DEFAULT_MIDI_NOTE)
        if len(self.rhythm_values_lane) == 0:
            self.rhythm_values_lane.append(constants.DEFAULT_RHYTHM_VALUE)
        if len(self.velocity_values_lane) == 0:
            self.velocity_values_lane.append(constants.DEFAULT_VELOCITY_VALUE)

        self.notes_numbers_lane = helpers.fill_cycle(
            self.notes_numbers_lane, self.get_longest_lane_len()
        )
        self.rhythm_values_lane = helpers.fill_cycle(
            self.rhythm_values_lane, self.get_longest_lane_len()
        )
        self.velocity_values_lane = helpers.fill_cycle(
            self.velocity_values_lane, self.get_longest_lane_len()
        )

        if len(self.lengths_lane) == 0:
            self.lengths_lane = self.rhythm_values_lane

    def check(self):
        if len(self.notes_numbers_lane) != len(self.rhythm_values_lane):
            raise BaseException(
                "Inconsistency between notes and rhythm values lists lengths."
            )


class Track:
    def __init__(self, name: str, lines: list[str]):

        # 1. Set up
        self.name = Path(name).name
        self.patterns: dict[str, Pattern] = {}
        self.seq: dict[float, list[str]] = {}
        self.events: list[Score.MidiMessageWithAbsoluteTime] = []

        # 2. Parse lines
        print("🌲" * 80)
        self.lines = lines
        for line in self.lines:
            line = line.strip()
            if line != "" and not line.startswith("#"):
                self.parse_line(line)

        # 3. Check patterns & complete with defaults values
        for pattern_name, pattern in self.patterns.items():
            pattern.complete()
            pattern.check()

        # 4. Print
        print("🌲" * 80)
        print("PATTERNS:")
        for pattern_name, pattern in self.patterns.items():
            print("    ", pattern_name + ".N:", pattern.notes_numbers_lane)
            print("    ", pattern_name + ".R:", pattern.rhythm_values_lane)
        print("SEQUENCE:")
        print("    ", self.seq)
        print("🌲" * 80)

        # 5. MINUIT TO MIDI!
        self.midi_file: MidiFile = MidiFile()
        self.write_midi()

    def parse_line(self, line: str):
        matched = False

        # Pattern declaration
        if not matched:
            match = re.search(r"(P[a-zA-Z0-9])\.([a-zA-Z]*)(.*)=(.*)", line)
            if match:
                pattern_var_name = match.group(1).strip()
                self.patterns[pattern_var_name] = Pattern()

                pattern_lane_type = match.group(2).strip().lower()
                # pattern_parameters = match.group(3).strip().lower()
                pattern_value = match.group(4).strip().lower()
                if pattern_lane_type == PatternLaneTypes.NOTES_AS_PITCH_CLASSES.value:
                    notes_symbols: list[str] = []
                    for i in range(0, len(pattern_value)):
                        if pattern_value[i] in ["+", "-"]:
                            if len(notes_symbols) > 1:
                                notes_symbols[-1] += pattern_value[i]
                            else:
                                raise BaseException(
                                    "A pitch class pattern must not be with an octave switch symbol ('+' or '-"
                                )
                        else:
                            if (
                                pattern_value[i]
                                not in constants.DEFAULT_PITCH_CLASS_SYMBOLS_TO_MIDI_NOTES.keys()
                            ):
                                raise BaseException(
                                    "Unknown pitch class symbol:", pattern_value[i]
                                )
                            notes_symbols.append(pattern_value[i])

                    for x in notes_symbols:
                        self.patterns[pattern_var_name].notes_numbers_lane.append(
                            helpers.pitch_class_symbol_to_midi_note(x)
                        )
                matched = True

        # Sequencing
        if not matched:
            match = re.search(r"§\s*(.*)", line)
            if match:
                matched = True
                sequenced_pattern = match.group(1).strip()

                self.seq[0] = [sequenced_pattern]  # TODO tout n'est pas si facile

        if matched:
            print("🟢", line)
        if not matched:
            print("🔴", line)

    def make_midi_messages_with_absolute_times(self):
        pass

    def write_midi(self):
        track: MidiTrack = MidiTrack()
        self.midi_file.tracks.append(track)

        note_events = []

        for absolute_offset, patterns_names in self.seq.items():
            absolute_offset = absolute_offset * constants.PPQ
            for pattern_name in patterns_names:
                pattern = self.patterns[pattern_name]
                last_offset = absolute_offset
                for i in range(0, len(pattern.notes_numbers_lane)):
                    end = last_offset + helpers.rv2ppq(pattern.lengths_lane[i])
                    note_events.append(
                        Score.NoteEvent(
                            channel=pattern.channel,
                            note_number=pattern.notes_numbers_lane[i],
                            velocity=pattern.velocity_values_lane[i],
                            start=last_offset,
                            end=end
                        ))
                    last_offset = end

        for ne in note_events:
            pair = ne.to_midi_messages_with_absolute_time()
            self.events.append(pair[0])
            self.events.append(pair[1])
        self.events = sorted(self.events, key=lambda x: x.time)

        precedent = None
        for x in self.events:
            if precedent:
                delta = x.time - precedent.time
            else:
                delta = x.time
            track.append(
                Score.Message(
                    type=x.type, note=x.note_number, velocity=x.velocity, time=delta
                )
            )
            precedent = x

        self.midi_file.save("bim.mid")
