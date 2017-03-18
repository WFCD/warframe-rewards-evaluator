// Models
import { Item } from "./item";
import { ItemDetail } from "./itemDetail";

export interface State {
    items: Item[];
    itemNames: string[];
    itemDetails: ItemDetail[];
    isSettingsWindowVisible: boolean;
    isSearchWindowVisible: boolean;
    tesseractProgess: number;
    isApiWorking: boolean;
}