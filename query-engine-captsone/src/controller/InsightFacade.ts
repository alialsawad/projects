import { ParserFactory } from "./content-parsers/ParserFactory";
import {
    IInsightFacade,
    InsightDatasetKind,
    InsightResponse,
} from "./IInsightFacade";
import DataRepository from "./content-data/DataRepository";
import {
    ErrorResponseCodes,
    InsightDatasetOperations,
    SuccessResponseCodes,
} from "./IInsightExtra";
import { Validator } from "./InsightFacadeValidator";
import { QueryEngine } from "./query-engine/QueryEngine";

export default class InsightFacade implements IInsightFacade {
    private queryEngine: QueryEngine = QueryEngine.getInstance();

    public async addDataset(
        id: string,
        content: string,
        kind: InsightDatasetKind
    ): Promise<InsightResponse> {
        try {
            Validator.validate({
                operation: InsightDatasetOperations.ADD,
                id,
                content,
                kind,
            });

            const zipParser = ParserFactory.getZipParser();
            const fileContents = await zipParser.getFileContents(content, kind);

            Validator.validateFileContents(fileContents);

            const parser = ParserFactory.getDatasetParser(kind);
            const data = await parser.parseInput(id, fileContents);

            DataRepository.addDataset(data);

            return Promise.resolve({
                code: SuccessResponseCodes.ADD,
                body: { result: `Dataset ${id} added successfully` },
            });
        } catch (error) {
            return Promise.reject({
                code: error.code,
                body: { error: error.message },
            });
        }
    }

    public removeDataset(id: string): Promise<InsightResponse> {
        try {
            Validator.validate({
                operation: InsightDatasetOperations.REMOVE,
                id,
            });

            DataRepository.removeDataset(id);

            return Promise.resolve({
                code: SuccessResponseCodes.REMOVE,
                body: { result: `Dataset ${id} removed successfully` },
            });
        } catch (error) {
            return Promise.reject({
                code: error.code,
                body: { error: error.message },
            });
        }
    }

    public performQuery(query: string): Promise<InsightResponse> {
        try {
            const queryResult = this.queryEngine.execute(query);

            return Promise.resolve({
                code: SuccessResponseCodes.QUERY,
                body: { result: queryResult },
            });
        } catch (error) {
            return Promise.reject({
                code: ErrorResponseCodes.QUERY,
                body: { error: "Invalid dataset query." },
            });
        }
    }

    public listDatasets(): Promise<InsightResponse> {
        return Promise.resolve({
            code: SuccessResponseCodes.LIST,
            body: {
                result: DataRepository.getDatasetList(),
            },
        });
    }

    public cleanup() {
        DataRepository.reset();
    }
}
