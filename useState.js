class State {

    constructor(initialState) {
        this._state = initialState;
    }

    getState() {
        return this._state;
    }

    setState(newState) {
        this._state = newState;
    }
}

const stateNames = new Map();

function useState(initialState, name) {

    let state;

    if (!!name && stateNames.has(name)) {
        state = stateNames.get(name);
    } else {
        state = new State(initialState);
        if (!!name) {
            stateNames.set(name, state);
        }
    }

    return [
        state.getState.bind(state),
        state.setState.bind(state)
    ];
}