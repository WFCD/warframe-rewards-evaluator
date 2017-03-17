var fetch = require('fetch-cookie')(require('node-fetch'))

// Those are mocked interfaces of an API i do not have in my own hands.
// They, and thus the application may break at any given time without a warning.

export interface Item {
    item_name: string;
    item_type: string;
}

export interface TradePosition {
    ingame_name: string;
    online_ingame: boolean;
    online_status: boolean;
    price: number;
    count: number;
}

export interface ItemTradeDetails {
    sell: TradePosition[];
    buy: TradePosition[];
}

export class Api
{
    private url: string;
    private email: string;
    private password: string;
    private sessionId: string;

    public static async getItems(): Promise<Item[]> {
        let result = await (await fetch(
            'https://warframe.market/api/get_all_items_v2',
            {
                method: 'get'
            }
        )).json();

        return result;
    }

    public static async getOrdersForItem(item: Item): Promise<ItemTradeDetails> {
        let result = await (await fetch(
            `https://warframe.market/api/get_orders/${item.item_type}/${item.item_name}`,
            {
                method: 'get'
            }
        )).json();

        return result.response;
    }
}
