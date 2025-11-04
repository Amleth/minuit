import sys

from minuit import Track

if __name__ == "__main__":
    f = open(sys.argv[1], "r", encoding="utf-8")
    track = Track.Track("".join(sys.argv[1].split(".")[:-1]), f.readlines())
    f.close()
