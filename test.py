from helpers import oct
from minuit import play_score
from numpy.random import randint as ri, uniform as uni
from random import choice

N = 500
n = [60, 63, 68, 60, 63, 67]
d = [3, 3, 3, 3, 3, 3]
v = [100, 100, 100, 100, 100, 100]
w = [3, 3, 3, 3, 3, 3]

fsm = [42, 45, 49, 50, 51]
bm = [47, 50, 52]
dM = [50, 54, 57]
aM = [45, 49, 52]
eM = [52, 56, 59]

score = []

for i in range(1000):
    score += [
        {"n": ri(20, 115), "v": ri(10, 127), "d": 1},
        3
    ]

play_score(score, "M1")
