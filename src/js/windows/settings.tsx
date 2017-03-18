// External Modules
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { remote } from 'electron';

// Internal Modules
import SettingsWindow from '../components/SettingsWindow';

ReactDOM.render(
    <Provider store={remote.getGlobal('store')}>
        <SettingsWindow />
    </Provider>,
    document.getElementById("app")
);
