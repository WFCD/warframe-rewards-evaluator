// Actions
import { SHOW_SETTINGS_WINDOW } from './actions/showSettingsWindow';
import { HIDE_SETTINGS_WINDOW } from './actions/hideSettingsWindow';
import { SHOW_STATS_WINDOW } from './actions/showStatsWindow';
import { HIDE_STATS_WINDOW } from './actions/hideStatsWindow';
import { ITEMS } from './actions/items';
import { ITEMS_DETAILS } from './actions/itemDetails';
import { TESSERACT_PROGRESS } from './actions/tesseractProgess';
import { GET_ITEM_STATS_STARTED } from './actions/getItemStatsStarted';
import { GET_ITEM_STATS_FINISHED } from './actions/getItemStatsFinished';
import { GET_DATA_STARTED } from './actions/getDataStarted';
import { GET_DATA_FINISHED } from './actions/getDataFinished';

// Models
import { IState } from './models/state';

function getInitialState(): IState {
    return {
        items: [],
        itemNames: [],
        itemDetails: [],
        isSettingsWindowVisible: false,
        isStatsWindowVisible: false,
        tesseractProgess: 0,
        isApiWorking: false,
        isGettingData: true
    };
}

export function reducer(state: IState, action: any): IState {
    if (typeof state === 'undefined') {
        return getInitialState();
    }

    // console.log("REDUCER: Received '" + action.type + "'.", action);

    switch (action.type) {

        case SHOW_SETTINGS_WINDOW:
            return {
                ...state,
                isSettingsWindowVisible: true
            };

        case HIDE_SETTINGS_WINDOW:
            return {
                ...state,
                isSettingsWindowVisible: true
            };

        case SHOW_STATS_WINDOW:
            return {
                ...state,
                isStatsWindowVisible: true
            };

        case HIDE_STATS_WINDOW:
            return {
                ...state,
                isStatsWindowVisible: false
            };

        case ITEMS:
            return {
                ...state,
                items: action.items,
                itemNames: action.itemNames
            };

        case ITEMS_DETAILS:
            return {
                ...state,
                itemDetails: action.itemDetails
            };

        case TESSERACT_PROGRESS:
            return {
                ...state,
                tesseractProgess: action.progress
            };

        case GET_ITEM_STATS_STARTED:
            return {
                ...state,
                isApiWorking: true
            };

        case GET_ITEM_STATS_FINISHED:
            return {
                ...state,
                isApiWorking: false
            };

        case GET_DATA_STARTED:
            return {
                ...state,
                isGettingData: true
            };

        case GET_DATA_FINISHED:
            return {
                ...state,
                isGettingData: false,
                tesseractProgess: 0,
                isApiWorking: false,
            };

        default:
            return state;
    }
}
