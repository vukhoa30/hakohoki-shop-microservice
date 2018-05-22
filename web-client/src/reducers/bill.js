import { keys } from "../actions";

const {
  LOADING_UPCOMING_BILL,
  SEARCHING_BILL,
  LOADING_COMPLETED_BILL,
  SELECT_BILL,
  CONFIRM_BILL,
  BILL_COMING,
  READ_BILL
} = keys;

const initialState = {
  upcoming: {
    isLoading: false,
    data: [],
    err: null
  },
  completed: {
    isLoading: false,
    data: [],
    err: null
  },
  search: {
    isLoading: false,
    data: [],
    err: null
  },
  selected: {
    isLoading: true,
    _id: null,
    err: null
  }
};

const handleData = (prevState, action) => {
  const { isLoading, data, err } = action;
  if (isLoading) return { isLoading, data: [], err: null };
  else if (err) return { ...prevState, isLoading, err };
  else
    return {
      ...prevState,
      isLoading,
      data: action.type === SEARCHING_BILL ? data : data.reverse()
    };
};

const selectBill = (prevState, action) => {
  const { isLoading, data, err } = action;
  if (isLoading) return { ...prevState, isLoading, err: null };
  else if (err) return { ...prevState, isLoading, err };
  else return { ...prevState, isLoading, ...data };
};

const reducer = (state = initialState, action) => {
  let nextState = state;
  const { type, data, billId } = action;
  switch (type) {
    case LOADING_UPCOMING_BILL:
      nextState = { ...state, upcoming: handleData(state.upcoming, action) };
      break;
    case LOADING_COMPLETED_BILL:
      nextState = { ...state, completed: handleData(state.completed, action) };
      break;
    case SEARCHING_BILL:
      nextState = { ...state, search: handleData(state.search, action) };
      break;
    case SELECT_BILL:
      nextState = { ...state, selected: selectBill(state.selected, action) };
      break;
    case READ_BILL:
      {
        const newList = state.upcoming.data;
        const billIndex = newList.findIndex(bill => bill._id === billId);
        if (billIndex > -1) {
          newList[billIndex].new = false;
          nextState = {
            ...state,
            upcoming: {
              ...state.upcoming,
              data: newList
            }
          };
        }
      }
      break;
    case BILL_COMING:
      if (!state.upcoming.isLoading) {
        const list = [data].concat(state.upcoming.data);
        nextState = { ...state, upcoming: { ...state.upcoming, data: list } };
      }
      break;
    case CONFIRM_BILL:
      const newUpcomingList = state.upcoming.data;
      const billIndex = state.upcoming.data.findIndex(
        bill => bill._id === billId
      );
      if (billIndex > -1) {
        const billDeletedArray = newUpcomingList.splice(billIndex, 1);
        if (billDeletedArray.length > 0) {
          const bill = billDeletedArray[0];
          const newCompletedList = [
            {
              ...bill,
              completedAt: new Date(),
              status: "completed"
            }
          ].concat(state.completed.data);
          nextState = {
            ...state,
            upcoming: {
              ...state.upcoming,
              data: newUpcomingList
            },
            completed: {
              ...state.completed,
              data: newCompletedList
            }
          };
        }
      }
  }
  return nextState;
};

export default reducer;
