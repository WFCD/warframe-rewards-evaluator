// External Modules
const path = require('path');
const url = require('url');
import { app, BrowserWindow, Tray, Menu, globalShortcut } from "electron";
import { createStore } from "redux";

// Internal Modules
import {reducer, IState} from "./reducers";
import {SettingsStore} from "./SettingsStore";
import {Api} from "./Api";
import {ScreenEvaluator} from "./utils/ScreenEvaluator";

// Actions
import {showSettingsWindow} from "./actions/showSettingsWindow";
import {items} from "./actions/items";


class Main
{
    private app: Electron.App;
    private searchWindow: Electron.BrowserWindow;
    private settingsWindow: Electron.BrowserWindow;
    private tray: Electron.Tray;
    private store: any;
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
        // TODO include
        // this.createSettingsWindow();
        // this.createTrayIcon();
        this.createStore();
        // TODO
        // Bind global keystroke event to the screen evaulation
        const ret = globalShortcut.register('Control+Space', () => {
            console.log('Control+Space is pressed');
            ScreenEvaluator.processCurrentScreen(this.store.getState());
        });
        // Fetch initial item data
        this.store.dispatch(items(await Api.getItems()));
    }

    private createStore() {
        this.store = (global as any).store = createStore(reducer);
        this.store.subscribe(() => this.onStateChanged(this.store.getState()));
    }

    private onStateChanged(state: IState) {
        // Settings window
        if (state.isSettingsWindowVisible) {
            // this.settingsWindow.show();
        } else {
            // this.settingsWindow.hide();
        }
    }

    private createTrayIcon() {
        // TODO rewrite, and include
        this.tray = new Tray(path.join(__dirname, "/../img/timetrack-icon_512x512-grey.png"));
        this.tray.on('click', () => {
            this.showSearchWindow();
        });
        this.tray.setToolTip("Fusonic Timetracking");

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

    private createSettingsWindow() {
        // TODO include
        this.settingsWindow = new BrowserWindow(
            {
                alwaysOnTop: true,
                center: true,
                //frame: false,
                movable: false,
                // resizable: false,
                skipTaskbar: true,
                transparent: true,
                width: 800,
                height: 400,
                title: "Settings"
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

    showSearchWindow() {
        this.searchWindow.show();
    }

    showSettingsWindow() {
        this.settingsWindow.show();
    }

    focusTray() {
        this.tray.popUpContextMenu();
    }
}

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


/*



// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createSearchWindow()
    }
});
*/