import re
from mido import MidiFile, MidiTrack
from . import Score
from pathlib import Path
from typing import Any
from . import constants
from . import helpers
from . import Pattern
from . import symbols_functions


class Track:
    def __init__(self, name: str, lines: list[str]):

        # Set up
        self.name = Path(name).name
        self.symbols: dict[str, str] = {}
        self.patterns: dict[str, Pattern.Pattern] = {}
        self.seq: dict[float, list[str]] = {}
        self.events: list[Score.MidiMessageWithAbsoluteTime] = []

        # Complete patterns with defaults values & check lengths
        # for pattern_name, pattern in self.patterns.items():
        #     pattern.complete()
        #     pattern.check_lengths()

        # Parse lines & call symbol-functions
        self.lines: list[str] = lines
        self.clean_lines()
        print(self.lines)
        # self.extract_symbols()
        # for line in self.lines:
        #     self.parse_line(line)

        # Print
        helpers.sep()
        print("PATTERNS:")
        for pattern_name, pattern in self.patterns.items():
            print(f"   {pattern_name} ({len(pattern.notes_numbers_lane)} events):")
            print(f"      N: {pattern.notes_numbers_lane}")
            print(f"      R: {pattern.rhythm_values_lane}")
            print(f"      V: {pattern.velocity_values_lane}")
            print(f"      L: {pattern.lengths_lane}")
        print("SEQUENCE:")
        print(f"   {self.seq}")
        helpers.sep()

        # Minuit to MIDI!
        self.midi_file: MidiFile = MidiFile()
        self.write_midi()

    def clean_lines(self):
        self.lines = [line.strip() for line in self.lines]
        self.lines = list(filter(lambda l: l, self.lines))
        self.lines = list(filter(lambda l: not l.startswith('#'), self.lines))

    def extract_symbols(self):
        symbols_lines: list[str] = list(filter(lambda x: True, self.lines))
        pass

    def parse_line(self, line: str):

        line = line.strip()
        if line == "" or line.startswith("#"):
            return

        matched = False
        pattern_lane_value = ''

        # Symbols declaration
        if not matched:
            match = re.search(r"\$(.)=(.*)", line)
            if match:
                self.symbols[match.group(1).strip()] = match.group(2).strip()
                matched = True

        # Pattern declaration
        if not matched:
            match = re.search(r"(P[a-zA-Z0-9])\.([a-zA-Z]*)(.*)=(.*)", line)
            if match:

                # The pattern
                pattern_var_name = match.group(1).strip()
                if pattern_var_name not in self.patterns:
                    self.patterns[pattern_var_name] = Pattern.Pattern()

                # It's lanes
                pattern_lane_type = match.group(2).strip().lower()
                pattern_parameters = match.group(3).strip().lower()
                pattern_lane_value_orig = match.group(4).strip().lower()

                # Symbols substitutions
                for symbol, symbol_value in self.symbols.items():
                    pattern_lane_value = pattern_lane_value_orig.replace(symbol, symbol_value)

                # line_history.append(re.sub(r'\([^)]*\)', symbols_functions.replace, line_history[-1]))

                # Lane processing
                match pattern_lane_type:

                    case Pattern.PatternLaneTypes.NOTE_NUMBERS_AS_PITCH_CLASSES.value:
                        notes_symbols: list[str] = []
                        for i in range(0, len(pattern_lane_value)):
                            if pattern_lane_value[i] in ["+", "-"]:
                                if len(notes_symbols) > 1:
                                    notes_symbols[-1] += pattern_lane_value[i]
                                else:
                                    raise BaseException("A pitch class pattern must not be with an octave switch symbol ('+' or '-")
                            else:
                                if (pattern_lane_value[i] not in constants.DEFAULT_PITCH_CLASS_SYMBOLS_TO_MIDI_NOTES.keys()):
                                    raise BaseException("Unknown pitch class symbol:", pattern_lane_value[i])
                                notes_symbols.append(pattern_lane_value[i])
                        for x in notes_symbols:
                            self.patterns[pattern_var_name].notes_numbers_lane.append(helpers.pitch_class_symbol_to_midi_note(x))
                        matched = True

                    case Pattern.PatternLaneTypes.LENGTHS.value:
                        self.patterns[pattern_var_name].lengths_lane = [int(pv) for pv in pattern_lane_value.split(" ")]
                        matched = True

                    case Pattern.PatternLaneTypes.RHYTHM_VALUES.value:
                        for x in pattern_lane_value.split():
                            self.patterns[pattern_var_name].rhythm_values_lane.append(int(x))
                        matched = True

                    case _:
                        pass

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
            if pattern_lane_value:
                print("🌀", pattern_lane_value)
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
                    end = last_offset + helpers.rv2ppq(pattern.rhythm_values_lane[i])
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
