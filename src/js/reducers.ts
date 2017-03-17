// Actions
import { SHOW_SETTINGS_WINDOW } from "./actions/showSettingsWindow";
import { ITEMS } from "./actions/items";

// Models
import { Item } from "./Api";

export interface IState {
    items: Item[],
    isSettingsWindowVisible: boolean,
    isSearchWindowVisible: boolean
}

export function reducer(state: IState, action: any): IState {
    if (typeof state === 'undefined') {
        return {
            items: [],
            isSettingsWindowVisible: false,
            isSearchWindowVisible: false
        };
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
                items: action.items
            };

        default:
            return state;
    }
}
