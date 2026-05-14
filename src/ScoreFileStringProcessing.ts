import emojiRegex from "npm:emoji-regex";

export function process(fileContent: string): string {
    let lines = fileContent
        .split(/\r?\n/)
        .filter(line => line.length > 0)
        .filter(line => !line.startsWith(';')) // comments
        .map(line => line.trim());

    // SYMBOLS SUBSTITUTION

    const symbolsDict: Record<string, string> = {};

    for (const line of lines) {
        if (line.startsWith('$')) {
            const symbolMatch = line.match(/\$(.*?)=(.*)/);
            if (symbolMatch) {
                if (emojiRegex().test(symbolMatch[1])) {
                    symbolsDict[symbolMatch[1]] = symbolMatch[2];
                }
            }
        }
    }

    console.log('SYMBOLS', symbolsDict);
    lines = lines.filter(line => !line.startsWith('$'));

    for (const [symbol, symbolValue] of Object.entries(symbolsDict)) {
        for (let i = 0; i < lines.length; i++) {
            lines[i] = lines[i].replaceAll(symbol, symbolValue);
        }
    }

    // MULTILINES ASSIGNMENTS

    let linesCopy: string[] = [...lines];
    lines.length = 0;

    let temp: string[] = [];
    let inMultilinesAssignment = false;

    for (const line of linesCopy) {
        if (!inMultilinesAssignment) {
            if (!line.endsWith('...')) {
                lines.push(line);
            }
            else {
                inMultilinesAssignment = true;
                temp.push(line.replace('...', ':'));
            }
        }
        else {
            if (line !== '.') {
                temp.push(line);
            }
            else {
                inMultilinesAssignment = false;
                lines.push(temp.join(' '));
                temp.length = 0;
            }
        }
    }

    return lines.join('\n');
}