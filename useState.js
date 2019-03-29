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

function useState(initialState) {
    const state = new State(initialState);

    return [
        state.getState.bind(state),
        state.setState.bind(state)
    ];
}