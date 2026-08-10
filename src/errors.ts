import type { Line } from "./structs.ts";

export const unbalancedSymbolsError = (
	line: Line,
	openSymbol: string,
	closeSymbol: string,
) =>
	new Error(
		`Unbalanced ${openSymbol}${closeSymbol} in line ${line.number + 1}: ${line.content}`,
	);
