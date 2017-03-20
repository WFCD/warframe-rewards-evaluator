export const SETTINGS = 'settings';

export function settings(url: string, email: string, password: string) {
    return {
        type: SETTINGS,
        url: url,
        email: email,
        password: password
    };
};
