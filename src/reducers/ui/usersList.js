import { SEARCH_USERS_SUCCESS } from '../../actions/responses'
import { EXIT } from '../../actions/frontend'

export default (state = [], action) => {
    switch (action.type) {
        case SEARCH_USERS_SUCCESS:
            return action.userIds
        case EXIT:
            return []
        default:
            return state
    }
}