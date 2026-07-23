export enum TokenType {
	NULL,
}

export type Token = {
	type: TokenType;
	value: string;
};

export function tokenize(input: string): Token[] {
	const t: Token = { type: TokenType.NULL, value: "" };
	return [t];
}
