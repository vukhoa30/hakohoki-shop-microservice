import navigator from '../navigations'
const initialState = navigator.router.getStateForAction(navigator.router.getActionForPathAndParams('Main/Categories'));

const reducer = (state = initialState, action) => {
    const nextState = navigator.router.getStateForAction(action, state);

    // Simply return the original `state` if `nextState` is null or undefined.
    return nextState || state;
};

export default reducer