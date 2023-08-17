export type InsightResponseSuccessCode = 200 | 204;

export enum InsightDatasetErrors {
    INVALID_ID = "Dataset Id is invalid",
    INVALID_KIND = "Dataset kind is invalid",
    DUPLICATE_DATASET = "Dataset already exists",
    EMPTY_DATASET = "Dataset content is empty",
    UNABLE_TO_READ_DATA = "Unable to read dataset",
    UNABLE_TO_WRITE_DATA = "Unable to write dataset",
    DATASET_NOT_FOUND = "Dataset not found",
    INVALID_CONTENT = "Folder structure is invalid",
    INVALID_CSV_CONTENT = "Csv content is invalid",
    INVALID_XML_CONTENT = "XML content is invalid",
}

export enum SuccessResponseCodes {
    ADD = 204,
    REMOVE = 200,
    LIST = 200,
    QUERY = 200,
}

export enum ErrorResponseCodes {
    ADD = 400,
    REMOVE = 404,
    LIST = 400,
    QUERY = 400,
}

export enum InsightDatasetOperations {
    ADD = "ADD",
    REMOVE = "REMOVE",
    LIST = "LIST",
    QUERY = "QUERY",
}
