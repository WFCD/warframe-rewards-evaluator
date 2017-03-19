// Models
import {BestSaleValue} from './bestSaleValue';

export interface ItemStatistics {
    recommendedSalePrice: BestSaleValue;
    salePriceRange: number[];
    onlineSalePriceRange: number[];
    buyPriceRange: number[];
    onlineBuyPriceRange: number[];
    minimalSalePrice: number;
    minimalOnlineSalePrice: number;
    averageSalePrice: number;
    averageOnlineSalePrice: number;
    medianSalePrice: number;
    medianOnlineSalePrice: number;
    maximalBuyPrice: number;
    maximalOnlineBuyPrice: number;
    averageBuyPrice: number;
    averageOnlineBuyPrice: number;
    medianBuyPrice: number;
    medianOnlineBuyPrice: number;
    ducatsPrice: number;
    tradingTax: number;
}
