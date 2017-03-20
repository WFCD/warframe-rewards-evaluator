// Models
import {ItemStatistics} from '../models/itemStatistics';
import {ItemTradeDetails} from '../models/itemTradeDetails';
import {TradePosition} from '../models/tradePosition';
import {Item} from '../models/item';
import {BestSaleValue} from '../models/bestSaleValue';

export class PriceEvaluator {
    private static getOnlinePositions(tradePositions: TradePosition[]): TradePosition[] {
        return tradePositions.filter(tradePosition => tradePosition.online_status === true || tradePosition.online_ingame === true);
    }

    private static getMedian(values: number[]) {
        values.sort( function(a, b) {return a - b; } );

        const half = Math.floor(values.length / 2);

        let result;

        if (values.length % 2) {
            result = values[half];
        }
        else {
            result = (values[half - 1] + values[half]) / 2.0;
        }
        return isNaN(result) ? null : result;
    }

    private static getAverage(values: number[]) {
        let total = 0;
        values.forEach(value => {
            total += value;
        });
        const average = total / values.length;
        return isNaN(average) ? null : average;
    }

    private static getMinimal(values: number[]) {
        let minimal = Infinity;
        values.forEach(value => {
            if (value < minimal) {
                minimal = value;
            }
        });
        return minimal === Infinity ? null : minimal;
    }

    private static getMaximal(values: number[]) {
        let minimal = 0;
        values.forEach(value => {
            if (value > minimal) {
                minimal = value;
            }
        });
        return minimal === 0 ? null : minimal;
    }

    static getRecommendedSalePrice(itemTradeDetails: ItemTradeDetails): BestSaleValue {
        const minimalOnlineSalePrice = this.getMinimalOnlineSalePrice(itemTradeDetails);
        const maximalOnlineBuyPrice = this.getMaximalOnlineBuyPrice(itemTradeDetails);

        const sellingPriceIsHigherThanBuyingPrice = minimalOnlineSalePrice > maximalOnlineBuyPrice;

        return {
            reason: sellingPriceIsHigherThanBuyingPrice ? 'sell' : 'buy',
            value: sellingPriceIsHigherThanBuyingPrice ? minimalOnlineSalePrice : maximalOnlineBuyPrice
        };
    }

    static getMinimalSalePrice(itemTradeDetails: ItemTradeDetails): number {
        return this.getMinimal(itemTradeDetails.sell.map(item => item.price));
    }

    static getMinimalOnlineSalePrice(itemTradeDetails: ItemTradeDetails): number {
        return this.getMinimal(this.getOnlinePositions(itemTradeDetails.sell).map(item => item.price));
    }

    static getAverageSalePrice(itemTradeDetails: ItemTradeDetails): number {
        return this.getAverage(itemTradeDetails.sell.map(item => item.price));
    }

    static getAverageOnlineSalePrice(itemTradeDetails: ItemTradeDetails): number {
        return this.getAverage(this.getOnlinePositions(itemTradeDetails.sell).map(item => item.price));
    }

    static getMedianSalePrice(itemTradeDetails: ItemTradeDetails): number {
        return this.getMedian(itemTradeDetails.sell.map(item => item.price));
    }

    static getMedianOnlineSalePrice(itemTradeDetails: ItemTradeDetails): number {
        return this.getMedian(this.getOnlinePositions(itemTradeDetails.sell).map(item => item.price));
    }

    static getSalePriceRange(itemTradeDetails: ItemTradeDetails): number[] {
        return itemTradeDetails.sell.map(item => item.price).sort((a, b) => a - b);
    }

    static getOnlineSalePriceRange(itemTradeDetails: ItemTradeDetails): number[] {
        return this.getOnlinePositions(itemTradeDetails.sell).map(item => item.price).sort((a, b) => a - b);
    }

    static getMaximalBuyPrice(itemTradeDetails: ItemTradeDetails): number {
        return this.getMaximal(itemTradeDetails.buy.map(item => item.price));
    }

    static getMaximalOnlineBuyPrice(itemTradeDetails: ItemTradeDetails): number {
        return this.getMaximal(this.getOnlinePositions(itemTradeDetails.buy).map(item => item.price));
    }

    static getAverageBuyPrice(itemTradeDetails: ItemTradeDetails): number {
        return this.getAverage(itemTradeDetails.buy.map(item => item.price));
    }

    static getAverageOnlineBuyPrice(itemTradeDetails: ItemTradeDetails): number {
        return this.getAverage(this.getOnlinePositions(itemTradeDetails.buy).map(item => item.price));
    }

    static getMedianBuyPrice(itemTradeDetails: ItemTradeDetails): number {
        return this.getMedian(itemTradeDetails.buy.map(item => item.price));
    }

    static getMedianOnlineBuyPrice(itemTradeDetails: ItemTradeDetails): number {
        return this.getMedian(this.getOnlinePositions(itemTradeDetails.buy).map(item => item.price));
    }

    static getBuyPriceRange(itemTradeDetails: ItemTradeDetails): number[] {
        return itemTradeDetails.buy.map(item => item.price).sort((a, b) => a - b);
    }

    static getOnlineBuyPriceRange(itemTradeDetails: ItemTradeDetails): number[] {
        return this.getOnlinePositions(itemTradeDetails.buy).map(item => item.price).sort((a, b) => a - b);
    }

    static getDucatsPrice(item: Item) {
        if (item && item.v2Info && item.v2Info.ducats) {
            return item.v2Info.ducats;
        }
        return null;
    }

    static getTradingTax(item: Item) {
        if (item && item.v2Info && item.v2Info.trading_tax) {
            return item.v2Info.trading_tax;
        }
        return null;
    }

    /** All values default to null if no meaningful result could be found */
    static getAllStatistics(item: Item, itemTradeDetails: ItemTradeDetails): ItemStatistics {
        return {
            recommendedSalePrice: this.getRecommendedSalePrice(itemTradeDetails),
            salePriceRange: this.getSalePriceRange(itemTradeDetails),
            onlineSalePriceRange: this.getOnlineSalePriceRange(itemTradeDetails),
            buyPriceRange: this.getBuyPriceRange(itemTradeDetails),
            onlineBuyPriceRange: this.getOnlineBuyPriceRange(itemTradeDetails),
            minimalSalePrice: this.getMinimalSalePrice(itemTradeDetails),
            minimalOnlineSalePrice: this.getMinimalOnlineSalePrice(itemTradeDetails),
            averageSalePrice: this.getAverageSalePrice(itemTradeDetails),
            averageOnlineSalePrice: this.getAverageOnlineSalePrice(itemTradeDetails),
            medianSalePrice: this.getMedianSalePrice(itemTradeDetails),
            medianOnlineSalePrice: this.getMedianOnlineSalePrice(itemTradeDetails),
            maximalBuyPrice: this.getMaximalBuyPrice(itemTradeDetails),
            maximalOnlineBuyPrice: this.getMaximalOnlineBuyPrice(itemTradeDetails),
            averageBuyPrice: this.getAverageBuyPrice(itemTradeDetails),
            averageOnlineBuyPrice: this.getAverageOnlineBuyPrice(itemTradeDetails),
            medianBuyPrice: this.getMedianBuyPrice(itemTradeDetails),
            medianOnlineBuyPrice: this.getMedianOnlineBuyPrice(itemTradeDetails),
            ducatsPrice: this.getDucatsPrice(item),
            tradingTax: this.getTradingTax(item)
        };
    }
}