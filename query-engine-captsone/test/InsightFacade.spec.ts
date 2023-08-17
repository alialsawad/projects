import { expect } from "chai";

import {
    InsightResponse,
    InsightDatasetKind,
    InsightResponseSuccessBody,
} from "../src/controller/IInsightFacade";
import {
    ErrorResponseCodes,
    InsightDatasetErrors,
    SuccessResponseCodes,
} from "../src/controller/IInsightExtra";
import InsightFacade from "../src/controller/InsightFacade";
import Log from "../src/Util";
import TestUtil from "./TestUtil";
import { join } from "path";

const joinCoursesPath = (filename: string) => {
    return join(__dirname, "data", "courses", filename);
};

const joinRoomsPath = (filename: string) => {
    return join(__dirname, "data", "rooms", filename);
};

// This should match the JSON schema described in test/query.schema.json
// except 'filename' which is injected when the file is read.
export interface ITestQuery {
    title: string;
    query: any; // make any to allow testing structurally invalid queries
    response: InsightResponse;
    filename: string; // This is injected when reading the file
}

describe("InsightFacade Add/Remove Dataset", function () {
    // Reference any datasets you've added to test/data here and they will
    // automatically be loaded in the Before All hook.
    const datasetsToLoad: { [id: string]: string } = {
        // COURSES
        courses: joinCoursesPath("courses.zip"),
        duplicateCoursesHeader: joinCoursesPath("duplicateCoursesHeader.zip"),
        missingCoursesHeader: joinCoursesPath("missingCoursesHeader.zip"),
        emptyCoursesCsv: joinCoursesPath("emptyCoursesCsv.zip"),
        noCoursesFolder: joinCoursesPath("noCoursesFolder.zip"),
        emptyCoursesFolder: joinCoursesPath("emptyCoursesFolder.zip"),
        listCoursesDataset: joinCoursesPath("listCoursesDataset.zip"),
        notAZipCourses: joinCoursesPath("notAZipCourses.txt"),
        notACsvCourses: joinCoursesPath("notACsvCourses.zip"),

        // ROOMS
        rooms: joinRoomsPath("rooms.zip"),
        emptyBuildingsFolder: joinRoomsPath("emptyBuildingsFolder.zip"),
        noBuildingsFolder: joinRoomsPath("noBuildingsFolder.zip"),
        noCampusFolder: joinRoomsPath("noCampusFolder.zip"),
        noDiscoverFolder: joinRoomsPath("noDiscoverFolder.zip"),
        notAZipRooms: joinRoomsPath("notAZipRooms.txt"),
        notAXmlRooms: joinRoomsPath("notAXmlRooms.zip"),
    };

    let insightFacade: InsightFacade;
    let datasets: { [id: string]: string };
    const coursesId = "courses";
    const roomsId = "rooms";

    before(async function () {
        Log.test(`Before: ${this.test.parent.title}`);

        try {
            const loadDatasetPromises: Array<Promise<Buffer>> = [];
            for (const [id, path] of Object.entries(datasetsToLoad)) {
                loadDatasetPromises.push(TestUtil.readFileAsync(path));
            }
            const loadedDatasets = (await Promise.all(loadDatasetPromises)).map(
                (buf, i) => {
                    return {
                        [Object.keys(datasetsToLoad)[i]]:
                            buf.toString("base64"),
                    };
                }
            );
            datasets = Object.assign({}, ...loadedDatasets);
            expect(Object.keys(datasets)).to.have.length.greaterThan(0);
        } catch (err) {
            expect.fail(
                "",
                "",
                `Failed to read one or more datasets. ${JSON.stringify(err)}`
            );
        }

        try {
            insightFacade = new InsightFacade();
        } catch (err) {
            Log.error(err);
        } finally {
            expect(insightFacade).to.be.instanceOf(InsightFacade);
        }
    });

    beforeEach(function () {
        Log.test(`BeforeTest: ${this.currentTest.title}`);
    });

    after(function () {
        Log.test(`After: ${this.test.parent.title}`);
    });

    afterEach(function () {
        Log.test(`AfterTest: ${this.currentTest.title}`);
        insightFacade.cleanup();
    });

    it("should not add a dataset with a wrong kind", async () => {
        const id = "courses";
        const expectedCode = ErrorResponseCodes.ADD;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(id, datasets[id], null);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.deep.equal({
                error: InsightDatasetErrors.INVALID_KIND,
            });
        }
    });

    it("should not add a dataset with duplicate CSV headers", async () => {
        const id = "ds1c";
        const datasetRef = datasets.duplicateCoursesHeader;
        const expectedCode = ErrorResponseCodes.ADD;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(
                id,
                datasetRef,
                InsightDatasetKind.Courses
            );
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.deep.equal({
                error: InsightDatasetErrors.INVALID_CSV_CONTENT,
            });
        }
    });

    it("should remove the rooms dataset, re-add and remove it again", async () => {
        const id = "rooms";
        const expectedCode = SuccessResponseCodes.REMOVE;
        let response: InsightResponse;

        try {
            await insightFacade.addDataset(
                id,
                datasets[id],
                InsightDatasetKind.Rooms
            );
            await insightFacade.removeDataset(id);
            await insightFacade.addDataset(
                id,
                datasets[id],
                InsightDatasetKind.Rooms
            );
            response = await insightFacade.removeDataset(id);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.deep.equal({
                result: `Dataset ${id} removed successfully`,
            });
        }
    });

    it("should not remove a dataset with an empty string as id", async () => {
        const expectedCode = ErrorResponseCodes.REMOVE;
        let response: InsightResponse;

        try {
            response = await insightFacade.removeDataset("");
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.deep.equal({
                error: InsightDatasetErrors.INVALID_ID,
            });
        }
    });

    it("should not add a dataset with an incorrect Dataset kind (courses instead of rooms)", async function () {
        const id = "rooms";
        const expectedCode = ErrorResponseCodes.ADD;
        const expectedError =
            "Folder structure is invalid No CSV files found in courses folder";
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(
                id,
                datasets[id],
                InsightDatasetKind.Courses
            );
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.deep.equal({
                error: expectedError,
            });
        }
    });

    it("should not add dataset with same id again", async function () {
        const id = "ds1c";
        const datasetRef = datasets.listCoursesDataset;
        let response: InsightResponse;

        try {
            await insightFacade.addDataset(
                id,
                datasetRef,
                InsightDatasetKind.Courses
            );

            response = await insightFacade.addDataset(
                id,
                datasetRef,
                InsightDatasetKind.Courses
            );
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(ErrorResponseCodes.ADD);
            expect(response.body).to.deep.equal({
                error: InsightDatasetErrors.DUPLICATE_DATASET,
            });
        }
    });

    it("should not add a dataset with an invalid Dataset name (Rooms)", async function () {
        const id = "find";
        const expectedCode = ErrorResponseCodes.ADD;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(
                id,
                datasets[roomsId],
                InsightDatasetKind.Rooms
            );
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.deep.equal({
                error: InsightDatasetErrors.INVALID_ID,
            });
        }
    });

    it("should remove the rooms dataset", async () => {
        const id = "rooms";
        const expectedCode = SuccessResponseCodes.REMOVE;
        let response: InsightResponse;

        try {
            await insightFacade.addDataset(
                id,
                datasets[id],
                InsightDatasetKind.Rooms
            );
            response = await insightFacade.removeDataset(id);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.deep.equal({
                result: `Dataset ${id} removed successfully`,
            });
        }
    });

    it("should add a valid dataset (Courses)", async () => {
        const id = "ds1c";
        const datasetRef = datasets.courses;
        const expectedCode = SuccessResponseCodes.ADD;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(
                id,
                datasetRef,
                InsightDatasetKind.Courses
            );
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.deep.equal({
                result: `Dataset ${id} added successfully`,
            });
        }
    });

    it("should add a valid dataset (Rooms)", async () => {
        const id = "rooms";
        const expectedCode = SuccessResponseCodes.ADD;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(
                id,
                datasets[id],
                InsightDatasetKind.Rooms
            );
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.deep.equal({
                result: `Dataset ${id} added successfully`,
            });
        }
    });

    it("should list all datasets", async () => {
        const id = "ds1c";
        const datasetRef = "listCoursesDataset";
        const expectedCode = SuccessResponseCodes.LIST;
        const expectedResult = {
            result: [{ id, kind: "courses", numRows: 2 }],
        };

        let response: InsightResponse;

        try {
            await insightFacade.addDataset(
                id,
                datasets[datasetRef],
                InsightDatasetKind.Courses
            );

            response = await insightFacade.listDatasets();
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.deep.equal(expectedResult);
        }
    });

    it("should list all datasets (multiple)", async () => {
        const datasetRef = datasets.listCoursesDataset;
        const datasetRef2 = datasets.rooms;
        const datasetKind = InsightDatasetKind.Courses;
        const datasetKind2 = InsightDatasetKind.Rooms;
        const numRows = 2;
        const numRows2 = 284;
        const id1 = "ds1c";
        const id2 = "ds2c";
        const id3 = "ds3c";
        const id4 = "ds4c";
        const id5 = "ds1r";
        const expectedCode = SuccessResponseCodes.LIST;
        const expectedResult = {
            result: [
                { id: id1, kind: datasetKind, numRows },
                { id: id2, kind: datasetKind, numRows },
                { id: id3, kind: datasetKind, numRows },
                { id: id4, kind: datasetKind, numRows },
                { id: id5, kind: datasetKind2, numRows: numRows2 },
            ],
        };
        let response: InsightResponse;

        try {
            await insightFacade.addDataset(id1, datasetRef, datasetKind);
            await insightFacade.addDataset(id2, datasetRef, datasetKind);
            await insightFacade.addDataset(id3, datasetRef, datasetKind);
            await insightFacade.addDataset(id4, datasetRef, datasetKind);
            await insightFacade.addDataset(id5, datasetRef2, datasetKind2);

            response = await insightFacade.listDatasets();
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.deep.equal(expectedResult);
        }
    });

    it("should not add a dataset with missing Id (null)", async function () {
        const expectedCode = ErrorResponseCodes.ADD;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(
                null,
                datasets[coursesId],
                InsightDatasetKind.Courses
            );
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.deep.equal({
                error: InsightDatasetErrors.INVALID_ID,
            });
        }
    });

    it("should not add a dataset with missing Id (undefined)", async function () {
        const expectedCode = ErrorResponseCodes.ADD;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(
                undefined,
                datasets[coursesId],
                InsightDatasetKind.Courses
            );
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.deep.equal({
                error: InsightDatasetErrors.INVALID_ID,
            });
        }
    });

    it("should not add a dataset with incorrect type Id)", async function () {
        const id: any = 123;
        const expectedCode = ErrorResponseCodes.ADD;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(
                id,
                datasets[coursesId],
                InsightDatasetKind.Courses
            );
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.deep.equal({
                error: InsightDatasetErrors.INVALID_ID,
            });
        }
    });

    it("should not add an invalid dataset (empty courses folder)", async function () {
        const datasetId = "emptyCoursesFolder";
        const expectedCode = ErrorResponseCodes.ADD;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(
                datasetId,
                datasets[datasetId],
                InsightDatasetKind.Courses
            );
        } catch (err) {
            response = err;
        } finally {
            if ("error" in response.body) {
                expect(response.code).to.equal(expectedCode);

                const isValidError = response.body.error.startsWith(
                    InsightDatasetErrors.INVALID_CONTENT
                );
                expect(isValidError).to.equal(true);
            } else {
                expect.fail("Should not have resolved");
            }
        }
    });

    it("should not add an invalid dataset (empty buildings folder)", async function () {
        const id = "rooms";
        const datasetId = "emptyBuildingsFolder";
        const expectedCode = ErrorResponseCodes.ADD;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(
                id,
                datasets[datasetId],
                InsightDatasetKind.Rooms
            );
        } catch (err) {
            response = err;
        } finally {
            if ("error" in response.body) {
                expect(response.code).to.equal(expectedCode);

                const isValidError = response.body.error.startsWith(
                    InsightDatasetErrors.INVALID_CONTENT
                );
                expect(isValidError).to.equal(true);
            } else {
                expect.fail("Should not have resolved");
            }
        }
    });

    it('should not add an invalid dataset (not a zip file "Courses")', async function () {
        const datasetId = "notAZipCourses";
        const expectedCode = ErrorResponseCodes.ADD;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(
                datasetId,
                datasets[datasetId],
                InsightDatasetKind.Courses
            );
        } catch (err) {
            response = err;
        } finally {
            if ("error" in response.body) {
                expect(response.code).to.equal(expectedCode);

                const isValidError = response.body.error.startsWith(
                    InsightDatasetErrors.INVALID_CONTENT
                );
                expect(isValidError).to.equal(true);
            } else {
                expect.fail("Should not have resolved");
            }
        }
    });

    it('should not add an invalid dataset (not a csv file "Courses")', async function () {
        const datasetId = "notACsvCourses";
        const expectedCode = ErrorResponseCodes.ADD;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(
                datasetId,
                datasets[datasetId],
                InsightDatasetKind.Courses
            );
        } catch (err) {
            response = err;
        } finally {
            if ("error" in response.body) {
                expect(response.code).to.equal(expectedCode);

                const isValidError = response.body.error.startsWith(
                    InsightDatasetErrors.INVALID_CONTENT
                );
                expect(isValidError).to.equal(true);
            } else {
                expect.fail("Should not have resolved");
            }
        }
    });

    it('should not add an invalid dataset (not a zip file "Rooms")', async function () {
        const id = "rooms";
        const datasetId = "notAZipRooms";
        const expectedCode = ErrorResponseCodes.ADD;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(
                id,
                datasets[datasetId],
                InsightDatasetKind.Rooms
            );
        } catch (err) {
            response = err;
        } finally {
            if ("error" in response.body) {
                expect(response.code).to.equal(expectedCode);

                const isValidError = response.body.error.startsWith(
                    InsightDatasetErrors.INVALID_CONTENT
                );
                expect(isValidError).to.equal(true);
            } else {
                expect.fail("Should not have resolved");
            }
        }
    });

    it('should not add an invalid dataset (not a xml file "Rooms")', async function () {
        const id = "rooms";
        const datasetId = "notAXmlRooms";
        const expectedCode = ErrorResponseCodes.ADD;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(
                id,
                datasets[datasetId],
                InsightDatasetKind.Rooms
            );
        } catch (err) {
            response = err;
        } finally {
            if ("error" in response.body) {
                expect(response.code).to.equal(expectedCode);

                const isValidError = response.body.error.startsWith(
                    InsightDatasetErrors.INVALID_CONTENT
                );
                expect(isValidError).to.equal(true);
            } else {
                expect.fail("Should not have resolved");
            }
        }
    });

    it("should not add dataset without courses directory", async function () {
        const datasetId = "noCoursesFolder";
        const expectedCode = ErrorResponseCodes.ADD;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(
                datasetId,
                datasets[datasetId],
                InsightDatasetKind.Courses
            );
        } catch (err) {
            response = err;
        } finally {
            if ("error" in response.body) {
                expect(response.code).to.equal(expectedCode);

                const isValidError = response.body.error.startsWith(
                    InsightDatasetErrors.INVALID_CONTENT
                );
                expect(isValidError).to.equal(true);
            } else {
                expect.fail("Should not have resolved");
            }
        }
    });

    it("should not add dataset without campus directory", async function () {
        const id = "rooms";
        const datasetId = "noCampusFolder";
        const expectedCode = ErrorResponseCodes.ADD;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(
                id,
                datasets[datasetId],
                InsightDatasetKind.Rooms
            );
        } catch (err) {
            response = err;
        } finally {
            if ("error" in response.body) {
                expect(response.code).to.equal(expectedCode);

                const isValidError = response.body.error.startsWith(
                    InsightDatasetErrors.INVALID_CONTENT
                );
                expect(isValidError).to.equal(true);
            } else {
                expect.fail("Should not have resolved");
            }
        }
    });

    it("should not add dataset without discover directory", async function () {
        const id = "rooms";
        const datasetId = "noDiscoverFolder";
        const expectedCode = ErrorResponseCodes.ADD;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(
                id,
                datasets[datasetId],
                InsightDatasetKind.Rooms
            );
        } catch (err) {
            response = err;
        } finally {
            if ("error" in response.body) {
                expect(response.code).to.equal(expectedCode);

                const isValidError = response.body.error.startsWith(
                    InsightDatasetErrors.INVALID_CONTENT
                );
                expect(isValidError).to.equal(true);
            } else {
                expect.fail("Should not have resolved");
            }
        }
    });

    it("should not add dataset without buildings directory", async function () {
        const id = "rooms";
        const datasetId = "noBuildingsFolder";
        const expectedCode = ErrorResponseCodes.ADD;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(
                id,
                datasets[datasetId],
                InsightDatasetKind.Rooms
            );
        } catch (err) {
            response = err;
        } finally {
            if ("error" in response.body) {
                expect(response.code).to.equal(expectedCode);

                const isValidError = response.body.error.startsWith(
                    InsightDatasetErrors.INVALID_CONTENT
                );
                expect(isValidError).to.equal(true);
            } else {
                expect.fail("Should not have resolved");
            }
        }
    });

    it("should not add a dataset with empty content (Courses)", async function () {
        const datasetId = "emptyCoursesCsv";
        const expectedCode = ErrorResponseCodes.ADD;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(
                datasetId,
                datasets[datasetId],
                InsightDatasetKind.Courses
            );
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.deep.equal({
                error: InsightDatasetErrors.EMPTY_DATASET,
            });
        }
    });

    it("should not add a dataset with an invalid Dataset name (Courses)", async function () {
        const id = "invalid_DatasetName";
        const expectedCode = ErrorResponseCodes.ADD;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(
                id,
                datasets[coursesId],
                InsightDatasetKind.Courses
            );
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.deep.equal({
                error: InsightDatasetErrors.INVALID_ID,
            });
        }
    });

    it("should not add a dataset with an incorrect Dataset kind (rooms instead of courses)", async function () {
        const id = "ds1c";
        const expectedCode = ErrorResponseCodes.ADD;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(
                id,
                datasets[coursesId],
                InsightDatasetKind.Rooms
            );
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.deep.equal({
                error: "Folder structure is invalid No valid building paths found",
            });
        }
    });

    it("should not add a dataset with an incorrect Dataset kind (null)", async function () {
        const id = "rooms";
        const expectedCode = ErrorResponseCodes.ADD;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(id, datasets[id], null);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.deep.equal({
                error: InsightDatasetErrors.INVALID_KIND,
            });
        }
    });

    it("should not add a dataset with an incorrect Dataset kind (undefined)", async function () {
        const id = "rooms";
        const expectedCode = ErrorResponseCodes.ADD;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(
                id,
                datasets[id],
                undefined
            );
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.deep.equal({
                error: InsightDatasetErrors.INVALID_KIND,
            });
        }
    });

    it("should remove the ds1c dataset", async () => {
        const id = "ds1c";
        const expectedCode = SuccessResponseCodes.REMOVE;
        let response: InsightResponse;

        try {
            await insightFacade.addDataset(
                id,
                datasets[coursesId],
                InsightDatasetKind.Courses
            );
            response = await insightFacade.removeDataset(id);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.deep.equal({
                result: `Dataset ${id} removed successfully`,
            });
        }
    });

    it("should remove the ds1c dataset, re-add and remove it again", async () => {
        const id = "ds1c";
        const expectedCode = SuccessResponseCodes.REMOVE;
        let response: InsightResponse;

        try {
            await insightFacade.addDataset(
                id,
                datasets[coursesId],
                InsightDatasetKind.Courses
            );
            await insightFacade.removeDataset(id);
            await insightFacade.addDataset(
                id,
                datasets[coursesId],
                InsightDatasetKind.Courses
            );
            response = await insightFacade.removeDataset(id);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.deep.equal({
                result: `Dataset ${id} removed successfully`,
            });
        }
    });

    it("should return an empty dataset", async () => {
        const expectedCode = SuccessResponseCodes.LIST;
        let response: InsightResponse;

        try {
            response = await insightFacade.listDatasets();
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.deep.equal({ result: [] });
        }
    });

    it("should not remove a dataset that does not exist", async () => {
        const id = "courses";
        const expectedCode = ErrorResponseCodes.REMOVE;
        let response: InsightResponse;

        try {
            response = await insightFacade.removeDataset(id);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.deep.equal({
                error: InsightDatasetErrors.DATASET_NOT_FOUND,
            });
        }
    });

    it("should not remove a dataset with a null id", async () => {
        const expectedCode = ErrorResponseCodes.REMOVE;
        let response: InsightResponse;

        try {
            response = await insightFacade.removeDataset(null);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.deep.equal({
                error: InsightDatasetErrors.INVALID_ID,
            });
        }
    });

    it("should not remove a dataset with an undefined id", async () => {
        const expectedCode = ErrorResponseCodes.REMOVE;
        let response: InsightResponse;

        try {
            response = await insightFacade.removeDataset(undefined);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.deep.equal({
                error: InsightDatasetErrors.INVALID_ID,
            });
        }
    });

    it("should not add a dataset with an incorrect Id type", async () => {
        const id: any = 123;
        const datasetId = "courses";
        const expectedCode = ErrorResponseCodes.ADD;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(
                id,
                datasets[datasetId],
                InsightDatasetKind.Courses
            );
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.deep.equal({
                error: InsightDatasetErrors.INVALID_ID,
            });
        }
    });
});

