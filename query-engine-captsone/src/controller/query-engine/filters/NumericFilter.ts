import { DatasetRow } from "../../content-data/IData";
import { FilterCriteria } from "./IFilter";

export class NumericFilter {
    private key: string;
    private operator: string;
    private value: number;
    private not: boolean;

    constructor({ key, operator, value }: FilterCriteria) {
        this.key = key;
        this.operator = operator.replace(/^is (not )?/, "");
        if (typeof value !== "number") {
            this.value = parseFloat(value);
        } else {
            this.value = value;
        }
        this.not = operator.includes("not");
    }

    public matches(row: DatasetRow): boolean {
        const fieldValue = +row[this.key];

        switch (this.operator) {
            case "greater than":
                return this.not
                    ? !(fieldValue > this.value)
                    : fieldValue > this.value;
            case "less than":
                return this.not
                    ? !(fieldValue < this.value)
                    : fieldValue < this.value;
            case "equal to":
                return this.not
                    ? fieldValue !== this.value
                    : fieldValue === this.value;
            default:
                throw new Error("Unsupported operator");
        }
    }
}
