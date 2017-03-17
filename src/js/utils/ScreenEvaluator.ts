import {Item} from '../Api';
import {IState} from '../reducers';
import {PriceEvaluator} from "./PriceEvaluator";
import {Api, ItemTradeDetails} from "../Api";

export class ScreenEvaluator {
    private static getItemBySimilarName(name: string, state: IState): Item {
        // HACK fuck typings, use find...
        console.log(name);
        console.log((state.items as any).find(item => item.item_name === name));
        return state.items.filter(item => item.item_name === name)[0];
    }

    public static async processCurrentScreen(state: IState) {
        // TODO scrape this from screen
        const similarItemNames = [
            'Akbronco Prime Blueprint',
            'Warrior',
            'Night Stalker',
            'Bo Prime Ornament'
        ];
        const correspondingItems = similarItemNames.map(similarItemName => {
            return this.getItemBySimilarName(similarItemName, state);
        })
        let correspondingItemTradeDetails: ItemTradeDetails[] = [];
        // Use a old-school loop to get around asynch await error in forEach functor
        
        for (var index = 0; index < correspondingItems.length; index++) {
            var item = correspondingItems[index];
            correspondingItemTradeDetails.push(await Api.getOrdersForItem(item));
        }
        
        correspondingItemTradeDetails.forEach((itemTradeDetail, index) => {
            const itemName = similarItemNames[index];
            const stats = PriceEvaluator.getAllStatistics(itemTradeDetail);
            
            console.log('');
            console.log('Some stats for "' + itemName + '"!');

            console.log('Minimal online selling price: ' + stats.minimalOnlineSalePrice);
            console.log('Average online selling price: ' + stats.averageOnlineSalePrice);
        })
    }
}