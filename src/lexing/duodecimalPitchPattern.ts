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
		for (const tokenType of [
			TokenType.SYMBOL_CHORD_OPEN,
			TokenType.SYMBOL_CHORD_CLOSE,
			TokenType.SYMBOL_GROUP_OPEN,
			TokenType.SYMBOL_GROUP_CLOSE,
			TokenType.SYMBOL_PATTERN_VARIABLE_OPEN,
			TokenType.SYMBOL_PATTERN_VARIABLE_CLOSE,
		]) {
			if (c === MidnightSymbols[tokenType]) {
				tokens.push(new Token(tokenType, c));
			}
		}
	}

	return tokens;
}
