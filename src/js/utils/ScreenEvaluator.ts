import {Item} from '../Api';
import {IState} from '../reducers';
import {PriceEvaluator} from "./PriceEvaluator";
import {Api, ItemTradeDetails} from "../Api";
import * as stringSimilarity from "string-similarity";
 
export class ScreenEvaluator {
    
    private static getItemBySimilarName(name: string, state: IState): Item {
        // Find best match to scraped name
        const allNames = state.items.map(item => item.item_name);
        const bestMatch = stringSimilarity.findBestMatch(name, allNames).bestMatch.target;

        // REVIEW Maybe compile to es6? is that ok with electron, or not? Then we can use filter instead of .. this.
        return state.items.filter(item => item.item_name === bestMatch)[0];
    }

    public static async processCurrentScreen(state: IState) {
        // TODO scrape this from screen
        const similarItemNames = [
            'Akbronco Prime Blueprind',
            'Warrio',
            'Night Stalken',
            'Bo Prime Prnament'
        ];
        const correspondingItems = similarItemNames.map(similarItemName => {
            return this.getItemBySimilarName(similarItemName, state);
        });
        let correspondingItemTradeDetails: ItemTradeDetails[] = [];
        // Use a old-school loop to get around asynch await error in forEach functor
        
        for (var index = 0; index < correspondingItems.length; index++) {
            var item = correspondingItems[index];
            correspondingItemTradeDetails.push(await Api.getOrdersForItem(item));
        }
        
        correspondingItemTradeDetails.forEach((itemTradeDetail, index) => {
            const item = correspondingItems[index];
            const stats = PriceEvaluator.getAllStatistics(itemTradeDetail);
            
            console.log('');
            console.log('Some stats for "' + item.item_name + '"!');

            console.log('Minimal online selling price: ' + stats.minimalOnlineSalePrice);
            console.log('Average online selling price: ' + stats.averageOnlineSalePrice);
        })
    }
}