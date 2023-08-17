import { DatasetRow } from "../../content-data/IData";
import { FilterCriteria } from "./IFilter";

export class StringFilter {
    private key: string;
    private operator: string;
    private value: string;

    constructor({ key, operator, value }: FilterCriteria) {
        this.key = key;
        this.operator = operator;
        if (typeof value !== "string") {
            throw new Error("Value must be a string for a string filter.");
        }
        this.value = value;
    }

    public matches(row: DatasetRow): boolean {
        const fieldValue = String(row[this.key]);

        switch (this.operator) {
            case "is":
                return fieldValue === this.value;
            case "is not":
                return fieldValue !== this.value;
            case "includes":
                return fieldValue.includes(this.value);
            case "does not include":
                return !fieldValue.includes(this.value);
            case "begins with":
                return fieldValue.startsWith(this.value);
            case "does not begin with":
                return !fieldValue.startsWith(this.value);
            case "ends with":
                return fieldValue.endsWith(this.value);
            case "does not end with":
                return !fieldValue.endsWith(this.value);
            default:
                throw new Error("Unsupported operator");
        }
    }
}
