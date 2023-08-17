import { InsightDataset } from "../IInsightFacade";

export enum DataKeys {
    DATASETS = "DATASETS",
    DATASET_LIST = "DATASET_LIST",
}

export type DatasetRow = Record<string, string | number>;

interface DataStoreEntry {
    [DataKeys.DATASETS]: DatasetRow[];
    [DataKeys.DATASET_LIST]: InsightDataset;
}

export interface IDataStore {
    [key: string]: DataStoreEntry;
}
