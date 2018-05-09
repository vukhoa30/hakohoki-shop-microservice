import {
  SELECT_PRODUCT,
  REMOVE_PRODUCT_SESSION,
  PUSH_NEW_FEEDBACK,
  REMOVE_FEEDBACK_SESSION,
  FEEDBACK_LOADING,
  FEEDBACK_LOADED,
  FEEDBACK_LOADING_FAILED
} from "../actions";

const initialState = {
  productId: null,
  status: "LOADING",
  reviews: [],
  questions: [],
  answers: [],
  statistic: {
    "5": 0,
    "4": 0,
    "3": 0,
    "2": 0,
    "1": 0
  }
};

const stack = [];

function reducer(state = initialState, action) {
  let nextState = state;
  const { type, reviews, questions, answers, productId, statistic } = action;

  switch (type) {
    case SELECT_PRODUCT: case PUSH_NEW_FEEDBACK:
      if (state.productId !== null) stack.push(state);
      nextState = { ...initialState, productId };
      break;
    case REMOVE_PRODUCT_SESSION: case REMOVE_FEEDBACK_SESSION:
      if (stack.length > 0) {
        nextState = stack.pop();
      }
      break;
    case FEEDBACK_LOADING:
      nextState = { ...state, status: "LOADING" };
      break;
    case FEEDBACK_LOADING_FAILED:
      nextState = { ...state, status: "LOADING_FAILED" };
      break;
    case FEEDBACK_LOADED:
      nextState = {
        ...state,
        status: "LOADED",
        reviews,
        questions,
        answers,
        statistic
      };
      break;
  }

  return nextState;
}

export default reducer;
