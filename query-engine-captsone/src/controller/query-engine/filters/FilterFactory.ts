import { AndFilter, OrFilter } from "./ConditionalFilters";
import { FilterCriteria, IFilter } from "./IFilter";
import { NumericFilter } from "./NumericFilter";
import { StringFilter } from "./StringFilter";

interface IFilterFactory {
    createFilter(filterCriteria: FilterCriteria[]): IFilter;
}
export class FilterFactory implements IFilterFactory {
    public createFilter(filterCriteria: FilterCriteria[]): IFilter {
        if (filterCriteria.length === 0) {
            return;
        }

        let currentFilter: IFilter = this.createSingleFilter(filterCriteria[0]);

        for (let i = 1; i < filterCriteria.length; i++) {
            const nextFilter = this.createSingleFilter(filterCriteria[i]);
            const logicalConnector = filterCriteria[i - 1].logicalConnector;

            if (!logicalConnector) {
                throw new Error(
                    "Missing logical connector for combining filters."
                );
            }

            switch (logicalConnector) {
                case "and":
                    currentFilter = new AndFilter(currentFilter, nextFilter);
                    break;
                case "or":
                    currentFilter = new OrFilter(currentFilter, nextFilter);
                    break;
                default:
                    throw new Error(
                        "Unknown logical connector: " + logicalConnector
                    );
            }
        }

        return currentFilter;
    }

    private createSingleFilter({
        key,
        operator,
        value,
    }: FilterCriteria): NumericFilter | StringFilter {
        if (!key || !operator || value === null || value === undefined) {
            throw new Error(
                "FilterCriteria must contain key, operator, and value."
            );
        }

        const column = key.split("_")[1];

        switch (column) {
            // Numeric Filters
            case "avg":
            case "pass":
            case "fail":
            case "audit":
            case "year":
            case "seats":
            case "lat":
            case "lon":
                return new NumericFilter({
                    key,
                    operator,
                    value,
                });

            // String Filters
            case "dept":
            case "id":
            case "instructor":
            case "title":
            case "uuid":
            case "fullname":
            case "shortname":
            case "number":
            case "name":
            case "address":
            case "type":
            case "furniture":
            case "href":
                return new StringFilter({
                    key,
                    operator,
                    value,
                });

            // Unknown key
            default:
                throw new Error("Unknown key: " + key);
        }
    }
}
