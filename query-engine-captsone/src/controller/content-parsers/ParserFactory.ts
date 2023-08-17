import { InsightDatasetKind } from "../IInsightFacade";
import { CoursesParser } from "./CoursesParser";
import { DatasetParser } from "./IParsers";
import { JSZipParser } from "./JSZipParser";
import { RoomsParser } from "./RoomsParser";

export class ParserFactory {
    public static getDatasetParser(kind: InsightDatasetKind): DatasetParser {
        switch (kind) {
            case InsightDatasetKind.Courses:
                return new CoursesParser() as DatasetParser;
            case InsightDatasetKind.Rooms:
                return new RoomsParser() as DatasetParser;
            default:
                throw new Error("Unsupported dataset kind");
        }
    }

    public static getZipParser(): JSZipParser {
        return new JSZipParser();
    }
}
