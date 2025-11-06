import random
import numpy as np
from . import helpers


def call(f: helpers.Function):
    match f.name:
        case 'linspace':
            return lambda: linspace(int(f.parameters[0]), int(f.parameters[1]), f.n_symbols_generated)
        case 'p':
            return lambda: pick(f.parameters)
        case 'ro':
            return lambda: random_octave(int(f.parameters[0]), int(f.parameters[1]), int(f.parameters[2]))
        case _:
            raise Exception('Unknown function:', f.name)


def linspace(start: int, stop: int, num: int) -> list[int]:
    return [str(int(x)) for x in np.linspace(start, stop, num).tolist()]


def pick(l: list[str]) -> str:
    return random.choice(l)


def random_octave(lower_max: int, higher_max: int, probability: int) -> str:
    if random.random() < probability:
        candidates: list[int] = list(range(lower_max, higher_max + 1))
        candidates.remove(0)
        if len(candidates) > 0:
            x = random.choice(candidates)
            if x < 0:
                return '-' * abs(x)
            else:
                return '+' * abs(x)

    return ''
