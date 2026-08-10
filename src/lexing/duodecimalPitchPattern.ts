import {
	MidnightSymbols,
	PITCH_DUODECIMAL_VALUES,
	Token,
	TokenType,
} from "../consts.ts";

export function tokenize(input: string): Token[] {
	const tokens: Token[] = [];

	for (const c of input) {
		if (PITCH_DUODECIMAL_VALUES.includes(c)) {
			tokens.push(new Token(TokenType.PITCH_DUODECIMAL_VALUE, c));
		}
		if (
			[
				MidnightSymbols[TokenType.SYMBOL_OCTAVE_DOWN],
				MidnightSymbols[TokenType.SYMBOL_OCTAVE_UP],
			].includes(c)
		) {
			tokens[tokens.length - 1].value += c;
		}
		switch (c) {
			case MidnightSymbols[TokenType.SYMBOL_CHORD_OPEN]:
				tokens.push(new Token(TokenType.SYMBOL_CHORD_OPEN, c));
				break;
			case MidnightSymbols[TokenType.SYMBOL_CHORD_CLOSE]:
				tokens.push(new Token(TokenType.SYMBOL_CHORD_CLOSE, c));
				break;
		}
	}

	return tokens;
}
