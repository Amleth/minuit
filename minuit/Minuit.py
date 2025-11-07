from lark import Lark
from lark.indenter import Indenter
import os


class Minuit:
    name: str

    def __init__(self, name: str, content: str):
        self.name = name

        with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "minuit.lark"), "r") as file:
            grammar = file.read()

        parser = Lark(grammar, parser="lalr")
        tree = parser.parse(content)
        print(tree.pretty())
