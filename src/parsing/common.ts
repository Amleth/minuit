export function areParenthesesBalanced(input: string): boolean {
	let balance = 0;

	for (const char of input) {
		if (char === "(") {
			balance++;
		} else if (char === ")") {
			balance--;

			if (balance < 0) {
				return false;
			}
		}
	}

	return balance === 0;
}
