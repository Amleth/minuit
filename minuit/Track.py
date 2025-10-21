import re
from mido import MidiFile, MidiTrack
from . import Score
from pathlib import Path
from . import constants
from . import helpers
from . import Pattern
from . import symbols_functions


class Track:
    def __init__(self, name: str, lines: list[str]):

        self.symbols: dict[str, str] = {}

        # Set up
        self.name = Path(name).name
        self.patterns: dict[str, Pattern.Pattern] = {}
        self.seq: dict[float, list[str]] = {}
        self.events: list[Score.MidiMessageWithAbsoluteTime] = []

        # Parse lines & call symbol-functions
        print("🌲" * 42)
        self.lines = lines
        for line in self.lines:
            line = line.strip()
            if line != "" and not line.startswith("#"):
                self.parse_line(line)

        # Complete patterns with defaults values & check lengths
        for pattern_name, pattern in self.patterns.items():
            pattern.complete()
            pattern.check_lengths()

        # Print
        print("🌲" * 42)
        print("PATTERNS:")
        for pattern_name, pattern in self.patterns.items():
            print(f"   {pattern_name} ({len(pattern.notes_numbers_lane)} events):")
            print(f"      N: {pattern.notes_numbers_lane}")
            print(f"      R: {pattern.rhythm_values_lane}")
            print(f"      V: {pattern.velocity_values_lane}")
            print(f"      L: {pattern.lengths_lane}")
        print("SEQUENCE:")
        print(f"   {self.seq}")
        print("🌲" * 42)

        # Minuit to MIDI!
        self.midi_file: MidiFile = MidiFile()
        self.write_midi()

    def parse_line(self, line: str):
        line = line.strip()
        line_history: list[str] = [line]
        if not line or line[0] == '#':
            return

        matched = False

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
                line_history.append(match.group(4).strip().lower())

                # Symbols substitutions
                for symbol, symbol_value in self.symbols.items():
                    line_history.append(line_history[-1].replace(symbol, symbol_value))

                # Call symbol-functions
                line_history.append(re.sub(r'\([^)]*\)', symbols_functions.replace, line_history[-1]))

                # Lane processing
                match pattern_lane_type:

                    case Pattern.PatternLaneTypes.NOTE_NUMBERS_AS_PITCH_CLASSES.value:
                        notes_symbols: list[str] = []
                        for i in range(0, len(line_history[-1])):
                            if line_history[-1][i] in ["+", "-"]:
                                if len(notes_symbols) > 1:
                                    notes_symbols[-1] += line_history[-1][i]
                                else:
                                    raise BaseException("A pitch class pattern must not be with an octave switch symbol ('+' or '-")
                            else:
                                if (line_history[-1][i] not in constants.DEFAULT_PITCH_CLASS_SYMBOLS_TO_MIDI_NOTES.keys()):
                                    raise BaseException("Unknown pitch class symbol:", line_history[-1][i])
                                notes_symbols.append(line_history[-1][i])
                        for x in notes_symbols:
                            self.patterns[pattern_var_name].notes_numbers_lane.append(helpers.pitch_class_symbol_to_midi_note(x))
                        matched = True

                    case Pattern.PatternLaneTypes.LENGTHS.value:
                        self.patterns[pattern_var_name].lengths_lane = [int(pv) for pv in line_history[-1].split(" ")]
                        matched = True

                    case Pattern.PatternLaneTypes.RHYTHM_VALUES.value:
                        for x in line_history[-1].split():
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

        line_history = helpers.uniq(line_history)

        if matched:
            print("🟢", line)
            for x in line_history[2:]:
                print("🌀", x)
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
