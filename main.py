import sys

from minuit import Track
from minuit import Minuit

if __name__ == "__main__":
    f = open(sys.argv[1], "r", encoding="utf-8")
    name = "".join(sys.argv[1].split(".")[:-1])
    lines = f.readlines()
    # track = Track.Track(name, lines)
    Minuit.Minuit(name=name, content="".join(lines))
    f.close()
