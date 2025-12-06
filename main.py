from pathlib import Path
import sys
from src import printer

from src import MinuitParser

if __name__ == "__main__":
    f = open(sys.argv[1], "r", encoding="utf-8")
    p = Path(sys.argv[1])
    name = p.stem
    lines = f.readlines()

    printer.print_title(name, p)

    MinuitParser.MinuitParser(name=name, content="".join(lines))

    f.close()
