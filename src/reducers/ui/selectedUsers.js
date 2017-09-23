import {
    NEW_CLICK, SWAP_CLICK, INVITE_ACCEPT_CLICK,
    USER_SELECT
} from '../../actions/frontend'

export default (state = [], action) => {
    switch (action.type) {
        case NEW_CLICK:
        case SWAP_CLICK:
        case INVITE_ACCEPT_CLICK:
            return []
        case USER_SELECT:
            if (action.isRoomCreateTab) {
                const index = state.indexOf(action.userId)
                const stateCopy = [...state]
                if (index > -1) {
                    stateCopy.splice(index, 1)
                    return stateCopy
                }
                stateCopy.push(action.userId)
                return stateCopy
            }
            return [action.userId]
        default:
            return state
    }
}