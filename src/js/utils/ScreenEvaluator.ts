// External Modules
import * as fs from 'fs';
import * as path from 'path';
import * as stringSimilarity from "string-similarity";
import * as screenshot from "desktop-screenshot";
import * as Tesseract from 'tesseract.js'

// Internal Modules
import {Item} from '../Api';
import {IState} from '../reducers';
import {PriceEvaluator} from "./PriceEvaluator";
import {Api, ItemTradeDetails} from "../Api";

const temporaryScreenshotName = '__capture.png';
 
export class ScreenEvaluator {
    
    private static getItemBySimilarName(name: string, state: IState): Item {
        // Find best match to scraped name
        const bestMatch = stringSimilarity.findBestMatch(name, state.itemNames).bestMatch.target;
        return state.items.find(item => item.item_name === bestMatch);
    }

    private static async getOrdersForItems(items: Item[]) {
        let correspondingItemTradeDetails: ItemTradeDetails[] = [];
        
        // Use a old-school loop to get around asynch await error in forEach functor        
        for (var index = 0; index < items.length; index++) {
            var item = items[index];
            correspondingItemTradeDetails.push(await Api.getOrdersForItem(item));
        }

        return correspondingItemTradeDetails;
    }
    
    private static async processItemNames(itemNames: string[], state: IState) {
        // TODO scrape this from screen
        const correspondingItems = itemNames.map(similarItemName => {
            return this.getItemBySimilarName(similarItemName, state);
        });
        const correspondingItemTradeDetails = await this.getOrdersForItems(correspondingItems);
        
        correspondingItemTradeDetails.forEach((itemTradeDetail, index) => {
            const item = correspondingItems[index];
            const stats = PriceEvaluator.getAllStatistics(itemTradeDetail);
            
            console.log('');
            console.log('Some stats for "' + item.item_name + '"!');

            console.log('Minimal online selling price: ' + stats.minimalOnlineSalePrice);
            console.log('Average online selling price: ' + stats.averageOnlineSalePrice);
        });
        // TODO reinclude
        // fs.unlink(temporaryScreenshotName, (err) => {
        //     if (err) throw err;
        // });
    }

    public static async processCurrentScreen(state: IState) {
        const __thisRef__ = this;
        screenshot(temporaryScreenshotName, function(error, complete) {
            // HACK we should probably not ignore errors, but it appears there are errors passed, even if there are none..
            Tesseract.recognize('test.jpg')            
            .progress(function  (p) { console.log('progress', p)  })
            .catch(err => console.error(err))
            .then(function(result) {
                console.log('tesseract results');
                var fs = require('fs');
                console.dir(result);
                var cache = [];
                var stringified = JSON.stringify(result, function(key, value) {
                    if (typeof value === 'object' && value !== null) {
                        if (cache.indexOf(value) !== -1) {
                            // Circular reference found, discard key
                            return;
                        }
                        // Store value in our collection
                        cache.push(value);
                    }
                    return value;
                }, 4);
                cache = null; // Enable garbage collection
                fs.writeFile("results.json", stringified, function(err) {
                    if(err) {
                        return console.log(err);
                    }

                    console.log("The file was saved!");
                });
                
                const similarItemNames = [
                    'Akbronco Prime Blueprind',
                    'Warrio',
                    'Night Stalken',
                    'Bo Prime Prnament'
                ];
                __thisRef__.processItemNames(similarItemNames, state);
            })
        });
    }
}