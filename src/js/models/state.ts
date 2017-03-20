// Models
import { Item } from './item';
import { ItemDetail } from './itemDetail';

export interface IState {
    items: Item[];
    itemNames: string[];
    itemDetails: ItemDetail[];
    isSettingsWindowVisible: boolean;
    isStatsWindowVisible: boolean;
    tesseractProgess: number;
    isApiWorking: boolean;
    isGettingData: boolean;
}