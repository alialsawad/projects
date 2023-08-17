const RULES = [
    {
        type: "IS_THE",
        pattern: /\bis the\b/,
    },
    {
        type: "KEYWORD",
        pattern: new RegExp(
            "\\b(" +
                "In|dataset|find|all|show|and|or|by|entries|the|of|whose|" +
                "grouped|where|sort|in|ascending|descending|order" +
                ")\\b"
        ),
    },
    {
        type: "M_OP",
        pattern: /\bis (not )?(greater than|less than|equal to)\b/,
    },
    {
        type: "S_OP",
        pattern: new RegExp(
            "(?:\\bis\\b(?:\\s+\\bnot\\b)?" +
                "|includes" +
                "|does not include" +
                "|begins with" +
                "|does not begin with" +
                "|ends with" +
                "|does not end with)\\b"
        ),
    },

    {
        type: "AGGREGATOR",
        pattern: /\b(MAX|MIN|AVG|SUM|COUNT)\b/,
    },
    { type: "NUMBER", pattern: /-?\d+(\.\d+)?\b/ },
    { type: "STRING", pattern: /"([^"]*)"/ },
    { type: "KIND", pattern: /\b(courses|rooms)\b/ },
    {
        type: "M_KEY",
        pattern: /\b(Average|Pass|Fail|Audit|Latitude|Longitude|Seats|Year)\b/,
    },
    {
        type: "S_KEY",
        pattern:
            /\b(Department|ID|Instructor|Title|UUID|Full Name|Short Name|Number|Name|Address|Type|Furniture|Link)\b/,
    },
    { type: "SEPARATOR", pattern: /[;.,]/ },
    {
        type: "CUSTOM_LABEL",
        pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*\b/,
    },
];

export class Tokenizer {
    private tokens: string[];
    private position: number = 0;

    constructor(input: string) {
        this.tokens = this.tokenize(input);
    }

    private tokenize(input: string): string[] {
        const tokens = [];
        let pos = 0;

        while (pos < input.length) {
            let match = null;

            for (const rule of RULES) {
                const regex = new RegExp(`^${rule.pattern.source}`, "g");
                let result = regex.exec(input.slice(pos));

                if (result && (!match || result[0].length > match[0].length)) {
                    match = result;
                }
            }

            if (match) {
                tokens.push(match[0].trim());
                pos += match[0].length;
            } else {
                pos++;
            }
        }

        return tokens;
    }

    public getToken(): string {
        return this.tokens[this.position];
    }

    public consumeToken(): string {
        const token = this.getToken();

        this.position++;
        return token;
    }
}
