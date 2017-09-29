import {
    FETCH_ONLINE_USERS_SUCCESS, FETCH_USERS_SUCCESS, SIGN_IN_SUCCESS,
    SIGN_UP_SUCCESS
} from '../../actions/responses'
import { EXIT } from '../../actions/frontend'

export default (state = {}, action) => {
    let newState

    switch (action.type) {
        case FETCH_USERS_SUCCESS:
            newState = {...state}

            for (let user of action.users)
                newState[user.id] = user
            return newState
        case SIGN_IN_SUCCESS:
        case SIGN_UP_SUCCESS:
            return {[action.account.id]: action.account}
        case FETCH_ONLINE_USERS_SUCCESS:
            newState = {...state}

            for (let userId in action.users)
                if (state[userId] && state[userId].online !== action.users[userId])
                    newState[userId] = {...state[userId], online: action.users[userId]}
            return newState
        case EXIT:
            return {}
        default:
            return state
    }
}