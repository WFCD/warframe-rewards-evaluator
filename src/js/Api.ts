// External Modules
import * as fetch from 'node-fetch';
import * as fs from 'fs';

// Models
import {Item} from './models/item';
import {ItemTradeDetails} from './models/itemTradeDetails';

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

        let v2Result = await (await fetch(
            'https://bitbucket.org/42bytes/warframe.market-items/raw/default/items.json',
            {
                method: 'get'
            }
        )).json();

        const cominedResults = result.map(result => {
            return {
                ...result,
                v2Info: v2Result.items.find(v2Result => v2Result.en.item_name === result.item_name)
            }
        });

        return cominedResults;
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
