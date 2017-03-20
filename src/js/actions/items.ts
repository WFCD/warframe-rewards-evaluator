// Models
import {Item} from '../models/item';

export const ITEMS = 'ITEMS';

export function items(items: Item[]) {
    return {
        type: ITEMS,
        items: items,
        itemNames: items.map(item => item.item_name)
    };
};
