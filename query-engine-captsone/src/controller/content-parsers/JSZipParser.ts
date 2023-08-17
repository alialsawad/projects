import * as JSZip from "jszip";
import * as parse5 from "parse5";
import { InsightDatasetKind } from "../IInsightFacade";
import {
    InsightDatasetErrors,
    InsightDatasetOperations,
} from "../IInsightExtra";
import { InsightError } from "../InsightError";

export class JSZipParser {
    private zip: JSZip = new JSZip();

    public async getFileContents(
        content: string,
        kind: InsightDatasetKind
    ): Promise<string[]> {
        try {
            const zip = await this.zip.loadAsync(content, {
                base64: true,
            });

            if (kind === "rooms") {
                const campusFolder = zip.folder("campus");
                if (!campusFolder) {
                    throw new Error("No campus folder found");
                }

                const validBuildingPaths = await this.parseIndex(zip);
                if (!validBuildingPaths.length) {
                    throw new Error("No valid building paths found");
                }

                const promises = validBuildingPaths.map((path, index) => {
                    const adjustedPath = path.startsWith("./")
                        ? path.slice(2)
                        : path;
                    return zip
                        .file(adjustedPath)
                        .async("text")
                        .then((ct) => ({ index, content: ct }));
                });

                const unorderedResults = await Promise.all(promises);
                return unorderedResults
                    .sort((a, b) => a.index - b.index)
                    .map((item) => item.content);
            } else if (kind === "courses") {
                const coursesFolder = zip.folder("courses");
                if (!coursesFolder) {
                    throw new Error("No courses folder found");
                }

                const promises: Array<
                    Promise<{ index: number; content: string }>
                > = [];
                let fileCount = 0;
                zip.forEach((relativePath, file) => {
                    if (
                        !file.dir &&
                        relativePath.endsWith(".csv") &&
                        relativePath.startsWith(`${kind}/`)
                    ) {
                        const index = fileCount++;
                        promises.push(
                            file
                                .async("text")
                                .then((ct) => ({ index, content: ct }))
                        );
                    }
                });

                if (fileCount === 0) {
                    throw new Error("No CSV files found in courses folder");
                }

                const unorderedResults = await Promise.all(promises);
                return unorderedResults
                    .sort((a, b) => a.index - b.index)
                    .map((item) => item.content);
            } else {
                throw new Error("Invalid kind");
            }
        } catch (error) {
            throw new InsightError(
                InsightDatasetOperations.ADD,
                InsightDatasetErrors.INVALID_CONTENT,
                error.message
            );
        }
    }

    private async parseIndex(zip: JSZip): Promise<string[]> {
        const indexFile = zip.file("index.xml");
        const content = await indexFile?.async("text");
        const document = parse5.parseFragment(content || "");
        const validBuildingPaths: string[] = [];

        const traverse = (node: any) => {
            if (
                node.nodeName === "building" &&
                node.attrs &&
                node.attrs.length
            ) {
                const pathAttribute = node.attrs.find(
                    (attr: any) => attr.name === "path"
                );
                if (pathAttribute) {
                    validBuildingPaths.push(pathAttribute.value);
                }
            }
            if (node.childNodes && node.childNodes.length) {
                node.childNodes.forEach(traverse);
            }
        };

        traverse(document);

        return validBuildingPaths;
    }
}
