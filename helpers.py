import random


def oct(note, min=-1, max=1, note_min=0, note_max=127):
    pick_oct = lambda: note + random.choice(list(range(min, max + 1))) * 12

    new_note = pick_oct()
    while new_note < note_min or new_note > note_max:
        new_note = pick_oct()

    return new_note


if __name__ == "__main__":
    oct(60)
