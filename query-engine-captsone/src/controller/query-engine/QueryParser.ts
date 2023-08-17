import DataRepository from "../content-data/DataRepository";
import { QueryEngineErrors } from "./QueryEngine";
import { Tokenizer } from "./Tokenizer";
import { FilterFactory } from "./filters/FilterFactory";
import { FilterCriteria, IFilter } from "./filters/IFilter";

interface Dataset {
    id: string;
    grouped?: string[];
}

export interface Order {
    direction: "ascending" | "descending";
    keys: string[];
}

interface AggDef {
    input: string;
    aggregator: string;
    key: string;
}

interface Query {
    type: string;
    id: string;
    filters: IFilter;
    display: string[];
    order: Order;
    grouping?: string[];
    aggregation?: AggDef[];
}

const KEY_MAP: Record<string, string> = {
    "Average": "avg",
    "Pass": "pass",
    "Fail": "fail",
    "Audit": "audit",
    "Latitude": "lat",
    "Longitude": "lon",
    "Seats": "seats",
    "Year": "year",
    "Department": "dept",
    "ID": "id",
    "Instructor": "instructor",
    "Title": "title",
    "UUID": "uuid",
    "Full Name": "fullname",
    "Short Name": "shortname",
    "Number": "number",
    "Name": "name",
    "Address": "address",
    "Type": "type",
    "Furniture": "furniture",
    "Link": "href",
};

const headerValues = Object.values(KEY_MAP);

export const M_OP = [
    "is greater than",
    "is less than",
    "is equal to",
    "is not greater than",
    "is not less than",
    "is not equal to",
];

const S_OP = [
    "is",
    "is not",
    "includes",
    "does not include",
    "begins with",
    "does not begin with",
    "ends with",
    "does not end with",
];

const shouldBreakTokens = ["where", "find", "show", "sort"];

export class Parser {
    private tokenizer: Tokenizer;

    constructor(input: string) {
        const endOfQuery = input.lastIndexOf(".");
        if (endOfQuery === -1 || endOfQuery !== input.length - 1) {
            throw QueryEngineErrors.INVALID_QUERY_STRING;
        }
        this.tokenizer = new Tokenizer(input);
    }

    private consumeAndAssertToken(tokens: string[]): string {
        const token = this.tokenizer.getToken();

        if (!tokens.includes(token)) {
            throw QueryEngineErrors.INVALID_QUERY_STRING;
        }

        return this.tokenizer.consumeToken();
    }

    public parse(): Query {
        this.consumeAndAssertToken(["In"]);

        const dataset = this.parseDataset();
        const filter = this.parseFilter();
        const display = this.parseDisplay();
        const filterFactory = new FilterFactory();

        const withDatasetId = (key: string) => `${dataset.id}_${key}`;

        filter.forEach((f) => {
            if (f.key in KEY_MAP) {
                f.key = withDatasetId(KEY_MAP[f.key]);
            } else {
                throw QueryEngineErrors.INVALID_QUERY_STRING;
            }
        });
        const filters = filterFactory.createFilter(filter);

        let grouping: string[] | undefined;
        let aggregation: AggDef[] | undefined;
        const alias = new Set();

        if (dataset.grouped) {
            grouping = dataset.grouped;

            grouping.forEach((g, i) => {
                if (!(g in KEY_MAP) && !headerValues.includes(g)) {
                    throw QueryEngineErrors.INVALID_QUERY_STRING;
                }
                grouping[i] = withDatasetId(g);
            });
        }

        aggregation = this.parseAggregation();
        if (aggregation) {
            aggregation.forEach((agg) => {
                alias.add(agg.input);
            });
        }

        display.forEach((d, i) => {
            if (d in KEY_MAP) {
                display[i] = KEY_MAP[d];
            } else if (!alias.has(d)) {
                throw QueryEngineErrors.INVALID_QUERY_STRING;
            }
        });

        let order = this.parseOrder(display);

        if (order) {
            order.keys.forEach((k, i) => {
                if (
                    !(k in KEY_MAP) &&
                    !alias.has(k) &&
                    !headerValues.includes(k)
                ) {
                    throw QueryEngineErrors.INVALID_QUERY_STRING;
                }

                order.keys[i] = alias.has(k) ? k : withDatasetId(k);
            });
        }

        display.forEach(
            (d, i) => (display[i] = alias.has(d) ? d : withDatasetId(d))
        );

        return {
            type: aggregation ? "QUERY_AGGREGATE" : "QUERY_NORMAL",
            id: dataset.id,
            filters,
            display,
            order,
            grouping,
            aggregation: aggregation?.map((agg) => {
                return {
                    input: agg.input,
                    aggregator: agg.aggregator,
                    key: withDatasetId(agg.key),
                };
            }),
        };
    }

    private parseDataset(): Dataset {
        this.consumeAndAssertToken(["courses", "rooms"]);

        this.consumeAndAssertToken(["dataset"]);
        const id = this.tokenizer.consumeToken();
        if (!DataRepository.hasDataset(id)) {
            throw QueryEngineErrors.INVALID_QUERY_STRING;
        }

        const grouped =
            this.consumeAndAssertToken(["grouped", ","]) === "grouped";
        if (!grouped) {
            return { id };
        }

        this.consumeAndAssertToken(["by"]);

        const grouping = this.parseKeys();

        return { id, grouped: grouping };
    }

