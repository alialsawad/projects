import { InsightDatasetKind } from "../IInsightFacade";
import { Validator } from "../InsightFacadeValidator";
import { DataKeys, DatasetRow } from "../content-data/IData";
import { DatasetParser } from "./IParsers";

export class CoursesParser implements DatasetParser {
    private headerMapping: { [key: string]: string } = {
        Title: "title",
        id: "uuid",
        Professor: "instructor",
        Audit: "audit",
        Year: "year",
        Course: "id",
        Pass: "pass",
        Fail: "fail",
        Avg: "avg",
        Subject: "dept",
        Section: "section",
    };

    public parseInput(
        id: string,
        content: string[]
    ): ReturnType<DatasetParser["parseInput"]> {
        const lines: string[] = content
            .map((block) => {
                let blockLines = block.split("\r\n");
                Validator.validateHeaders(blockLines[0], this.headerMapping);
                return blockLines.slice(1).filter((line) => line.trim() !== "");
            })
            .reduce((acc, val) => acc.concat(val), []);

        const datasetRows = this.processLines(id, lines);

        Validator.validateDataset(datasetRows);
        return {
            [id]: {
                [DataKeys.DATASETS]: datasetRows,
                [DataKeys.DATASET_LIST]: {
                    id,
                    kind: InsightDatasetKind.Courses,
                    numRows: datasetRows.length,
                },
            },
        };
    }

    private processLines(id: string, lines: string[]): DatasetRow[] {
        return lines.map((line) => {
            const values = line.split("|").map((v) => v.trim());
            const headers = Object.keys(this.headerMapping);

            return values.reduce<DatasetRow>((row, value, index) => {
                const headerKey = headers[index];
                const header = `${id}_${this.headerMapping[headerKey]}`;

                if (
                    ["Avg", "Pass", "Fail", "Audit", "Year"].includes(headerKey)
                ) {
                    if (!row[header]) {
                        row[header] = Number(value);
                    }
                } else {
                    row[header] = String(value);
                }

                if (row[`${id}_section`] === "overall") {
                    row[`${id}_year`] = 1900;
                }

                return row;
            }, {});
        });
    }
}
