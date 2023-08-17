import {
    InsightDatasetErrors,
    InsightDatasetOperations,
} from "./IInsightExtra";
import { InsightDatasetKind } from "./IInsightFacade";
import { InsightError } from "./InsightError";
import DataRepository from "./content-data/DataRepository";
import { DatasetRow } from "./content-data/IData";

interface IValidateMethod {
    operation: InsightDatasetOperations;
    id?: string | null;
    content?: string;
    kind?: InsightDatasetKind | null;
}

const M_OP = new Set([
    "is greater than",
    "is less than",
    "is equal to",
    "is not greater than",
    "is not less than",
    "is not equal to",
]);

const S_OP = new Set([
    "is",
    "is not",
    "includes",
    "does not include",
    "begins with",
    "does not begin with",
    "ends with",
    "does not end with",
]);

export function isInsightDatasetKind(value: string): InsightDatasetKind {
    if (
        Object.values(InsightDatasetKind).includes(value as InsightDatasetKind)
    ) {
        return value as InsightDatasetKind;
    }

    return null;
}

export class Validator {
    public static validate({ operation, id, content, kind }: IValidateMethod) {
        let datasets = DataRepository.getDatastore();

        if (!this.isValidId(id)) {
            throw new InsightError(operation, InsightDatasetErrors.INVALID_ID);
        }

        switch (operation) {
            case InsightDatasetOperations.ADD:
                if (!kind || !isInsightDatasetKind(kind)) {
                    throw new InsightError(
                        operation,
                        InsightDatasetErrors.INVALID_KIND
                    );
                }

                if (datasets && id in datasets) {
                    throw new InsightError(
                        operation,
                        InsightDatasetErrors.DUPLICATE_DATASET
                    );
                }
                this.validateContent(content);
                break;

            case InsightDatasetOperations.REMOVE:
                if ((id && !datasets) || !(id in datasets)) {
                    throw new InsightError(
                        operation,
                        InsightDatasetErrors.DATASET_NOT_FOUND
                    );
                }
                break;
            default:
                throw new Error("Unsupported operation");
        }
    }

    public static validateFileContents(fileContents: string[]): void {
        if (!fileContents.some((content) => content)) {
            throw new InsightError(
                InsightDatasetOperations.ADD,
                InsightDatasetErrors.EMPTY_DATASET
            );
        }
    }

    private static validateContent(content: string): void {
        if (!content) {
            throw new InsightError(
                InsightDatasetOperations.ADD,
                InsightDatasetErrors.INVALID_CONTENT
            );
        }
    }

    public static validateDataset(data: DatasetRow[]): void {
        if (data.length === 0) {
            throw new InsightError(
                InsightDatasetOperations.ADD,
                InsightDatasetErrors.EMPTY_DATASET
            );
        }
    }

    public static validateHeaders(
        headerLine: string,
        headerMapping: {
            [key: string]: string;
        }
    ) {
        const headers = headerLine.split("|").map((h) => h.trim());

        const uniqueHeaders = Array.from(new Set(headers));
        if (uniqueHeaders.length !== headers.length) {
            throw new InsightError(
                InsightDatasetOperations.ADD,
                InsightDatasetErrors.INVALID_CSV_CONTENT
            );
        }

        headers.forEach((header) => {
            if (!(header in headerMapping)) {
                throw new InsightError(
                    InsightDatasetOperations.ADD,
                    InsightDatasetErrors.INVALID_CSV_CONTENT
                );
            }
        });
    }

    private static isValidId(id: string) {
        if (typeof id !== "string" || id.length === 0) {
            return false;
        }

        if (id.includes("_") || id.includes(" ")) {
            return false;
        }

        const RESERVED_KEYWORDS = new Set([
            "In",
            "in",
            "dataset",
            "find",
            "all",
            "show",
            "and",
            "or",
            "sort",
            "by",
            "entries",
            "grouped",
            "where",
            "the",
            "of",
            "whose",
            "MAX",
            "MIN",
            "AVG",
            "SUM",
            "COUNT",
        ]);

        if (RESERVED_KEYWORDS.has(id)) {
            return false;
        }

        if (M_OP.has(id) || S_OP.has(id)) {
            return false;
        }

        return true;
    }
}
