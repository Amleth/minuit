export const SYMBOL_COMMENT = "#";
export const SYMBOL_CHORD_OPEN = "<";
export const SYMBOL_CHORD_CLOSE = ">";
export const SYMBOL_GROUP_OPEN = "(";
export const SYMBOL_GROUP_CLOSE = ")";
export const SYMBOL_OCTAVE_UP = "'";
export const SYMBOL_OCTAVE_DOWN = ",";
export const SYMBOL_PATTERN_VARIABLE_OPEN = "{";
export const SYMBOL_PATTERN_VARIABLE_CLOSE = "}";

export enum TokenType {
	COMMENT = "COMMENT",
	SYMBOL_CHORD_CLOSE = "SYMBOL_CHORD_CLOSE",
	SYMBOL_CHORD_OPEN = "SYMBOL_CHORD_OPEN",
	SYMBOL_GROUP_CLOSE = "SYMBOL_GROUP_CLOSE",
	SYMBOL_GROUP_OPEN = "SYMBOL_GROUP_OPEN",
	PATTERN_REFERENCE = "PATTERN_REFERENCE",
	PITCH_DUODECIMAL_VALUE = "PITCH_DUODECIMAL_VALUE",
}

export enum ContextsEnum {
	FunctionTransformator,
	FunctionGenerator,
	Group,
}

export enum LineTypeEnum {
	CC,
	G,
	PA,
	PD,
	PL,
	PM,
	R,
	RS,
	V,
}

export const PATTERN_TYPES = {
	CC: {
		description: "Continuous Controller values",
		lineRegex: /^(CC\d+)_(\d+)=(.*)/,
	},
	G: {
		description: "Drum grid",
		lineRegex: /^(G\d+)_(\d+)=(.*)/,
	},
	PA: {
		description: "Pitches pattern with letters and accidentals",
		lineRegex: /^(PA)(\d+)=(.*)/,
	},
	PD: {
		description: "Pitches pattern with duodecimal values",
		lineRegex: /^(PD)(\d+)=(.*)/,
	},
	PL: {
		description: "Pitches pattern with letters",
		lineRegex: /^(PL)(\d+)=(.*)/,
	},
	PM: {
		description: "Pitches pattern with MIDI note numbers",
		lineRegex: /^(PM)(\d+)=(.*)/,
	},
	R: {
		description: "Rhythm pattern with note values",
		lineRegex: /^(R)(\d+)=(.*)/,
	},
	RS: {
		description: "Rhythm pattern with ms values",
		lineRegex: /^(RS)(\d+)=(.*)/,
	},
	V: {
		description: "Velocity pattern",
		lineRegex: /^(V)(\d+)=(.*)/,
	},
};

export const PITCH_DUODECIMAL_VALUES = [..."0123456789xXyY"];

export class Token {
	public type: TokenType;
	public value: string;
	constructor(type: TokenType, value: string) {
		this.type = type;
		this.value = value;
	}
}
