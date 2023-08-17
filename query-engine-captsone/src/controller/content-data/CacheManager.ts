import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { InsightError } from "../InsightError";
import { InsightDatasetOperations } from "../IInsightExtra";
import { IDataStore } from "./IData";

export class CacheManager {
    private readonly cachePath: string = join(__dirname, "data.json");

    public saveToCache(dataStore: IDataStore) {
        this.writeFile(dataStore);
    }

    public loadFromCache(): IDataStore | null {
        const fileContent = this.readFile();

        if (fileContent) {
            const cachedData = JSON.parse(fileContent);
            return cachedData;
        }

        return null;
    }

    private writeFile(dataStore: IDataStore) {
        try {
            const data = JSON.stringify(dataStore);
            writeFileSync(this.cachePath, data);
        } catch (error) {
            throw new InsightError(InsightDatasetOperations.ADD, error.message);
        }
    }

    private readFile(): string | null {
        try {
            if (existsSync(this.cachePath)) {
                return readFileSync(this.cachePath, "utf8");
            } else {
                return null;
            }
        } catch (error) {
            throw new InsightError(InsightDatasetOperations.ADD, error.message);
        }
    }
}
