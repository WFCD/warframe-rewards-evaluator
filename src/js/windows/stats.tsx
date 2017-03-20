// External Modules
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { remote } from 'electron';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// Internal Modules
import StatsWindow from '../components/StatsWindow';

injectTapEventPlugin();

ReactDOM.render(
    <Provider store={remote.getGlobal('store')}>
        <MuiThemeProvider>
            <StatsWindow />
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('app')
);
