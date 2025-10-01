import sys
from Track import Track

if __name__ == '__main__':
    f = open(sys.argv[1], "r")
    track = Track(f.readlines())
    f.close()
