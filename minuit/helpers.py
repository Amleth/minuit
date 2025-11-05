from dataclasses import dataclass
from typing import Any
from itertools import cycle
from . import constants


def sep():
    print("🌲" * 42)


# def pitch_class_symbol_to_midi_note(x: str) -> int:
#     r = rf"([{''.join(constants.DEFAULT_PITCH_CLASS_SYMBOLS_TO_MIDI_NOTES.keys())}])([+-]*)"
#     match = re.search(r, x)
#     pc: str = ''
#     oct: str = ''
#     if match:
#         pc = match.group(1)
#         oct = match.group(2)

#     if match and len(match.groups()) != 2:
#         raise BaseException("Unmatched stuff", x)

#     if not match:
#         raise BaseException("Unknown pitch class symbol:", x)
#     if pc not in constants.DEFAULT_PITCH_CLASS_SYMBOLS_TO_MIDI_NOTES.keys():
#         raise BaseException("Unknown pitch class symbol:", x)

#     midi_note_number = constants.DEFAULT_PITCH_CLASS_SYMBOLS_TO_MIDI_NOTES[pc]

#     if "-" in oct:
#         midi_note_number = midi_note_number - 12 * len(oct)
#     elif "+" in oct:
#         midi_note_number = midi_note_number + 12 * len(oct)

#     if midi_note_number > 127:
#         while midi_note_number > 127:
#             midi_note_number -= 12
#     elif midi_note_number < 0:
#         while midi_note_number < 0:
#             midi_note_number += 12

#     return midi_note_number


def fill_cycle(l: list[Any], size: int) -> list[Any]:
    cycled = cycle(l)
    while len(l) < size:
        l.append(next(cycled))
    return l


def rv2ppq(x: int) -> int:
    if x == 0:
        return 1
    return round((4 * 1 / x) * constants.PPQ)


def uniq(l: list[str]) -> list[str]:
    res: list[str] = []
    for x in l:
        if x not in res:
            res.append(x)
    return res


def sum(ll: list[int]) -> int:
    res = 0
    for x in ll:
        res += x
    return res


def add_blank_items(ll: list[Any], n: int) -> list[Any]:
    for x in range(0, n):
        ll.append(None)
    return ll


def split_pattern_notes_lane(x: str) -> list[str]:
    ll = []
    current_fonction = ''

    for c in x:
        if c == '(':
            current_fonction += c
        elif c == ')':
            current_fonction += c
            f = Function(current_fonction)
            if f.n > 1:
                ll.append(current_fonction)
                for i in range(f.n - 1):
                    ll.append(None)
            elif current_fonction[1] == '@':
                ll[-1] = ll[-1] + current_fonction
            else:
                ll.append(current_fonction)
            current_fonction = ''
        elif len(current_fonction) > 0:
            current_fonction += c
        elif c in constants.DEFAULT_PITCH_CLASS_SYMBOLS_TO_MIDI_NOTES:
            ll.append(c)

    return ll


def split_pattern_length_values_lane(l: str) -> list[int]:
    return [int(x) for x in l.split()]


def split_pattern_rhythm_values_lane(l: str) -> list[int]:
    return [int(x) for x in l.split()]


@dataclass
class Function:
    item: str
    n: int
    name: str
    parameters: list[Any]

    def __init__(self, x: str):
        self.item = ''
        self.n = 0
        self.name = ''
        self.parameters = []

        if not x or len(x) <= 3 or (x[0] != '(' and x[1] != '(') or x[-1] != ')':
            return
        x = x.replace('(', '').replace(')', '')
        parts = x.split()
        if ':' in parts[0]:
            y = parts[0].split(':')
            self.n = int(y[0])
            self.name = y[1]
        elif '@' in parts[0]:
            y = parts[0].split('@')
            self.item = y[0]
            self.n = 0
            self.name = y[1]
        else:
            self.n = 1
            self.name = parts[0]
        self.parameters = parts[1:]
