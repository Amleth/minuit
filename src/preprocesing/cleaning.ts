import { SYMBOL_COMMENT } from "../consts.ts";

export default function process(input: string): string {
	return input
		.split(/\r?\n/)
		.filter((line) => line.length > 0)
		.map((line) => line.trim())
		.filter((line) => !line.startsWith(SYMBOL_COMMENT))
		.join("\n");
}
