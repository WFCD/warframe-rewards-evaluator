// External Modules
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { remote } from 'electron';

// Internal Modules
import ResultWindow from '../components/ResultWindow';

ReactDOM.render(
    <Provider store={remote.getGlobal('store')}>
        <ResultWindow />
    </Provider>,
    document.getElementById("app")
);
