import { DatasetRow } from "../../content-data/IData";
import { IFilter } from "./IFilter";

export class AndFilter implements IFilter {
    constructor(private leftFilter: IFilter, private rightFilter: IFilter) {}

    public matches(row: DatasetRow): boolean {
        return this.leftFilter.matches(row) && this.rightFilter.matches(row);
    }
}

export class OrFilter implements IFilter {
    constructor(private leftFilter: IFilter, private rightFilter: IFilter) {}

    public matches(row: DatasetRow): boolean {
        return this.leftFilter.matches(row) || this.rightFilter.matches(row);
    }
}
