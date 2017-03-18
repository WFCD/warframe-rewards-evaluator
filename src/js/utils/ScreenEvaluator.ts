// External Modules
import * as fs from 'fs';
import * as path from 'path';
import * as stringSimilarity from "string-similarity";
import * as screenshot from "desktop-screenshot";
import * as Tesseract from 'tesseract.js'
import * as uuid from 'node-uuid';
import { Store } from "redux";

// Internal Modules
import {Api} from "../Api";
import {PriceEvaluator} from "./PriceEvaluator";

// Actions
import {tesseractProgress} from "../actions/tesseractProgess";
import {apiStarted} from "../actions/apiStarted";
import {apiFinished} from "../actions/apiFinished";
import {showStatsWindow} from "../actions/showStatsWindow";
import {itemDetails} from "../actions/itemDetails";

// Models
import {ItemTradeDetails} from '../models/itemTradeDetails';
import {Item} from '../models/item';
import {State} from '../models/state';
 
export class ScreenEvaluator {
    
    private static getItemBySimilarName(name: string, state: State): Item {
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
    
    private static async processItemNames(itemNames: string[], store: Store<State>, screenShotName: string) {
        const state = store.getState();
        // TODO scrape this from screen
        const correspondingItems = itemNames.map(similarItemName => {
            return this.getItemBySimilarName(similarItemName, state);
        });
        store.dispatch(apiStarted());
        const correspondingItemTradeDetails = await this.getOrdersForItems(correspondingItems);
        store.dispatch(apiFinished());
        
        const correspondingItemDetails = correspondingItemTradeDetails.map((itemTradeDetail, index) => {
            const item = correspondingItems[index];
            return {
                name: item.item_name,
                stats: PriceEvaluator.getAllStatistics(item, itemTradeDetail)
            }
        });
        store.dispatch(itemDetails(correspondingItemDetails));
        
        fs.unlink(screenShotName, (err) => {
            if (err) throw err;
        });
    }

    public static async processCurrentScreen(store: Store<State>, capturePath: string) {

        //  /————————————————————————————————————————————————————————————————————————————————————————————————————————————————\
        // |   TODO: Ask Warframe for permisson for internal hooks, at the time this is the only legal way to get the info..  |
        //  \————————————————————————————————————————————————————————————————————————————————————————————————————————————————/

        // Let's get to work, show em' something!
        store.dispatch(showStatsWindow());
        const __thisRef__ = this;
        const temporaryScreenshotBaseName = path.join(capturePath, '__capture-' + uuid.v4() + '-' + uuid.v4() + '.png');

        screenshot(temporaryScreenshotBaseName, function(error, complete) {
            // HACK we should probably not ignore errors, but it appears there are errors passed, even if there are none..
            let progressInPercent = 0;

            // TODO crop the image to a smaller size, to improve detection time in production??
            Tesseract.recognize('test_new_cropped.jpg')
            .progress((progress) => {
                // TODO leak progress to react stuff
                if(progress.status === 'recognizing text'){
                    // Throttle down to percentage leaks
                    const currentProgressInPercent = parseInt(progress.progress * 100 as any, 10);
                    if(currentProgressInPercent > progressInPercent) {
                        progressInPercent = currentProgressInPercent;
                        store.dispatch(tesseractProgress(currentProgressInPercent));
                    }
                }
            })
            .catch(err => console.error(err))
            .then(function(result) {
                var fs = require('fs');
                // HACK eeeeh, this just works like that, trust me! 😐
                const foundLines = result.blocks[0].paragraphs[0].lines;
                const validityRegex = /[A-Z]{3,}/; // A line needs to contain at least capital letters to be considered valid
                let validLines: Tesseract.Line[] = [] as Tesseract.Line[];
                foundLines.forEach(line => {
                    if(line.text.match(validityRegex)) {
                        validLines.push(line);
                    }
                });
                // First word has no previous word, use this instead
                const wordBaseLineFallback =  {
                    text: null,
                    baseline: {
                        x1: 0
                    }
                };
                const builtNames = [];
                let currentNameIndex = 0;
                validLines.forEach((line, index) => {
                    line.words.forEach((word, index) => {
                        const previousWord =line.words[index - 1] || wordBaseLineFallback;
                        // If the previous word was not in a 30px range close of this word, complete the current word
                        if(!((previousWord.baseline.x1 + 30) > word.baseline.x0)) {
                            currentNameIndex++;
                        }
                        // Ensure the current word is a string, and never undefined
                        if(!builtNames[currentNameIndex]) {
                            builtNames[currentNameIndex] = '';
                        }
                        builtNames[currentNameIndex] += ' ' + word.text;
                    });
                });
                __thisRef__.processItemNames(builtNames, store, temporaryScreenshotBaseName);
            })
        });
    }
}