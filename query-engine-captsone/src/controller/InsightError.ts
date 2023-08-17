import { ErrorResponseCodes, InsightDatasetErrors } from "./IInsightExtra";

export class InsightError extends Error {
    public readonly code: ErrorResponseCodes;

    constructor(
        operation: keyof typeof ErrorResponseCodes,
        message: InsightDatasetErrors,
        additionalMessage?: string
    ) {
        super(additionalMessage ? `${message} ${additionalMessage}` : message);
        this.name = "InsightError";
        this.code = ErrorResponseCodes[operation];
    }
}
