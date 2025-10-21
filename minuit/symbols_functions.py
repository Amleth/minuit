import random
import re


def replace(f_expr_match: re.Match[str]):
    f_expr = f_expr_match.group(0)
    parts = f_expr.strip('()').split()
    f_name: str = parts[0]
    f_params = parts[1:]
    match f_name:

        case 'p':
            return lambda: pick(f_params)

        case 'ro':
            return lambda: random_octave(int(f_params[0]), int(f_params[1]), int(f_params[2]))

        case _:
            pass

    return lambda: None


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
