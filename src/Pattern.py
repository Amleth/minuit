from enum import Enum
from . import constants
from . import helpers
from . import functions_symbols


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
        self.notes_numbers_lane: list[str] = []
        self.rhythm_values_lane: list[int] = []
        self.velocity_values_lane: list[int] = []
        self.lengths_lane: list[int] = []

    def get_longest_lane_len(self):
        return len(max([self.notes_numbers_lane, self.rhythm_values_lane, self.velocity_values_lane, self.lengths_lane], key=len))

    def fill(self):
        if len(self.notes_numbers_lane) == 0:
            self.notes_numbers_lane.append('0')
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

    def call_functions(self):
        ll = []
        for i in range(len(self.notes_numbers_lane)):
            c = self.notes_numbers_lane[i]
            if not c:
                continue
            f = helpers.Function(c)
            if f.name:
                if f.n_symbols_generated == 0:
                    res = functions_symbols.call(f)()
                    ll.append(f.item + res)
                elif f.n_calls > 1:
                    symbols_generated = []
                    for i in range(f.n_calls):
                        symbols_generated.append(functions_symbols.call(f)())
                    ll = ll + symbols_generated
                elif f.n_calls == 1:
                    symbols_generated = functions_symbols.call(f)()
                    if type(symbols_generated) == list:
                        ll = ll + symbols_generated
                    else:
                        ll.append(symbols_generated)
            else:
                ll.append(c)
        self.notes_numbers_lane = ll[0:self.get_longest_lane_len()]
