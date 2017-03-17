import * as React from 'react';
import { connect } from 'react-redux';
import {start} from "../actions/start";
import {stop} from "../actions/stop";
import {settings} from "../actions/settings";

class SettingsWindow extends React.Component<Props, State>
{
    public constructor(props) {
        super(props);

        this.state = {
            url: props.url,
            email: props.email,
            password: props.password
        };
    }

    public render() {
        return (
            <div id="container">
                <div>
                    <input type="text" value={this.state.url ? this.state.url : ""}
                           onChange={e => this.setState({ url: e.target.value })} placeholder="URL" />
                </div>
                <div>
                    <input type="email" value={this.state.email ? this.state.email : ""}
                           onChange={e => this.setState({ email: e.target.value })} placeholder="E-Mail" />
                </div>
                <div>
                    <input type="password" value={this.state.password ? this.state.password : ""}
                           onChange={e => this.setState({ password: e.target.value })} placeholder="Password" />
                </div>
                <div>
                    <button onClick={() => this.save()}>Save</button>
                </div>
            </div>
        );
    }

    private save() {
        this.props.onSave(this.state.url, this.state.email, this.state.password);
    }
}

interface Props {
    url: string;
    email: string;
    password: string;
    onSave: (url: string, email: string, password: string) => void;
}

interface State {
    url: string;
    email: string;
    password: string;
}

export default connect(
    state => {
        return {
            url: state.settings.url,
            email: state.settings.email,
            password: state.settings.password
        };
    },
    dispatch => {
        return {
            onSave: (url: string, email: string, password: string) => {
                dispatch(settings(url, email, password));
            }
        };
    }
)(SettingsWindow);
