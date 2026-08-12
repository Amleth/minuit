import {
	Context,
	PITCH_DUODECIMAL_VALUES,
	SYMBOL_CHORD_CLOSE,
	SYMBOL_CHORD_OPEN,
	SYMBOL_FUNCTION_CLOSE,
	SYMBOL_FUNCTION_OPEN,
	SYMBOL_FUNCTION_TRANSFORMATOR,
	SYMBOL_GROUP_CLOSE,
	SYMBOL_GROUP_OPEN,
	SYMBOL_OCTAVE_DOWN,
	SYMBOL_OCTAVE_UP,
	SYMBOL_PATTERN_VARIABLE_OPEN,
	Token,
	TokenType,
} from "../consts.ts";

export default class DuodecimalPitchValuesSequenceLexer {
	private pos = 0;
	private contexts: Context[] = [];
	private tokens: Token[] = [];

	constructor(private readonly input: string) {}

	tokenize(): Token[] {
		mainLoop: while (this.pos < this.input.length) {
			const char = this.input[this.pos];

			if (PITCH_DUODECIMAL_VALUES.includes(char)) {
				this.tokens.push(new Token(TokenType.PITCH_DUODECIMAL_VALUE, char));
				this.pos++;
				continue;
			}

			if ([SYMBOL_OCTAVE_DOWN, SYMBOL_OCTAVE_UP].includes(char)) {
				this.tokens[this.tokens.length - 1].value += char;
				this.pos++;
				continue;
			}

			for (const symbol of [
				[SYMBOL_CHORD_OPEN, TokenType.SYMBOL_CHORD_OPEN],
				[SYMBOL_CHORD_CLOSE, TokenType.SYMBOL_CHORD_CLOSE],
				[
					SYMBOL_FUNCTION_TRANSFORMATOR,
					TokenType.SYMBOL_FUNCTION_TRANSFORMATOR,
				],
			]) {
				if (char === symbol[0]) {
					this.tokens.push(new Token(symbol[1] as TokenType, char));
					this.pos++;
					continue mainLoop;
				}
			}

			if (char === SYMBOL_PATTERN_VARIABLE_OPEN) {
				this.tokens.push(...this.readReference());
				continue mainLoop;
			}

			if (char === SYMBOL_FUNCTION_OPEN) {
				const functionNameToken = this.readFunctionName();
				if (functionNameToken.length > 0) {
					this.contexts.push(Context.IN_FUNCTION);
					this.tokens.push(...functionNameToken);
					continue;
				}
			}

			if (char === SYMBOL_GROUP_OPEN) {
				this.tokens.push(new Token(TokenType.SYMBOL_GROUP_OPEN, char));
				this.contexts.push(Context.IN_GROUP);
				this.pos++;
				continue;
			}

			if (
				char === SYMBOL_GROUP_CLOSE &&
				this.contexts.at(-1) === Context.IN_GROUP
			) {
				this.tokens.push(
					new Token(TokenType.SYMBOL_GROUP_CLOSE, SYMBOL_GROUP_CLOSE),
				);
				this.contexts.pop();
				this.pos++;
				continue;
			}

			if (
				char === SYMBOL_FUNCTION_CLOSE &&
				this.contexts.at(-1) === Context.IN_FUNCTION
			) {
				this.tokens.push(
					new Token(TokenType.SYMBOL_FUNCTION_CLOSE, SYMBOL_FUNCTION_CLOSE),
				);
				this.contexts.pop();
				this.pos++;
				continue;
			}

			this.pos++;
		}

		return this.tokens;
	}

	private readReference(): Token[] {
		const match = this.input.slice(this.pos).match(/^\{(PD\d+)\}/);
		if (match) {
			this.pos = this.pos + "{}".length + match[1].length;
			return [new Token(TokenType.PATTERN_REFERENCE, match[1])];
		} else {
			throw new Error(
				`Pattern reference error in: ${this.input.slice(this.pos)}`,
			);
		}
	}

	private readFunctionName(): Token[] {
		const match = this.input.slice(this.pos).match(/^\((\w+):/);
		if (match) {
			this.pos = this.pos + "(:".length + match[1].length;
			return [
				new Token(TokenType.SYMBOL_FUNCTION_OPEN, SYMBOL_FUNCTION_OPEN),
				new Token(TokenType.FUNCTION_NAME, match[1]),
			];
		} else {
			return [];
		}
	}
}
