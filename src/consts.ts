import { Line } from "./structs.ts";

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

export enum LineTypesEnum {
	CC = "CC",
	G = "G",
	PA = "PA",
	PD = "PD",
	PL = "PL",
	PM = "PM",
	R = "R",
	RS = "RS",
	V = "V",
}

type LineType = {
	description: string;
	lineRegExp: RegExp;
	type: LineTypesEnum;
};

export const LINE_TYPES: Record<LineTypesEnum, LineType> = {
	[LineTypesEnum.CC]: {
		description: "Continuous Controller values",
		lineRegExp: /^(CC\d+)_(\d+)=(.*)/,
		type: LineTypesEnum.CC,
	},
	[LineTypesEnum.G]: {
		description: "Drum grid",
		lineRegExp: /^(G\d+)_(\d+)=(.*)/,
		type: LineTypesEnum.G,
	},
	[LineTypesEnum.PA]: {
		description: "Pitches pattern with letters and accidentals",
		lineRegExp: /^(PA)(\d+)=(.*)/,
		type: LineTypesEnum.PA,
	},
	[LineTypesEnum.PD]: {
		description: "Pitches pattern with duodecimal values",
		lineRegExp: /^(PD)(\d+)=(.*)/,
		type: LineTypesEnum.PD,
	},
	[LineTypesEnum.PL]: {
		description: "Pitches pattern with letters",
		lineRegExp: /^(PL)(\d+)=(.*)/,
		type: LineTypesEnum.PL,
	},
	[LineTypesEnum.PM]: {
		description: "Pitches pattern with MIDI note numbers",
		lineRegExp: /^(PM)(\d+)=(.*)/,
		type: LineTypesEnum.PM,
	},
	[LineTypesEnum.R]: {
		description: "Rhythm pattern with note values",
		lineRegExp: /^(R)(\d+)=(.*)/,
		type: LineTypesEnum.R,
	},
	[LineTypesEnum.RS]: {
		description: "Rhythm pattern with ms values",
		lineRegExp: /^(RS)(\d+)=(.*)/,
		type: LineTypesEnum.RS,
	},
	[LineTypesEnum.V]: {
		description: "Velocity pattern",
		lineRegExp: /^(V)(\d+)=(.*)/,
		type: LineTypesEnum.V,
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
