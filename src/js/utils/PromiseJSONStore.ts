// External Modules
const jsonStore = require("electron-json-storage");

export class PromiseJSONStore {
    public static getValue<T>(key: string): Promise<T> {
        return new Promise<T>((resolve, reject)=>{
            jsonStore.get(key, function(error, data) {
                if (error) {
                    resolve(null);
                }

                // Empty values default to null
                if(data !== null  && data.constructor === Object && Object.keys(data).length === 0) {
                    data = null;
                }

                resolve(data);
            });
        })
    }

    public static setValue(key: string, value: any): Promise<void> {
        return new Promise<void>((resolve, reject)=>{
            jsonStore.set(key, value, function(error, data) {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        })
    }
}