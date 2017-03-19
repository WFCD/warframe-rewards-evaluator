// External Modules
import * as React from 'react';
import { connect } from 'react-redux';

class StatsWindow extends React.Component<Props, State>
{
    public constructor(props) {
        super(props);
    }

    public render() {
        return (
            <div>
            </div>
        );
    }
}

interface Props {
    onStart: (project: any, task: any) => void,
    onStop: () => void
}

interface State {
    filterString: string
}

export default connect(
    state => {
        return {
            projects: state.projects,
            activeTask: state.activeTask
        };
    },
    dispatch => {
        return {
        };
    }
)(ResultWindow);
