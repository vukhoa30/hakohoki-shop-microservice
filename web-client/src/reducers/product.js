import { keys } from "../actions";

const { LOADING_PRODUCT, LOADING_PRODUCT_LIST } = keys

const initialState = {
  list: {
    isLoading: false,
    data: []
  },
  detail: {
    isLoading: false,
    name: null,
    category: null,
    description: null,
    price: 0,
    guarantee: 6,
    mainPicture: null,
    additionPicture: [],
    specifications: []
  }
};

const detailReducer = (prevState, action) => {
  const { isLoading } = action;
  if (isLoading) return { ...initialState.detail, isLoading };
  return { ...action, type: undefined };
};

const listReducer = (prevState, action) => {
  const { isLoading, needRefreshing, data } = action;
  if (isLoading)
    return needRefreshing
      ? { ...prevState, isLoading, data: [] }
      : { ...prevState, isLoading };
  return {
    isLoading,
    list: prevState.data.concat(data)
  };
};

const reducer = (state = initialState, action) => {
  let nextState = state;
  const { type } = action;

  switch (type) {
    case LOADING_PRODUCT:
      nextState = {
        ...state,
        detail: detailReducer(state.detail, action)
      };
      break;
    case LOADING_PRODUCT_LIST:
      nextState = {
        ...state,
        list: listReducer(state.list, action)
      };
      break;
  }

  return nextState;
};

export default reducer;
