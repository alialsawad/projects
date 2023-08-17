import { CacheManager } from "./CacheManager";
import { DataKeys, IDataStore } from "./IData";

const cacheManager = new CacheManager();

const initialState: IDataStore = {};

enum ActionType {
    ADD_DATASET = "ADD_DATASET",
    REMOVE_DATASET = "REMOVE_DATASET",
    RESET = "RESET",
}

type Action =
    | { type: ActionType.ADD_DATASET; data: IDataStore }
    | { type: ActionType.REMOVE_DATASET; id: string }
    | { type: ActionType.RESET };

function reducer(currentState = initialState, action: Action) {
    switch (action.type) {
        case ActionType.ADD_DATASET:
            return {
                ...currentState,
                ...action.data,
            };
        case ActionType.REMOVE_DATASET:
            delete currentState[action.id];
            return {
                ...currentState,
            };
        case ActionType.RESET:
            return {};
        default:
            return currentState;
    }
}

let state = { ...initialState };
state = cacheManager.loadFromCache() || state;

function dispatch(action: Action) {
    state = reducer(state, action);
    cacheManager.saveToCache(state);
}

const DataRepository = {
    addDataset(data: IDataStore) {
        dispatch({ type: ActionType.ADD_DATASET, data });
    },
    removeDataset(id: string) {
        dispatch({ type: ActionType.REMOVE_DATASET, id });
    },
    getDatastore(): IDataStore {
        return state;
    },
    getDataset(id: string) {
        if (!state[id] || !state[id][DataKeys.DATASETS]) {
            return [];
        }
        return state[id][DataKeys.DATASETS];
    },
    getDatasetList() {
        return Object.values(state).map(
            (dataset) => dataset[DataKeys.DATASET_LIST]
        );
    },
    reset() {
        dispatch({ type: ActionType.RESET });
    },

    hasDataset(id: string) {
        return id in state;
    },
};

export default DataRepository;