// This test suite dynamically generates tests from the JSON files in test/queries.
// You should not need to modify it; instead, add additional files to the queries directory.
describe("InsightFacade PerformQuery", () => {
    const datasetsToQuery: { [id: string]: string } = {
        ds1c: joinCoursesPath("courses.zip"),
        ds1r: joinRoomsPath("rooms.zip"),
    };
    let insightFacade: InsightFacade;
    let testQueries: ITestQuery[] = [];

    // Create a new instance of InsightFacade, read in the test queries from test/queries and
    // add the datasets specified in datasetsToQuery.
    before(async function () {
        Log.test(`Before: ${this.test.parent.title}`);

        // Load the query JSON files under test/queries.
        // Fail if there is a problem reading ANY query.
        try {
            testQueries = await TestUtil.readTestQueries();
            expect(testQueries).to.have.length.greaterThan(0);
        } catch (err) {
            expect.fail(
                "",
                "",
                `Failed to read one or more test queries. ${JSON.stringify(
                    err
                )}`
            );
        }

        try {
            insightFacade = new InsightFacade();
        } catch (err) {
            Log.error(err);
        } finally {
            expect(insightFacade).to.be.instanceOf(InsightFacade);
        }

        // Load the datasets specified in datasetsToQuery and add them to InsightFacade.
        // Fail if there is a problem reading ANY dataset.
        try {
            const loadDatasetPromises: Array<Promise<Buffer>> = [];
            for (const [id, path] of Object.entries(datasetsToQuery)) {
                loadDatasetPromises.push(TestUtil.readFileAsync(path));
            }
            const loadedDatasets = (await Promise.all(loadDatasetPromises)).map(
                (buf, i) => {
                    return {
                        [Object.keys(datasetsToQuery)[i]]:
                            buf.toString("base64"),
                    };
                }
            );
            expect(loadedDatasets).to.have.length.greaterThan(0);

            const responsePromises: Array<Promise<InsightResponse>> = [];
            const datasets: { [id: string]: string } = Object.assign(
                {},
                ...loadedDatasets
            );
            for (const [id, content] of Object.entries(datasets)) {
                if (id === "ds1c") {
                    responsePromises.push(
                        insightFacade.addDataset(
                            id,
                            content,
                            InsightDatasetKind.Courses
                        )
                    );
                } else if (id === "ds1r") {
                    responsePromises.push(
                        insightFacade.addDataset(
                            id,
                            content,
                            InsightDatasetKind.Rooms
                        )
                    );
                }
            }

            // This try/catch is a hack to let your dynamic tests execute enough the addDataset method fails.
            // In D1, you should remove this try/catch to ensure your datasets load successfully before trying
            // to run you queries.
            try {
                const responses: InsightResponse[] = await Promise.all(
                    responsePromises
                );
                responses.forEach((response) =>
                    expect(response.code).to.equal(204)
                );
            } catch (err) {
                Log.warn(
                    `Ignoring addDataset errors. For D1, you should allow errors to fail the Before All hook.`
                );
            }
        } catch (err) {
            expect.fail(
                "",
                "",
                `Failed to read one or more datasets. ${JSON.stringify(err)}`
            );
        }
    });

    beforeEach(function () {
        Log.test(`BeforeTest: ${this.currentTest.title}`);
    });

    after(function () {
        Log.test(`After: ${this.test.parent.title}`);
    });

    afterEach(function () {
        Log.test(`AfterTest: ${this.currentTest.title}`);
    });

    // Dynamically create and run a test for each query in testQueries
    it("should run test queries", () => {
        describe("Dynamic InsightFacade PerformQuery tests", () => {
            for (const test of testQueries) {
                it(`[${test.filename}] ${test.title}`, async () => {
                    let response: InsightResponse;

                    try {
                        response = await insightFacade.performQuery(test.query);
                    } catch (err) {
                        response = err;
                    } finally {
                        expect(response.code).to.equal(test.response.code);

                        if (test.response.code >= 400) {
                            expect(response.body).to.have.property("error");
                        } else {
                            expect(response.body).to.have.property("result");
                            const expectedResult = (
                                test.response.body as InsightResponseSuccessBody
                            ).result;
                            const actualResult = (
                                response.body as InsightResponseSuccessBody
                            ).result;
                            expect(actualResult).to.deep.equal(expectedResult);
                        }
                    }
                });
            }
        });
    });
});
