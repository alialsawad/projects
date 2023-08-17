import { IDataStore } from "../content-data/IData";

export interface DatasetParser {
    parseInput(id: string, content: string[]): IDataStore | Promise<IDataStore>;
}
