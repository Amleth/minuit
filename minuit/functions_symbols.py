from dataclasses import dataclass
import random
from . import helpers


@dataclass
class InvalidFunctionCall:
    pass


def call(f: helpers.Function):
    match f.name:
        case 'p':
            return lambda: pick(f.parameters)
        case 'ro':
            return lambda: random_octave(int(f.parameters[0]), int(f.parameters[1]), int(f.parameters[2]))
        case _:
            return lambda: InvalidFunctionCall()


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
