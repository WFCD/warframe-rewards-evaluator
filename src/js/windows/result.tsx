import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ResultWindow from '../components/ResultWindow';
import { Provider } from 'react-redux';
import { remote } from 'electron';

ReactDOM.render(
    <Provider store={remote.getGlobal('store')}>
        <ResultWindow />
    </Provider>,
    document.getElementById("app")
);
