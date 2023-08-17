import Decimal from "decimal.js";
import DataRepository from "../content-data/DataRepository";
import { DataKeys, DatasetRow, IDataStore } from "../content-data/IData";
import { Order, Parser } from "./QueryParser";
import { IFilter } from "./filters/IFilter";
import { stableMergeSort } from "./SortUtil";

export enum QueryEngineErrors {
    INVALID_QUERY_STRING = "Invalid query string",
}

export class QueryEngine {
    private static instance: QueryEngine;
    private dataStore: IDataStore;

    public static getInstance(): QueryEngine {
        if (!this.instance) {
            this.instance = new QueryEngine();
        }
        return this.instance;
    }

    public execute(queryString: string): Array<Record<string, any>> | null {
        this.dataStore = DataRepository.getDatastore();
        const parser = new Parser(queryString);
        const { type, id, filters, display, order, grouping, aggregation } =
            parser.parse();

        let results = this.filterEntries(id, filters);

        if (grouping) {
            results = this.groupEntries(results, grouping);
        }

        if (type === "QUERY_AGGREGATE") {
            results = this.applyCalculations(results, aggregation);
        }

        if (order) {
            results = this.sortEntries(results, order);
        }

        if (display.length > 0) {
            display.forEach((field, i) => {
                aggregation?.forEach((agg) => {
                    if (agg.key === field) {
                        display[i] = agg.input;
                    }
                });
            });

            results = this.projectEntries(results, display);
        }

        return results;
    }

    private projectEntries(
        entries: Array<Record<string, any>>,
        display: string[]
    ): Array<Record<string, any>> {
        return entries.map((entry) => {
            const newEntry: Record<string, any> = {};
            display.forEach((field) => {
                if (!(field in entry)) {
                    throw QueryEngineErrors.INVALID_QUERY_STRING;
                }
                newEntry[field] = entry[field];
            });
            return newEntry;
        });
    }

    private filterEntries(
        datasetId: string,
        filter: IFilter
    ): Array<Record<string, any>> {
        if (
            !(datasetId in this.dataStore) ||
            !this.dataStore[datasetId][DataKeys.DATASETS]
        ) {
            throw QueryEngineErrors.INVALID_QUERY_STRING;
        }

        const data = this.dataStore[datasetId][DataKeys.DATASETS];

        if (!filter) {
            return data;
        }

        return data.reduce((filteredFields, row) => {
            if (filter.matches(row)) {
                filteredFields.push(row);
            }
            return filteredFields;
        }, [] as DatasetRow[]);
    }

    private groupEntries(
        entries: Array<Record<string, any>>,
        grouping: string[]
    ): Array<Record<string, any>> {
        const groups: Record<string, Array<Record<string, any>>> = {};

        entries.forEach((entry) => {
            const groupKey = grouping.map((field) => entry[field]).join("::");

            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }

            groups[groupKey].push(entry);
        });

        const groupedEntries = Object.values(groups);

        return groupedEntries.map((group) => {
            const representativeEntry: Record<string, any> = {};
            grouping.forEach((field) => {
                representativeEntry[field] = group[0][field];
            });
            representativeEntry["_group"] = group;
            return representativeEntry;
        });
    }

    private applyCalculations(
        entries: Array<Record<string, any>>,
        aggregation: Array<{ input: string; aggregator: string; key: string }>
    ): Array<Record<string, any>> {
        return entries.map((entry) => {
            const group = entry["_group"] as Array<Record<string, any>>;
            const resultEntry: Record<string, any> = {};

            Object.assign(resultEntry, entry);

            aggregation.forEach(({ input, aggregator, key }) => {
                const values: number[] = group.map((e) => e[key]);

                switch (aggregator) {
                    case "MAX":
                        resultEntry[input] = Math.max(...values);
                        break;
                    case "MIN":
                        resultEntry[input] = Math.min(...values);
                        break;
                    case "AVG":
                        const sum = values.reduce(
                            (accum, val) => accum.plus(new Decimal(val)),
                            new Decimal(0)
                        );
                        const avg = sum.toNumber() / values.length;
                        resultEntry[input] = Number(avg.toFixed(2));
                        break;
                    case "SUM":
                        const totalSum = values.reduce(
                            (accum, val) => accum.plus(val),
                            new Decimal(0)
                        );

                        resultEntry[input] = Number(
                            totalSum.toDecimalPlaces(2)
                        );
                        break;
                    case "COUNT":
                        resultEntry[input] = new Set(values).size;
                        break;
                }
            });

            return resultEntry;
        });
    }

    private sortEntries(
        entries: Array<Record<string, any>>,
        order: Order
    ): Array<Record<string, any>> {
        const { direction, keys } = order;

        return stableMergeSort(entries, (a, b) => {
            for (const key of keys) {
                if (direction === "ascending") {
                    if (a[key] < b[key]) {
                        return -1;
                    } else if (a[key] > b[key]) {
                        return 1;
                    }
                } else {
                    if (a[key] > b[key]) {
                        return -1;
                    } else if (a[key] < b[key]) {
                        return 1;
                    }
                }
            }
            return 0;
        });
    }
}
