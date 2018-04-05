import { FEEDBACK_LOADING, GET_ANSWERS } from "../../presenters/keys";

const initialState = {

    status: 'INIT',
    reviews: [],
    comments: [],
    currentCommentId: null,
    statistic: {
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0
    }

}

function reducer(state = initialState, action) {

    let nextState = state
    const { type, status, reviews, comments, commentID, comment, statistic } = action
    const { questions: currentQuestions, comments: currentComments } = state

    switch (type) {

        case FEEDBACK_LOADING:
            if (status === 'LOADED')
                nextState = { ...state, status, reviews, comments, statistic }
            else
                nextState = { ...state, status }
            break
        case GET_ANSWERS:
            nextState = { ...state, currentCommentId: commentID }
            break
    }

    return nextState

}

export default reducer