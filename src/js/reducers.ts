// Actions
import { SHOW_SETTINGS_WINDOW } from "./actions/showSettingsWindow";
import { HIDE_SETTINGS_WINDOW } from "./actions/hideSettingsWindow";
import { SHOW_STATS_WINDOW } from "./actions/showStatsWindow";
import { HIDE_STATS_WINDOW } from "./actions/hideStatsWindow";
import { ITEMS } from "./actions/items";
import { ITEMS_DETAILS } from "./actions/itemDetails";
import { TESSERACT_PROGRESS } from "./actions/tesseractProgess";
import { API_STARTED } from "./actions/apiStarted";
import { API_FINISHED } from "./actions/apiFinished";

// Models
import { IState } from "./models/state";

function getInitialState(): IState {
    return {
        items: [],
        itemNames: [],
        itemDetails: [],
        isSettingsWindowVisible: false,
        isStatsWindowVisible: false,
        tesseractProgess: 0,
        isApiWorking: false
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
                isStatsWindowVisible: false,
                // Reset values on stat window close
                itemDetails: [],
                tesseractProgess: 0
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
            
        case API_STARTED:
            return {
                ...state,
                isApiWorking: true
            };

        case API_FINISHED:
            return {
                ...state,
                isApiWorking: false
            };


        default:
            return state;
    }
}
