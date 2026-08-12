export const SYMBOL_CHORD_CLOSE = ">";
export const SYMBOL_CHORD_OPEN = "<";
export const SYMBOL_COMMENT = "#";
export const SYMBOL_FUNCTION_CLOSE = ")";
export const SYMBOL_FUNCTION_NAME = ":";
export const SYMBOL_FUNCTION_OPEN = "(";
export const SYMBOL_FUNCTION_PARAMETER_SEPARATOR = ";";
export const SYMBOL_FUNCTION_TRANSFORMATOR = "~";
export const SYMBOL_GROUP_CLOSE = ")";
export const SYMBOL_GROUP_OPEN = "(";
export const SYMBOL_OCTAVE_DOWN = ",";
export const SYMBOL_OCTAVE_UP = "'";
export const SYMBOL_PATTERN_VARIABLE_CLOSE = "}";
export const SYMBOL_PATTERN_VARIABLE_OPEN = "{";
export const SYMBOL_SUB_CLOSE = "]";
export const SYMBOL_SUB_OPEN = "[";

export const functionNameRegExp = "[a-zA-Z0-9_]+";

export enum TokenTypePatternDeclaration {
	COMMENT = "COMMENT",
	FUNCTION_NAME = "FUNCTION_NAME",
	SYMBOL_CHORD_CLOSE = "SYMBOL_CHORD_CLOSE",
	SYMBOL_CHORD_OPEN = "SYMBOL_CHORD_OPEN",
	SYMBOL_FUNCTION_CLOSE = "SYMBOL_FUNCTION_CLOSE",
	SYMBOL_FUNCTION_OPEN = "SYMBOL_FUNCTION_OPEN",
	SYMBOL_FUNCTION_TRANSFORMATOR = "SYMBOL_FUNCTION_TRANSFORMATOR",
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
	PatternDeclarationCC = "CC",
	PatternDeclarationG = "G",
	PatternDeclarationPA = "PA",
	PatternDeclarationPD = "PD",
	PatternDeclarationPL = "PL",
	PatternDeclarationPM = "PM",
	PatternDeclarationR = "R",
	PatternDeclarationRS = "RS",
	PatternDeclarationV = "V",
}

export enum LineTypeCategoryEnum {
	PatternDeclaration = "PatternDeclaration",
	StupidStuff = "StupidStuff",
}

type LineType = {
	description: string;
	lineRegExp: RegExp;
	type: LineTypesEnum;
	category: LineTypeCategoryEnum;
};

export const LINE_TYPES: LineType[] = [
	{
		description: "Continuous Controller values",
		lineRegExp: /^(CC\d+)_(\d+)=(.*)/,
		type: LineTypesEnum.PatternDeclarationCC,
		category: LineTypeCategoryEnum.PatternDeclaration,
	},
	{
		description: "Drum grid",
		lineRegExp: /^(G\d+)_(\d+)=(.*)/,
		type: LineTypesEnum.PatternDeclarationG,
		category: LineTypeCategoryEnum.PatternDeclaration,
	},
	{
		description: "Pitches pattern with letters and accidentals",
		lineRegExp: /^(PA)(\d+)=(.*)/,
		type: LineTypesEnum.PatternDeclarationPA,
		category: LineTypeCategoryEnum.PatternDeclaration,
	},
	{
		description: "Pitches pattern with duodecimal values",
		lineRegExp: /^(PD)(\d+)=(.*)/,
		type: LineTypesEnum.PatternDeclarationPD,
		category: LineTypeCategoryEnum.PatternDeclaration,
	},
	{
		description: "Pitches pattern with letters",
		lineRegExp: /^(PL)(\d+)=(.*)/,
		type: LineTypesEnum.PatternDeclarationPL,
		category: LineTypeCategoryEnum.PatternDeclaration,
	},
	{
		description: "Pitches pattern with MIDI note numbers",
		lineRegExp: /^(PM)(\d+)=(.*)/,
		type: LineTypesEnum.PatternDeclarationPM,
		category: LineTypeCategoryEnum.PatternDeclaration,
	},
	{
		description: "Rhythm pattern with note values",
		lineRegExp: /^(R)(\d+)=(.*)/,
		type: LineTypesEnum.PatternDeclarationR,
		category: LineTypeCategoryEnum.PatternDeclaration,
	},
	{
		description: "Rhythm pattern with ms values",
		lineRegExp: /^(RS)(\d+)=(.*)/,
		type: LineTypesEnum.PatternDeclarationRS,
		category: LineTypeCategoryEnum.PatternDeclaration,
	},
	{
		description: "Velocity pattern",
		lineRegExp: /^(V)(\d+)=(.*)/,
		type: LineTypesEnum.PatternDeclarationV,
		category: LineTypeCategoryEnum.PatternDeclaration,
	},
];

export const PITCH_DUODECIMAL_VALUES = [..."0123456789xXyY"];
