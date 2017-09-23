import { SEARCH_USERS_SUCCESS } from '../../actions/responses'

export default (state = [], action) => {
    switch (action.type) {
        case SEARCH_USERS_SUCCESS:
            return action.userIds
        default:
            return state
    }
}