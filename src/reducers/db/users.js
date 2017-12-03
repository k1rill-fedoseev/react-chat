import {
    FETCH_ONLINE_USERS_SUCCESS, FETCH_USERS_SUCCESS, SIGN_IN_SUCCESS,
    SIGN_UP_SUCCESS, USER_INFO_UPDATED
} from '../../actions/responses'
import {
    EXIT_CLICK, USER_AVATAR, USER_DESCRIPTION
} from '../../actions/frontend'

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
            return {
                ...state,
                [action.user.id]: {
                    ...action.user,
                    online: true
                }
            }
        case FETCH_ONLINE_USERS_SUCCESS:
            newState = {...state}

            Object.keys(action.users).forEach(userId => {
                const user = state[userId]
                const isOnline = action.users[userId] === true
                const lastOnline = isOnline
                    ? user.lastOnline
                    : action.users[userId]

                if (state[userId] && (user.online !== isOnline || user.lastOnline !== lastOnline))
                    newState[userId] = {
                        ...user,
                        online: isOnline,
                        lastOnline
                    }
            })
            return newState
        case USER_INFO_UPDATED:
            switch (action.field) {
                case USER_AVATAR:
                    return {
                        ...state,
                        [action.loggedAccount]: {
                            ...state[action.loggedAccount],
                            avatar: action.value
                        }
                    }
                case USER_DESCRIPTION:
                    return {
                        ...state,
                        [action.loggedAccount]: {
                            ...state[action.loggedAccount],
                            description: action.value
                        }
                    }
                default:
                    return state
            }
        case EXIT_CLICK:
            return {}
        default:
            return state
    }
}