// Actions
import { SHOW_SETTINGS_WINDOW } from "./actions/showSettingsWindow";

// Models
import { Item } from "./Api";

export interface IState {
    items: Item[],
    isSettingsWindowVisible: boolean,
    isSearchWindowVisible: boolean
}

export function reducer(state: IState, action): IState {
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

        default:
            return state;
    }
}
