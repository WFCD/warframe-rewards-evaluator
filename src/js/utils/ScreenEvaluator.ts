import {Item} from '../Api';
import {IState} from '../reducers';
import {PriceEvaluator} from "./PriceEvaluator";
import {Api, ItemTradeDetails} from "../Api";

export class ScreenEvaluator {
    private static getItemBySimilarName(name: string, state: IState): Item {
        // HACK fuck typings, use find...
        return state.items.filter(item => item.item_name === name)[0];
    }

    public static async processCurrentScreen(state: IState) {
        console.log("inside processCurrentScreen");
        // TODO scrape this from screen
        const similarItemNames = [
            'Akbronco Prime Blueprint',
            'Warrior',
            'Night Stalker',
            'Bo Prime Ornament'
        ];
        const correspondingItems = similarItemNames.map(similarItemName => {
            return this.getItemBySimilarName('Akbronco Prime Blueprint', state);
        })
        let correspondingItemTradeDetails = [];
        // Use a old-school loop to get around asynch await error in forEach functor
        for (var index = 0; index < correspondingItems.length; index++) {
            var item = correspondingItems[index];
            correspondingItemTradeDetails.push(await Api.getOrdersForItem(item));
        }
        
        correspondingItemTradeDetails.forEach(itemTradeDetail => {
            console.log(PriceEvaluator.getAllStatistics(itemTradeDetail));
        })
    }
}