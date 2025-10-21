from typing import Any
import re
from itertools import cycle
from . import constants


def pitch_class_symbol_to_midi_note(x: str) -> int:
    r = rf"([{''.join(constants.DEFAULT_PITCH_CLASS_SYMBOLS_TO_MIDI_NOTES.keys())}])([+-]*)"
    match = re.search(r, x)
    pc: str = ''
    oct: str = ''
    if match:
        pc = match.group(1)
        oct = match.group(2)

    if match and len(match.groups()) != 2:
        raise BaseException("Unmatched stuff", x)

    if not match:
        raise BaseException("Unknown pitch class symbol:", x)
    if pc not in constants.DEFAULT_PITCH_CLASS_SYMBOLS_TO_MIDI_NOTES.keys():
        raise BaseException("Unknown pitch class symbol:", x)

    midi_note_number = constants.DEFAULT_PITCH_CLASS_SYMBOLS_TO_MIDI_NOTES[pc]

    if "-" in oct:
        midi_note_number = midi_note_number - 12 * len(oct)
    elif "+" in oct:
        midi_note_number = midi_note_number + 12 * len(oct)

    if midi_note_number > 127:
        while midi_note_number > 127:
            midi_note_number -= 12
    elif midi_note_number < 0:
        while midi_note_number < 0:
            midi_note_number += 12

    return midi_note_number


def fill_cycle(l: list[Any], size: int) -> list[Any]:
    cycled = cycle(l)
    while len(l) < size:
        l.append(next(cycled))
    return l


def rv2ppq(x: int) -> int:
    if x == 0:
        return 1
    return round((4 * 1 / x) * constants.PPQ)
