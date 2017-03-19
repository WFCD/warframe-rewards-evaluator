// External Modules
import * as fs from 'fs';
import * as path from 'path';
import * as stringSimilarity from "string-similarity";
import * as screenshot from "desktop-screenshot";
import * as Tesseract from 'tesseract.js'
import * as uuid from 'node-uuid';
import * as sharp from 'sharp';
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
    
    private static getItemBySimilarNames(names: string[], state: State): Item[] {
        // Find best match to scraped name
        const confidentlyFoundItems = [];
        names.forEach(name => {
            const bestMatch = stringSimilarity.findBestMatch(name, state.itemNames).bestMatch;
            // Allow a 30% fault tolerance, others are presumeably read wrong from screen..
            if (bestMatch.rating > 0.7) {                ;
                confidentlyFoundItems.push(state.items.find(item => (item || {item_name : null}).item_name === bestMatch.target));
            }
        });
        return confidentlyFoundItems;
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
    
    private static async processItemNames(inExactItemNames: string[], store: Store<State>, screenShotFilePaths: string[]) {
        const state = store.getState();
        // TODO scrape this from screen
        const foundItems = this.getItemBySimilarNames(inExactItemNames, state);
        console.log(foundItems);

        store.dispatch(apiStarted());
        const correspondingItemTradeDetails = await this.getOrdersForItems(foundItems);
        store.dispatch(apiFinished());
        
        const correspondingItemDetails = correspondingItemTradeDetails.map((itemTradeDetail, index) => {
            const item = foundItems[index];
            return {
                name: item.item_name,
                stats: PriceEvaluator.getAllStatistics(item, itemTradeDetail)
            }
        });
        store.dispatch(itemDetails(correspondingItemDetails));
        
        screenShotFilePaths.forEach(filePath => {            
            fs.unlink(filePath, (err) => {
                if (err) throw err;
            });
        });
    }

    public static async processCurrentScreen(store: Store<State>, capturePath: string) {

        //  /————————————————————————————————————————————————————————————————————————————————————————————————————————————————\
        // |   TODO: Ask Warframe for permisson for internal hooks, at the time this is the only legal way to get the info..  |
        //  \————————————————————————————————————————————————————————————————————————————————————————————————————————————————/

        // Let's get to work, show em' something!
        store.dispatch(showStatsWindow());
        const __thisRef__ = this;
        const temporaryScreenshotBaseFileName = '__capture-' + uuid.v4() + '-' + uuid.v4();
        const temporaryScreenshotRawFileName = temporaryScreenshotBaseFileName + '_raw.jpg';
        const temporaryScreenshotCroppedFileName = temporaryScreenshotBaseFileName + 'cropped.jpg';
        const temporaryScreenshotNameRaw = path.join(capturePath, temporaryScreenshotRawFileName);
        const temporaryScreenshotNameCropped = path.join(capturePath, temporaryScreenshotCroppedFileName);

        console.log(temporaryScreenshotNameRaw);

        screenshot(temporaryScreenshotNameRaw, function(error, complete) {
            // HACK we should probably not ignore all errors, but some are wrong..
            
            // This is pretty experimental.. how is it with other screen sizes? only tested this on 1920x1080
            const leftPercentage = 20;
            const topPercentage = 23;
            const heightPercentage = 6;
            const widthPercentage = 77;

            const temporaryScreenshotNameRaw = 'REALSAMPLE.jpg';
            
            sharp(temporaryScreenshotNameRaw)
            .metadata()
            .then(info => {
                // Scale the image relatively
                const left = Math.round(info.height * leftPercentage / 100);
                const top = Math.round(info.width * topPercentage / 100);
                const width = Math.round(info.width * widthPercentage / 100);
                const height = Math.round(info.height * heightPercentage / 100);

                return sharp(temporaryScreenshotNameRaw)
                // Initial center crop
                .extract({
                    left: left,
                    top: top,
                    width: width,
                    height: height
                })
                .toFile(temporaryScreenshotNameCropped);
            }).then(() => {                  
                let progressInPercent = 0;

                Tesseract.recognize(temporaryScreenshotNameCropped)
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
                    let foundLines: Tesseract.Line[] = [] as Tesseract.Line[] ;
                    result.blocks.forEach(block => {
                        // HACK Typings hack assertion, it's wrong in the src typings
                        (block.paragraphs as any as Tesseract.Paragraph[]).forEach(paragraph => {
                            foundLines = foundLines.concat(paragraph.lines);
                        })
                    });
                    const validityRegex = /[A-Z]{5,}/; // The line needs to contain at least five capital letters to be considered valid
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
                    let builtNames = [];
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
                    // HACK There was a case where the first item is undefined, because it's baseline was strange or so
                    // This prevents it for now, but i gotta see why that happened
                    builtNames = builtNames.filter(builtName => builtName !== undefined);
                    console.log(builtNames);
                    __thisRef__.processItemNames(builtNames, store, [
                        // temporaryScreenshotNameRaw, temporaryScreenshotNameCropped
                    ]);
                });
            });
        });
    }
}