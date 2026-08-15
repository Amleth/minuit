export function getClosingCharacterDistance(
	input: string,
	openingCharacter: string,
	closingCharacter: string,
): number {
	let depth = 0;

	for (let i = 0; i < input.length; i++) {
		if (input[i] === openingCharacter) {
			depth++;
		}
		if (input[i] === closingCharacter) {
			if (depth) {
				depth--;
			}
			if (0 === depth) {
				return i;
			}
		}
	}

	throw new Error(
		`No closing character "${closingCharacter}" found in "${input}".`,
	);
}
