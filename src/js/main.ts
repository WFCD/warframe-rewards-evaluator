// External Modules
import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
import { app, BrowserWindow, Tray, Menu, globalShortcut } from "electron";
import { createStore, Store} from "redux";

// Internal Modules
import {reducer} from "./reducers";
import {SettingsStore} from "./SettingsStore";
import {Api} from "./Api";
import {ScreenEvaluator} from "./utils/ScreenEvaluator";

// Actions
import {showSettingsWindow} from "./actions/showSettingsWindow";
import {items} from "./actions/items";

// Models
import {IState} from "./models/state";


class Main
{
    private app: Electron.App;
    private statsWindow: Electron.BrowserWindow;
    private settingsWindow: Electron.BrowserWindow;
    private tray: Electron.Tray;
    private store: Store<IState>;
    private settingsStore: SettingsStore;

    constructor(app: Electron.App) {
        this.app = app;
        this.settingsStore = new SettingsStore();
    }

    public run()
    {
        this.app.on("ready", () => this.onReady());
        this.app.on('window-all-closed', () => {
            // Doing nothing will keep the application running
        });
    }

    private async onReady() {
        const temporaryScreenshotBasePath = path.join(app.getPath('userData'), '__captures');
        // Ensure screen capture path, ignore alredy exits errors
        fs.mkdir(temporaryScreenshotBasePath, (err) => {
            if(err && err.code !== 'EEXIST') {
                throw err;
            }
        });
        
        // TODO include
        this.createStatsWindow();
        // this.createSettingsWindow();
        // this.createTrayIcon();
        this.createStore();
        const boundShortcut = globalShortcut.register('Control+Alt+Enter', () => {
            console.log('Control+Alt+Enter was pressed');
            console.log('Triggering scraping...');
            ScreenEvaluator.processCurrentScreen(this.store, temporaryScreenshotBasePath);
        });
        // Fetch initial item data
        this.store.dispatch(items(await Api.getItems()));
    }

    private createStore() {
        // Create and bind store locally and globally
        this.store = (global as any).store = createStore(reducer);
        // Setup main change subscribtion
        this.store.subscribe(() => this.onStateChanged(this.store.getState()));
    }

    private onStateChanged(state: IState) {
        // Settings window
        if (state.isSettingsWindowVisible) {
            // this.settingsWindow.show();
        } else {
            // this.settingsWindow.hide();
        }

        if (state.isStatsWindowVisible) {
            this.showStatsWindow();
        } else {
            this.hideStatsWindow();
        }
    }

    private createTrayIcon() {
        // TODO rewrite, and include
        this.tray = new Tray(path.join(__dirname, '..','img','logo.png'));
        this.tray.setToolTip("Warframe Relic Rewards Evaluator");

        var menu = Menu.buildFromTemplate([
            {
                label: "Settings",
                click: () => {
                    // HACK upon closing and reopening, the window instance is broken and cannnot be reopened
                    // We either disable closing (is that possible?) or initialize new windows every time if the old one is broken
                    this.store.dispatch(showSettingsWindow());
                }
            },
            {
                label: "Exit",
                click: () => {
                    // Destroy the tray
                    this.tray.destroy();
                    // Exit the app
                    this.app.exit();
                }
            }
        ]);

        this.tray.setContextMenu(menu);
    }
    

    private createStatsWindow() {
        this.statsWindow = new BrowserWindow(
            {
                center: true,
                frame: false,
                movable: true,
                resizable: true,
                skipTaskbar: true,
                width: 1400,
                height: 800,
                title: "Results"
            }
        );

        this.statsWindow.on('beforeunload', (e) => {
            this.statsWindow.hide();
            e.returnValue = false;
        });

        // Open the DevTools.
        this.statsWindow.webContents.openDevTools();

        // and load the index.html of the app.
        this.statsWindow.loadURL(url.format({
            pathname: path.join(__dirname, '..', 'views', 'stats.html'),
            protocol: 'file:',
            slashes: true
        }));
    }

    private createSettingsWindow() {
        // TODO include
        this.settingsWindow = new BrowserWindow(
            {
                center: true,
                frame: false,
                movable: true,
                resizable: true,
                skipTaskbar: true,
                transparent: true,
                width: 800,
                height: 400,
                title: "Results"
            }
        );

        // Open the DevTools.
        this.settingsWindow.webContents.openDevTools();

        // and load the index.html of the app.
        this.settingsWindow.loadURL(url.format({
            pathname: path.join(__dirname, '..', 'views', 'settings.html'),
            protocol: 'file:',
            slashes: true
        }));
    }

    showStatsWindow() {
        this.statsWindow.show();
    }

    showSettingsWindow() {
        this.settingsWindow.show();
    }
    
    hideStatsWindow() {
        this.statsWindow.hide();
    }

    hideSettingsWindow() {
        this.settingsWindow.hide();
    }

    focusTray() {
        this.tray.popUpContextMenu();
    }
}


// Electron instance creation
// Consider this the main call

let main = null;

var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
    // Only allow single instances, if another one is tried to open, focus the tray
    if (main) {
        main.focusTray();
    }
});

if (shouldQuit) {
    app.quit();
}

else {
    main = new Main(app);
    main.run();
}
