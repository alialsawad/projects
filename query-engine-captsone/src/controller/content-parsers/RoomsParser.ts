import * as parse5 from "parse5";
import * as http from "http";
import { InsightDatasetKind } from "../IInsightFacade";
import { DataKeys, DatasetRow, IDataStore } from "../content-data/IData";
import { DatasetParser } from "./IParsers";
import { Validator } from "../InsightFacadeValidator";

interface GeoResponse {
    lat?: number;
    lon?: number;
    error?: string;
}

export class RoomsParser implements DatasetParser {
    public async parseInput(
        id: string,
        content: string[]
    ): Promise<IDataStore> {
        const promisePool = new PromisePool<DatasetRow[]>(10);
        const datasetRows = (
            await promisePool.all(
                content.map((xmlString) =>
                    this.processBuildingXml(id, xmlString)
                )
            )
        ).reduce((acc, curr) => acc.concat(curr), []);

        Validator.validateDataset(datasetRows);
        return {
            [id]: {
                [DataKeys.DATASETS]: datasetRows,
                [DataKeys.DATASET_LIST]: {
                    id,
                    kind: InsightDatasetKind.Rooms,
                    numRows: datasetRows.length,
                },
            },
        };
    }

    private async processBuildingXml(
        id: string,
        xmlString: string
    ): Promise<DatasetRow[]> {
        const document = parse5.parseFragment(xmlString);
        const buildingNodes = this.findNodesByName(document, "building");
        const datasetRows: DatasetRow[] = [];

        for (const buildingNode of buildingNodes) {
            const buildingId = this.getAttributeValue(buildingNode, "id");
            const buildingAddress = this.getAttributeValue(
                buildingNode,
                "address"
            );
            const buildingName = this.getAttributeValue(buildingNode, "name");

            try {
                const { lat, lon } = await this.getGeoLocation(buildingAddress);

                const roomNodes = this.findNodesByName(buildingNode, "room");

                for (const roomNode of roomNodes) {
                    const roomInfo = this.extractRoomInfo(
                        id,
                        roomNode,
                        buildingId
                    );
                    datasetRows.push({
                        [`${id}_lat`]: lat,
                        [`${id}_lon`]: lon,
                        [`${id}_fullname`]: buildingName,
                        [`${id}_shortname`]: buildingId,
                        ...roomInfo,
                        [`${id}_address`]: buildingAddress,
                    });
                }
            } catch (e) {
                throw new Error(
                    `Failed to get geolocation for address: ${buildingAddress}. Error: ${e}`
                );
            }
        }

        return datasetRows;
    }

    private findNodesByName(node: any, name: string): any[] {
        const nodes: any[] = [];
        if (node.tagName === name) {
            nodes.push(node);
        }
        if (node.childNodes) {
            for (let child of node.childNodes) {
                nodes.push(...this.findNodesByName(child, name));
            }
        }
        return nodes;
    }

    private getAttributeValue(node: any, attributeName: string): string {
        const attr = node.attrs.find((a: any) => a.name === attributeName);
        return attr ? attr.value : "";
    }

    private extractRoomInfo(id: string, roomNode: any, buildingId: string) {
        const roomNumber = this.getAttributeValue(roomNode, "number");
        const webNode = this.findNodesByName(roomNode, "web")[0];
        const spaceNode = this.findNodesByName(roomNode, "space")[0];

        const href = webNode ? this.getAttributeValue(webNode, "link") : "";
        const seats = spaceNode
            ? parseInt(this.getAttributeValue(spaceNode, "seats"), 10)
            : 0;
        const furniture = spaceNode
            ? this.getAttributeValue(spaceNode, "furniture")
            : "";
        const type = spaceNode ? this.getAttributeValue(spaceNode, "type") : "";

        return {
            [`${id}_number`]: roomNumber,
            [`${id}_name`]: `${buildingId}_${roomNumber}`,
            [`${id}_seats`]: seats,
            [`${id}_type`]: type,
            [`${id}_furniture`]: furniture,
            [`${id}_href`]: href,
        };
    }

    private getGeoLocation(address: string): Promise<GeoResponse> {
        return new Promise((resolve, reject) => {
            const encodedAddress = encodeURIComponent(address);
            const url = `http://sdmm.cs.ubc.ca:11316/api/v1/team0/${encodedAddress}`;

            http.get(url, (res) => {
                let data = "";

                res.on("data", (chunk) => {
                    data += chunk;
                });

                res.on("end", () => {
                    try {
                        const json = JSON.parse(data);
                        if (json.error) {
                            reject(json.error);
                        } else {
                            resolve(json);
                        }
                    } catch (e) {
                        reject(e.message);
                    }
                });
            }).on("error", (err) => {
                reject(err.message);
            });
        });
    }
}

class PromisePool<T> {
    constructor(private readonly limit: number) {}

    public async all(promises: Array<Promise<T>>): Promise<T[]> {
        const results: T[] = [];
        let i = 0;

        const executePromise = async () => {
            if (i >= promises.length) {
                return;
            }
            const promise = promises[i++];
            results.push(await promise);
            await executePromise();
        };

        const pool = new Array(this.limit).fill(executePromise());
        await Promise.all(pool);

        return results;
    }
}
