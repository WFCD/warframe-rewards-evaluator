// Internal Modules
import { PromiseJSONStore } from './utils/PromiseJSONStore';

export class SettingsStore {
    public getEmail(): Promise<string> {
        return PromiseJSONStore.getValue<string>('email');
    }

    public setEmail(email: string): Promise<void> {
        return PromiseJSONStore.setValue('email', email);
    }

    public getPassword(): Promise<string> {
        // HACK this really needs to be encrypted
        return PromiseJSONStore.getValue<string>('password');
    }

    public setPassword(password: string): Promise<void> {
        // HACK this really needs to be encrypted
        return PromiseJSONStore.setValue('password', password);
    }

    public getUrl(): Promise<string> {
        return PromiseJSONStore.getValue<string>('url');
    }

    public setUrl(url: string): Promise<void> {
        return PromiseJSONStore.setValue('url', url);
    }
}
