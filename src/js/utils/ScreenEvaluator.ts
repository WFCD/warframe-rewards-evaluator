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
        // TODO: Ask Warframe for permisson for internal hooks, at the time this is the only legal way to get the info..
        const __thisRef__ = this;
        screenshot(temporaryScreenshotName, function(error, complete) {
            // HACK we should probably not ignore errors, but it appears there are errors passed, even if there are none..
            Tesseract.recognize('test_new_cropped.jpg')            
            .progress(function  (p) { console.log('progress', p)  })
            .catch(err => console.error(err))
            .then(function(result) {
                console.log('tesseract results');
                var fs = require('fs');
                // HACK eeeeh, this just works like that, trust me!
                const foundLines = result.blocks[0].paragraphs[0].lines;
                const validityRegex = /[A-Z]{3,}/; // A line needs to contain at least capital letters to be considered valid // This needs to be tested - are there items with letters?? idk man
                let validLines: Tesseract.Line[] = [] as Tesseract.Line[];
                console.log(foundLines);
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
                console.log('OCR built those words from screnshot:');
                console.log(builtNames);
                
                // const similarItemNames = [
                //     'Akbronco Prime Blueprind',
                //     'Warrio',
                //     'Night Stalken',
                //     'Bo Prime Prnament'
                // ];
                __thisRef__.processItemNames(builtNames, state);
            })
        });
    }
}