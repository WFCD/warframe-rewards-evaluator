// Actions
import { SHOW_SETTINGS_WINDOW } from "./actions/showSettingsWindow";
import { ITEMS } from "./actions/items";
import { ITEMS_DETAILS } from "./actions/itemDetails";
import { TESSERACT_PROGRESS } from "./actions/tesseractProgess";
import { API_STARTED } from "./actions/apiStarted";
import { API_FINISHED } from "./actions/apiFinished";

// Models
import { State } from "./models/state";

function getInitialState(): State {
    return {
        items: [],
        itemNames: [],
        itemDetails: [],
        isSettingsWindowVisible: false,
        isSearchWindowVisible: false,
        tesseractProgess: 0,
        isApiWorking: false
    };
}

export function reducer(state: State, action: any): State {
    if (typeof state === 'undefined') {
        return getInitialState();
    }

    console.log("REDUCER: Received '" + action.type + "'.", action);

    switch (action.type) {

        case SHOW_SETTINGS_WINDOW:
            return {
                ...state,
                isSettingsWindowVisible: true
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
