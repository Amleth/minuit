import re
from enum import Enum
from mido import MidiFile, MidiTrack
from . import Score
from pprint import pprint
from pathlib import Path
import random
from . import helpers
from . import constants


INT_OR_FUNCTIONS = r'\([^)]*\)|\d+'


def get_function(fexpr):
    parts = fexpr.strip('()').split()
    function_name = parts[0]
    function_parameters = parts[1:]
    match function_name:

        case 'p':
            return lambda: random.choice(function_parameters)

    return None


class PatternLaneTypes(Enum):
    DURATION = "d"
    GRID = "g"
    LENGTHS = "l"
    NOTE_NUMBERS_AS_PITCH_CLASSES = "p"
    PITCH_INTERVALS = "i"
    RHYTHM_VALUES = "r"
    VELOCITY = "v"


class Pattern:
    def __init__(self):
        self.channel = 0
        self.notes_numbers_lane: list[int] = []
        self.rhythm_values_lane: list[float] = []
        self.velocity_values_lane: list[int] = []
        self.lengths_lane: list[float] = []

    def get_longest_lane_len(self):
        return len(max([self.notes_numbers_lane, self.rhythm_values_lane, self.velocity_values_lane, self.lengths_lane], key=len))

    def complete(self):
        if len(self.notes_numbers_lane) == 0:
            self.notes_numbers_lane.append(constants.DEFAULT_MIDI_NOTE)
        if len(self.rhythm_values_lane) == 0:
            self.rhythm_values_lane.append(constants.DEFAULT_RHYTHM_VALUE)
        if len(self.velocity_values_lane) == 0:
            self.velocity_values_lane.append(constants.DEFAULT_VELOCITY_VALUE)
        if len(self.lengths_lane) == 0:
            self.lengths_lane.append(4)

        self.notes_numbers_lane = helpers.fill_cycle(self.notes_numbers_lane, self.get_longest_lane_len())
        self.rhythm_values_lane = helpers.fill_cycle(self.rhythm_values_lane, self.get_longest_lane_len())
        self.velocity_values_lane = helpers.fill_cycle(self.velocity_values_lane, self.get_longest_lane_len())
        if len(self.lengths_lane) == 0:
            self.lengths_lane = self.rhythm_values_lane
        else:
            self.lengths_lane = helpers.fill_cycle(self.lengths_lane, self.get_longest_lane_len())

    def check(self):
        if len(self.notes_numbers_lane) != len(self.rhythm_values_lane):
            raise BaseException("Inconsistency between notes and rhythm values lists lengths.")


class Track:
    def __init__(self, name: str, lines: list[str]):

        # 1. Set up
        self.name = Path(name).name
        self.patterns: dict[str, Pattern] = {}
        self.seq: dict[float, list[str]] = {}
        self.events: list[Score.MidiMessageWithAbsoluteTime] = []

        # 2. Parse lines
        print("🌲" * 42)
        self.lines = lines
        for line in self.lines:
            line = line.strip()
            if line != "" and not line.startswith("#"):
                self.parse_line(line)

        # 3. Check patterns & complete with defaults values
        for pattern_name, pattern in self.patterns.items():
            pattern.complete()
            pattern.check()

        # 4. Run functions to generate values
        for pattern_name, pattern in self.patterns.items():
            pattern.rhythm_values_lane = [x() if callable(x) else x for x in pattern.rhythm_values_lane]

        # 5. Print
        print("🌲" * 42)
        print("PATTERNS:")
        for pattern_name, pattern in self.patterns.items():
            print(f"   {pattern_name}:")
            print(f"      N: {pattern.notes_numbers_lane}")
            print(f"      R: {pattern.rhythm_values_lane}")
            print(f"      V: {pattern.velocity_values_lane}")
            print(f"      L: {pattern.lengths_lane}")
        print("SEQUENCE:")
        print(f"   {self.seq}")
        print("🌲" * 42)

        # 6. MINUIT TO MIDI!
        self.midi_file: MidiFile = MidiFile()
        self.write_midi()

    def parse_line(self, line: str):
        matched = False

        # Pattern declaration
        if not matched:
            match = re.search(r"(P[a-zA-Z0-9])\.([a-zA-Z]*)(.*)=(.*)", line)
            if match:

                # The pattern
                pattern_var_name = match.group(1).strip()
                if pattern_var_name not in self.patterns:
                    self.patterns[pattern_var_name] = Pattern()

                # It's lanes
                pattern_lane_type = match.group(2).strip().lower()
                pattern_parameters = match.group(3).strip().lower()
                pattern_value = match.group(4).strip().lower()

                # Lane processing
                match pattern_lane_type:

                    case PatternLaneTypes.NOTE_NUMBERS_AS_PITCH_CLASSES.value:
                        notes_symbols: list[str] = []
                        for i in range(0, len(pattern_value)):
                            if pattern_value[i] in ["+", "-"]:
                                if len(notes_symbols) > 1:
                                    notes_symbols[-1] += pattern_value[i]
                                else:
                                    raise BaseException("A pitch class pattern must not be with an octave switch symbol ('+' or '-")
                            else:
                                if (pattern_value[i] not in constants.DEFAULT_PITCH_CLASS_SYMBOLS_TO_MIDI_NOTES.keys()):
                                    raise BaseException("Unknown pitch class symbol:", pattern_value[i])
                                notes_symbols.append(pattern_value[i])

                        for x in notes_symbols:
                            self.patterns[pattern_var_name].notes_numbers_lane.append(helpers.pitch_class_symbol_to_midi_note(x))
                        matched = True

                    case PatternLaneTypes.LENGTHS.value:
                        pattern_values: list[str] = pattern_value.split(" ")
                        for pv in pattern_values:
                            self.patterns[pattern_var_name].lengths_lane.append(int(pv))
                        matched = True

                    case PatternLaneTypes.RHYTHM_VALUES.value:
                        values = re.findall(INT_OR_FUNCTIONS, pattern_value)
                        res = []
                        for x in values:
                            if x.isdigit():
                                y = str(x)
                                res.append(lambda: y)
                            else:
                                function = None
                                if re.match(r'^\(.*\)$', x):
                                    function = get_function(x)
                                    res.append(function)
                                if not function:
                                    raise BaseException("Invalid value:", x)
                        for x in res:
                            self.patterns[pattern_var_name].rhythm_values_lane.append(x)
                        matched = True

        # Sequencing
        if not matched:
            match = re.search(r"§\s*(.*)", line)
            if match:
                matched = True
                sequenced_pattern = match.group(1).strip()

                # TODO tout n'est pas si facile
                self.seq[0] = [sequenced_pattern]

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
                            end=end,
                        )
                    )
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
            track.append(Score.Message(type=x.type, note=x.note_number, velocity=x.velocity, time=delta))
            precedent = x

        self.midi_file.save("bim.mid")
