export const START = "start";

export function start(project: any, task: any) {
    return {
        type: START,
        project: project,
        task: task
    };
};
