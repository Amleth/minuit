import {
	PITCH_DUODECIMAL_VALUES,
	SYMBOL_CHORD_CLOSE,
	SYMBOL_CHORD_OPEN,
	SYMBOL_GROUP_CLOSE,
	SYMBOL_GROUP_OPEN,
	SYMBOL_OCTAVE_DOWN,
	SYMBOL_OCTAVE_UP,
	SYMBOL_PATTERN_VARIABLE_OPEN,
	Token,
	TokenType,
} from "../consts.ts";

export default class DuodecimalPitchValuesSequenceLexer<T> {
	private pos = 0;

	constructor(private readonly input: string) {}

	tokenize(): Token[] {
		const tokens: Token[] = [];

		mainLoop: while (this.pos < this.input.length) {
			const char = this.input[this.pos];

			if (PITCH_DUODECIMAL_VALUES.includes(char)) {
				tokens.push(new Token(TokenType.PITCH_DUODECIMAL_VALUE, char));
				this.pos++;
				continue;
			}

			if ([SYMBOL_OCTAVE_DOWN, SYMBOL_OCTAVE_UP].includes(char)) {
				tokens[tokens.length - 1].value += char;
				this.pos++;
				continue;
			}

			for (const symbol of [
				[SYMBOL_CHORD_OPEN, TokenType.SYMBOL_CHORD_OPEN],
				[SYMBOL_CHORD_CLOSE, TokenType.SYMBOL_CHORD_CLOSE],
				[SYMBOL_GROUP_OPEN, TokenType.SYMBOL_GROUP_OPEN],
				[SYMBOL_GROUP_CLOSE, TokenType.SYMBOL_GROUP_CLOSE],
			]) {
				if (char === symbol[0]) {
					tokens.push(new Token(symbol[1] as TokenType, char));
					this.pos++;
					continue mainLoop;
				}
			}

			if (char === SYMBOL_PATTERN_VARIABLE_OPEN) {
				tokens.push(this.readReference());
				continue;
			}

			this.pos++;
		}

		return tokens;
	}

	private readReference(): Token {
		const start = this.pos;

		const match = this.input.slice(this.pos).match(/^\{(PD\d+)\}/);
		if (match) {
			console.log(match[1]);
			this.pos = this.pos + "{}".length + match[1].length;
			return new Token(TokenType.PATTERN_REFERENCE, match[1]);
		} else {
			throw new Error(
				`Pattern reference error in: ${this.input.slice(this.pos)}`,
			);
		}
	}
}
