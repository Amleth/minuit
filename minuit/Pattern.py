from enum import Enum
from . import constants
from . import helpers


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

    def complete(self):
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
