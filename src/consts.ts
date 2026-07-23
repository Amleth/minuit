export const COMMENT = "#";

export enum LineTypeEnum {
	CC = "Continuous Controller values",
	G = "Drum grid",
	PA = "Pitches pattern with letters and accidentals",
	PD = "Pitches pattern with duodecimal values",
	PL = "Pitches pattern with letters",
	PM = "Pitches pattern with MIDI note numbers",
	R = "Rhythm pattern with note values",
	RS = "Rhythm pattern with ms values",
	V = "Velocity pattern",
}

class LineDesc {
	public regexp: RegExp;
	public fn: any;
	constructor(regexp: RegExp, fn: any) {
		this.regexp = regexp;
		this.fn = fn;
	}
}

export const lineStarts: Record<LineTypeEnum, LineDesc> = {
	[LineTypeEnum.CC]: new LineDesc(/^(CC\d+)_(\d+)=/, () => null),
	[LineTypeEnum.G]: new LineDesc(/^(G\d+)_(\d+)=/, () => null),
	[LineTypeEnum.PA]: new LineDesc(/^(PA)(\d+)=/, () => null),
	[LineTypeEnum.PD]: new LineDesc(/^(PD)(\d+)=/, () => null),
	[LineTypeEnum.PL]: new LineDesc(/^(PL)(\d+)=/, () => null),
	[LineTypeEnum.PM]: new LineDesc(/^(PM)(\d+)=/, () => null),
	[LineTypeEnum.R]: new LineDesc(/^(R)(\d+)=/, () => null),
	[LineTypeEnum.RS]: new LineDesc(/^(RS)(\d+)=/, () => null),
	[LineTypeEnum.V]: new LineDesc(/^(V)(\d+)=/, () => null),
};

export class Line {
	public number: number;
	public content: string;
	public type: LineTypeEnum;
	public tokens: Token[];
	constructor(number: number, content: string, type: LineTypeEnum) {
		this.number = number;
		this.content = content;
		this.type = type;
		this.tokens = [];
	}
}

export enum TokenType {}

export class Token {
	public type: TokenType;
	public value: string;
	constructor(type: TokenType, value: string) {
		this.type = type;
		this.value = value;
	}
}
