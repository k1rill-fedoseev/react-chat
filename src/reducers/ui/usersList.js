import { SEARCH_USERS_SUCCESS } from '../../actions/responses'
import { EXIT, INVITE_CLICK, NEW_CLICK } from '../../actions/frontend'

export default (state = [], action) => {
    switch (action.type) {
        case SEARCH_USERS_SUCCESS:
            return action.userIds
        case INVITE_CLICK:
        case NEW_CLICK:
        case EXIT:
            return []
        default:
            return state
    }
}