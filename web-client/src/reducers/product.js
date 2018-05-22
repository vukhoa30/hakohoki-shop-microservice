import { keys } from "../actions";

const {
  LOADING_PRODUCT,
  LOADING_PRODUCT_LIST,
  LOADING_PRODUCT_FEEDBACK
} = keys;

const initialState = {
  list: {
    isLoading: false,
    data: [],
    err: null
  },
  detail: {
    isLoading: false,
    _id: null,
    name: null,
    category: "All",
    description: null,
    price: 0,
    guarantee: 6,
    mainPicture: null,
    additionPicture: [],
    specifications: [],
    reviewScore: 0,
    reviewCount: 0,
    err: null
  },
  feedback: {
    isLoading: false,
    err: null,
    _id: null,
    comments: [],
    reviews: []
  }
};

const productDetailReducer = (prevState, action) => {
  const { isLoading, err, data } = action;
  if (isLoading) return { ...initialState.detail, isLoading };
  return err
    ? { ...prevState, isLoading, err }
    : { ...prevState, isLoading, ...data };
};

const productListReducer = (prevState, action) => {
  const { isLoading, needRefreshing, data, err } = action;
  if (isLoading)
    return needRefreshing
      ? { ...prevState, isLoading, data: [], err: null }
      : { ...prevState, isLoading, err: null };
  return err
    ? { ...prevState, isLoading, err }
    : {
        ...prevState,
        isLoading,
        data: prevState.data.concat(data)
      };
};

const feedbackReducer = (prevState, action) => {
  const { isLoading, err, comments, reviews, _id } = action;
  if (isLoading) return { ...initialState.feedback, isLoading, _id };
  return err
    ? { ...prevState, isLoading, err }
    : { ...prevState, isLoading, reviews, comments, _id };
};

const reducer = (state = initialState, action) => {
  let nextState = state;
  const { type } = action;

  switch (type) {
    case LOADING_PRODUCT:
      nextState = {
        ...state,
        detail: productDetailReducer(state.detail, action)
      };
      break;
    case LOADING_PRODUCT_LIST:
      nextState = {
        ...state,
        list: productListReducer(state.list, action)
      };
      break;
    case LOADING_PRODUCT_FEEDBACK:
      nextState = {
        ...state,
        feedback: feedbackReducer(state.feedback, action)
      };
      break;
  }

  return nextState;
};

export default reducer;
