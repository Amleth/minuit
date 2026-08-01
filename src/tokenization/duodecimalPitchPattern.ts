import {
	DUODECIMAL_VALUES,
	OCTAVE_DOWN,
	OCTAVE_UP,
	Token,
	TokenType,
} from "../consts.ts";

export function tokenize(input: string): Token[] {
	const tokens: Token[] = [];

	for (const c of input) {
		if (DUODECIMAL_VALUES.includes(c)) {
			tokens.push(new Token(TokenType.DUODECIMAL_VALUE, c));
		}
		if ([OCTAVE_DOWN, OCTAVE_UP].includes(c)) {
			tokens[tokens.length - 1].value += c;
		}
	}

	return tokens;
}
