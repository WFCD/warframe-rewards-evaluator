// Models
import {ItemDetail} from '../models/itemDetail';

export const ITEMS_DETAILS = 'ITEMS_DETAILS';

export function itemDetails(itemDetails: ItemDetail[]) {
    return {
        type: ITEMS_DETAILS,
        itemDetails: itemDetails
    };
};
