export default function (
	input: string,
	openSymbol: string,
	closeSymbol: string,
): string {
	let depth = 0;

	for (let i = 0; i < input.length; i++) {
		const char = input[i];

		if (char === openSymbol) {
			depth++;
		}

		if (char === closeSymbol) {
			depth--;
		}

		if (depth === 0) {
			return input.slice(0, i + 1);
		}
	}

	throw new Error(
		`No "${openSymbol}/${closeSymbol}" group could be shifted from: ${input}`,
	);
}
