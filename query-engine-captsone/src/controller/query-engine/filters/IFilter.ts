import { DatasetRow } from "../../content-data/IData";

export interface FilterCriteria {
    key: string;
    operator: string;
    value: string | number;
    logicalConnector?: "and" | "or";
}

export interface IFilter {
    matches(row: DatasetRow): boolean;
}
