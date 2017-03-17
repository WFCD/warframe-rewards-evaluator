import * as React from 'react';
import * as ReactDOM from 'react-dom';
import SettingsWindow from '../components/SettingsWindow';
import { Provider } from 'react-redux';
import { remote } from 'electron';

ReactDOM.render(
    <Provider store={remote.getGlobal('store')}>
        <SettingsWindow />
    </Provider>,
    document.getElementById("app")
);
