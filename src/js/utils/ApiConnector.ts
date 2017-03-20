// External Modules
import * as fs from 'fs';
import * as stringSimilarity from 'string-similarity';
import { Store } from 'redux';

// Internal Modules
import { Api } from '../Api';
import { PriceEvaluator } from './PriceEvaluator';

// Actions
import { getItemStatsStarted } from '../actions/getItemStatsStarted';
import { getItemStatsFinished } from '../actions/getItemStatsFinished';
import { getDataFinished } from '../actions/getDataFinished';
import { itemDetails } from '../actions/itemDetails';

// Models
import { ItemTradeDetails } from '../models/itemTradeDetails';
import { Item } from '../models/item';
import { IState } from '../models/state';

export class ApiConnector {

    private static getItemBySimilarNames(names: string[], state: IState): Item[] {
        // Find best match to scraped name
        const confidentlyFoundItems: Item[] = [];
        names.forEach(name => {
            const bestMatch = stringSimilarity.findBestMatch(name, state.itemNames).bestMatch;
            // Allow a 30% fault tolerance, others are presumeably read wrong from screen..
            if (bestMatch.rating > 0.7) {
                confidentlyFoundItems.push(state.items.find(item => (item || {item_name : null}).item_name === bestMatch.target));
            }
        });
        return confidentlyFoundItems;
    }

    private static async getOrdersForItems(items: Item[]) {
        let correspondingItemTradeDetails: ItemTradeDetails[] = [];

        // Use a old-school loop to get around asynch await error in forEach functor
        for (let index = 0; index < items.length; index++) {
            let item = items[index];
            correspondingItemTradeDetails.push(await Api.getOrdersForItem(item));
        }

        return correspondingItemTradeDetails;
    }

    public static async processItemNames(inExactItemNames: string[], store: Store<IState>, screenShotFilePaths: string[]) {
        const state = store.getState();
        // TODO scrape this from screen
        const foundItems = this.getItemBySimilarNames(inExactItemNames, state);

        store.dispatch(getItemStatsStarted());
        const correspondingItemTradeDetails = await this.getOrdersForItems(foundItems);
        store.dispatch(getItemStatsFinished());
        store.dispatch(getDataFinished());

        const correspondingItemDetails = correspondingItemTradeDetails.map((itemTradeDetail, index) => {
            const item = foundItems[index];
            return {
                name: item.item_name,
                stats: PriceEvaluator.getAllStatistics(item, itemTradeDetail)
            };
        });
        store.dispatch(itemDetails(correspondingItemDetails));

        screenShotFilePaths.forEach(filePath => {
            fs.unlink(filePath, (err) => {
                if (err) throw err;
            });
        });
    }
}