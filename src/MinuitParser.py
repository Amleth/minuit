from lark import Lark, Tree, Token
from lark.indenter import Indenter
import os


def walk(x: Tree | Token, depth: int):
    if isinstance(x, Tree):
        print(f"🌲{' ' * 1 * depth}Node: {x.data}")
        for child in x.children:
            walk(child, depth + 1)
    elif isinstance(x, Token):
        print(f"🪙{' ' * 1 * depth}Token: {x.type} -> {x.value}")


class MinuitParser:
    content: str
    name: str

    def __init__(self, name: str, content: str):
        self.content = content
        self.name = name

        with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "minuit.lark"), "r") as file:
            grammar = file.read()

        parser: Lark = Lark(grammar, parser="lalr")
        self.content = MinuitParser.preprocess(self.content)
        tree: Tree = parser.parse(self.content)
        # print(tree.pretty())
        walk(tree, 0)

    @staticmethod
    def preprocess(content: str) -> str:
        lines = content.splitlines()
        lines_to_preprocess: list[str] = []
        preprocessed_lines: list[str] = []
        symbols: dict[str, str] = {}

        for line in lines:
            line = line.lstrip()
            if line.startswith('$'):
                line = line.replace('$', '')
                parts = [x.strip() for x in line.split('=')]
                symbols[parts[0]] = parts[1]
            else:
                lines_to_preprocess.append(line)

        for line in lines_to_preprocess:
            for symbol, value in symbols.items():
                line = line.replace(symbol, value)
                preprocessed_lines.append(line)

        return "\n".join(preprocessed_lines)
