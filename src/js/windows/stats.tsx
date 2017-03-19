// External Modules
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { remote } from 'electron';

// Internal Modules
import StatsWindow from '../components/StatsWindow';

ReactDOM.render(
    <Provider store={remote.getGlobal('store')}>
        <StatsWindow />
    </Provider>,
    document.getElementById("app")
);
