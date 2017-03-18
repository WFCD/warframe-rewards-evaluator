// Models
import {TradePosition} from './tradePosition';

export interface ItemTradeDetails {
    sell: TradePosition[];
    buy: TradePosition[];
}