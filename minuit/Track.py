from dataclasses import dataclass
import re
from mido import MidiFile, MidiTrack
from pathlib import Path
import sys
from . import Score
from . import constants
from . import helpers
from . import Pattern


@dataclass
class Line:
    line: str
    match: re.Match[str] | None


def print_line(line: str, matched: bool):
    line = re.sub(r"\s+", " ", line.replace('=', ' = '))
    if matched:
        print("🟢", line)
    else:
        print("🔴", line)


class Track:
    def __init__(self, name: str, lines: list[str]):

        #
        # Set up
        #
        self.name = Path(name).name
        self.symbols: dict[str, str] = {}
        self.patterns: dict[str, Pattern.Pattern] = {}
        self.seq: dict[float, list[str]] = {}
        self.events: list[Score.MidiMessageWithAbsoluteTime] = []
        self.lines: list[str] = lines

        #
        # Parse
        #
        helpers.sep()
        self.clean_lines()
        self.extract_symbols()
        self.extract_patterns()
        for l in self.lines:
            print_line(l, False)

        #
        # First, we complete
        #
        for pattern_name, pattern in self.patterns.items():
            pattern.complete()

        #
        # Then, we call functions
        #

        #
        # Print
        #
        helpers.sep()
        print("SYMBOLS:")
        for symbol, symbol_value in self.symbols.items():
            print("  ", symbol, "->", symbol_value)
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

        #
        # Minuit to MIDI!
        #
        self.midi_file: MidiFile = MidiFile()
        self.write_midi()

    def clean_lines(self):
        self.lines = [line.strip() for line in self.lines]
        self.lines = list(filter(lambda l: l, self.lines))
        self.lines = list(filter(lambda l: not l.startswith('#'), self.lines))

    def extract_symbols(self):
        symbol_declaration_lines = list(filter(lambda l: l.startswith('$'), self.lines))
        self.lines = list(filter(lambda l: l not in symbol_declaration_lines, self.lines))
        for line in symbol_declaration_lines:
            match = re.search(r"\$(.)=(.*)", line)
            if match:
                self.symbols[match.group(1).strip()] = match.group(2).strip()
            print_line(line, True if match else False)

    def extract_patterns(self):
        pattern_declaration_re = r"(P[a-zA-Z0-9])\.([a-zA-Z]*)(.*)=(.*)"
        matches = [Line(l, re.search(pattern_declaration_re, l)) for l in self.lines]
        for l in matches:
            if l.match:
                self.lines.remove(l.line)

                # The pattern
                pattern_var_name = l.match.group(1).strip()
                if pattern_var_name not in self.patterns:
                    self.patterns[pattern_var_name] = Pattern.Pattern()

                # It's lanes
                pattern_lane_type = l.match.group(2).strip().lower()
                pattern_parameters = l.match.group(3).strip().lower()
                pattern_lane_value = l.match.group(4).strip().lower()

                # Symbols substitutions
                pattern_lane_value_after_symbol_substitution = pattern_lane_value
                for symbol, symbol_value in self.symbols.items():
                    pattern_lane_value_after_symbol_substitution = pattern_lane_value_after_symbol_substitution.replace(symbol, symbol_value)

                # Lane processing (rewriting then calling functions)
                match pattern_lane_type:
                    case Pattern.PatternLaneTypes.NOTE_NUMBERS_AS_PITCH_CLASSES.value:
                        ll = helpers.split_pattern_notes_lane(pattern_lane_value_after_symbol_substitution)
                        self.patterns[pattern_var_name].notes_numbers_lane = ll
                    case Pattern.PatternLaneTypes.LENGTHS.value:
                        pass
                        # TODO
                        # ll = re.findall(rf"{n_symbols_generating_function}|{one_symbol_generating_function}|\d+", pattern_lane_value_after_symbol_substitution)
                        # self.patterns[pattern_var_name].lengths_lane = ll
                    case Pattern.PatternLaneTypes.RHYTHM_VALUES.value:
                        pass
                        # TOD
                        # ll = re.findall(rf"{n_symbols_generating_function}|{one_symbol_generating_function}|\d+", pattern_lane_value_after_symbol_substitution)
                        # self.patterns[pattern_var_name].rhythm_values_lane = ll
                    case _:
                        pass

                # Print
                print_line(l.line, True if l.match else False)
                if pattern_lane_value != pattern_lane_value_after_symbol_substitution:
                    print("🌀", pattern_lane_value_after_symbol_substitution)

    # def extract_sequencing():
    #     if not matched:
    #         match = re.search(r"§\s*(.*)", line)
    #         if match:
    #             matched = True
    #             sequenced_pattern = match.group(1).strip()

    #             # TODO tout n'est pas si facile
    #             self.seq[0] = [sequenced_pattern]

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
