export function areSymbolsBalanced(
	input: string,
	openSymbol: string,
	closeSymbol: string,
): boolean {
	let balance = 0;

	for (const char of input) {
		if (char === openSymbol) {
			balance++;
		} else if (char === closeSymbol) {
			balance--;

			if (balance < 0) {
				return false;
			}
		}
	}

	return balance === 0;
}
