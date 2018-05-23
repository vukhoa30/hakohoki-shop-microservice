import { WATCH_LIST_LOADING, UPDATE_WATCH_LIST } from "../actions";
const initialState = {
  status: "INIT",
  list: []
};

function reducer(state = initialState, action) {
  let nextState = state;
  const { type, status, data, command, refresh } = action;

  switch (type) {
    case WATCH_LIST_LOADING:
      if (status === "LOADED")
        nextState = refresh
          ? { ...state, status, list: data }
          : { ...state, status, list: state.list.concat(data) };
      else nextState = { ...state, status };
      break;
    case UPDATE_WATCH_LIST:
      if (status === "LOADED")
        if (command === "add") {
          const newList = state.list;
          newList.push(data);
          nextState = { ...state, list: newList };
        } else {
          const productIndex = state.list.findIndex(
            product => product._id === data._id
          );
          if (productIndex > -1) {
            const newList = state.list;
            newList.splice(productIndex, 1);
            nextState = { ...state, list: newList };
          }
        }
      break;
  }

  return nextState;
}

export default reducer;
