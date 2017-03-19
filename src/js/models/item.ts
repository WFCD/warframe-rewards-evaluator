export interface Item {
    item_name: string;
    item_type: string;
    // There is more info, but i don't wanna type those lol
    v2Info?: {
        ducats: number;
        trading_tax: number;
        en: {
            item_name: string;
        }
    };
}
