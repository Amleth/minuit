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

        print("🌲" * 42)

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

        # Assign symbols values

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

        # 6. MINUIT TO MIDI!
        self.midi_file: MidiFile = MidiFile()
        self.write_midi()

    def parse_line(self, line: str):
        matched = False
        pattern_lane_values_orig = ''
        pattern_lane_values = ''

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
                pattern_lane_values_orig = match.group(4).strip().lower()
                # pattern_lane_values = call_functions(pattern_lane_values)

                # Call symbol-functions
                pattern_lane_values = re.sub(r'\([^)]*\)', symbols_functions.replace, pattern_lane_values_orig)

                # Lane processing
                match pattern_lane_type:

                    case Pattern.PatternLaneTypes.NOTE_NUMBERS_AS_PITCH_CLASSES.value:
                        notes_symbols: list[str] = []
                        for i in range(0, len(pattern_lane_values)):
                            if pattern_lane_values[i] in ["+", "-"]:
                                if len(notes_symbols) > 1:
                                    notes_symbols[-1] += pattern_lane_values[i]
                                else:
                                    raise BaseException("A pitch class pattern must not be with an octave switch symbol ('+' or '-")
                            else:
                                if (pattern_lane_values[i] not in constants.DEFAULT_PITCH_CLASS_SYMBOLS_TO_MIDI_NOTES.keys()):
                                    raise BaseException("Unknown pitch class symbol:", pattern_lane_values[i])
                                notes_symbols.append(pattern_lane_values[i])
                        for x in notes_symbols:
                            self.patterns[pattern_var_name].notes_numbers_lane.append(helpers.pitch_class_symbol_to_midi_note(x))
                        matched = True

                    case Pattern.PatternLaneTypes.LENGTHS.value:
                        self.patterns[pattern_var_name].lengths_lane = [int(pv) for pv in pattern_lane_values.split(" ")]
                        matched = True

                    case Pattern.PatternLaneTypes.RHYTHM_VALUES.value:
                        # values = re.findall(INT_OR_FUNCTIONS, pattern_lane_values)
                        # res = []
                        # for x in values:
                        #     if x.isdigit():
                        #         y = str(x)
                        #         res.append(lambda: y)
                        #     else:
                        #         function = None
                        #         if re.match(r'^\(.*\)$', x):
                        #             function = get_function(x)
                        #             res.append(function)
                        #         if not function:
                        #             raise BaseException("Invalid value:", x)
                        # for x in res:
                        #     self.patterns[pattern_var_name].rhythm_values_lane.append(x)
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
            print("🟢", line, "🌀 " + pattern_lane_values if pattern_lane_values and pattern_lane_values != pattern_lane_values_orig else '')
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