    private parseAggregation(): AggDef[] | null {
        if (this.tokenizer.getToken() !== "where") {
            return null;
        }

        this.consumeAndAssertToken(["where"]);

        const aggregations: AggDef[] = [];
        const seenInputs = new Set<string>();
        while (
            this.tokenizer.getToken() !== ";" &&
            this.tokenizer.getToken() !== "."
        ) {
            const input = this.tokenizer.consumeToken();
            if (seenInputs.has(input)) {
                throw QueryEngineErrors.INVALID_QUERY_STRING;
            }
            seenInputs.add(input);

            this.consumeAndAssertToken(["is the"]);

            const aggregator = this.consumeAndAssertToken([
                "MAX",
                "MIN",
                "AVG",
                "SUM",
                "COUNT",
            ]);

            this.consumeAndAssertToken(["of"]);

            const key = this.tokenizer.consumeToken();

            aggregations.push({
                input,
                aggregator,
                key: KEY_MAP[key],
            });

            if (
                this.tokenizer.getToken() === "and" ||
                this.tokenizer.getToken() === ","
            ) {
                this.tokenizer.consumeToken();
            }
        }
        this.consumeAndAssertToken([";", "."]);

        return aggregations;
    }

    private parseKeys(): string[] {
        const keys: string[] = [];
        while (true) {
            const key = this.tokenizer.consumeToken();
            if (!key || !key.trim().length) {
                throw QueryEngineErrors.INVALID_QUERY_STRING;
            }

            keys.push(KEY_MAP[key] || key);

            const nextToken = this.tokenizer.getToken();
            if (nextToken === ",") {
                this.tokenizer.consumeToken();

                const currentToken = this.tokenizer.getToken();

                if (shouldBreakTokens.includes(currentToken)) {
                    break;
                }
            } else if (nextToken === "and") {
                this.tokenizer.consumeToken();
                const lastKey = this.tokenizer.consumeToken();
                this.tokenizer.consumeToken();
                if (!lastKey || !lastKey.trim().length) {
                    throw QueryEngineErrors.INVALID_QUERY_STRING;
                }
                keys.push(KEY_MAP[lastKey] || lastKey);
                break;
            } else if (nextToken === ";" || nextToken === ".") {
                break;
            } else {
                throw QueryEngineErrors.INVALID_QUERY_STRING;
            }
        }
        return keys;
    }

    private parseFilter(): FilterCriteria[] {
        this.consumeAndAssertToken(["find"]);

        const allOrEntries = this.consumeAndAssertToken(["all", "entries"]);

        if (allOrEntries === "all") {
            this.consumeAndAssertToken(["entries"]);
            this.consumeAndAssertToken([";"]);
            return [];
        } else if (allOrEntries === "entries") {
            this.consumeAndAssertToken(["whose"]);

            const criteria: FilterCriteria[] = [];
            while (true) {
                const key = this.tokenizer.consumeToken();
                if (
                    typeof key !== "string" ||
                    !key.trim().length ||
                    !(key in KEY_MAP)
                ) {
                    throw QueryEngineErrors.INVALID_QUERY_STRING;
                }

                const operator = this.consumeAndAssertToken([...M_OP, ...S_OP]);

                const value = this.tokenizer.consumeToken();

                if (
                    S_OP.includes(operator) &&
                    [...value].filter((c) => c === '"').length !== 2
                ) {
                    throw QueryEngineErrors.INVALID_QUERY_STRING;
                }

                if (M_OP.includes(operator) && isNaN(Number(value))) {
                    throw QueryEngineErrors.INVALID_QUERY_STRING;
                }
                if (typeof value !== "string" || !value.trim().length) {
                    throw QueryEngineErrors.INVALID_QUERY_STRING;
                }

                criteria.push({
                    key,
                    operator,
                    value: value.replace(/"/g, ""),
                });

                const connector = this.consumeAndAssertToken([
                    "and",
                    "or",
                    ";",
                ]);

                if (connector === "and" || connector === "or") {
                    criteria[criteria.length - 1].logicalConnector = connector;
                } else {
                    break;
                }
            }

            return criteria;
        } else {
            throw QueryEngineErrors.INVALID_QUERY_STRING;
        }
    }

    private parseDisplay(): string[] {
        this.consumeAndAssertToken(["show"]);

        const keys: string[] = [];
        while (true) {
            const key = this.tokenizer.consumeToken();
            if (typeof key !== "string" || !key.trim().length) {
                throw QueryEngineErrors.INVALID_QUERY_STRING;
            }

            keys.push(key);

            const currentToken = this.consumeAndAssertToken([
                "and",
                ",",
                ";",
                ".",
            ]);
            if (currentToken === "and" || currentToken === ",") {
                const nextToken = this.tokenizer.getToken();
                if (nextToken === "and") {
                    this.tokenizer.consumeToken();
                } else if (shouldBreakTokens.includes(nextToken)) {
                    break;
                }
            } else {
                break;
            }
        }
        if (keys.length === 0) {
            throw QueryEngineErrors.INVALID_QUERY_STRING;
        }

        return keys;
    }

    private parseOrder(display: string[]): Order | null {
        if (this.tokenizer.getToken() !== "sort") {
            return null;
        }
        this.tokenizer.consumeToken();

        this.consumeAndAssertToken(["in"]);
        const orderDirection = this.consumeAndAssertToken([
            "ascending",
            "descending",
        ]) as "ascending" | "descending";
        this.consumeAndAssertToken(["order"]);
        this.consumeAndAssertToken(["by"]);

        const keys = this.parseKeys();
        keys.forEach((key) => {
            if (!display.includes(key)) {
                throw QueryEngineErrors.INVALID_QUERY_STRING;
            }
        });
        return {
            direction: orderDirection,
            keys: keys,
        };
    }
}
