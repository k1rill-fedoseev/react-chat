import {
    NEW_CLICK, SWAP_CLICK, INVITE_ACCEPT_CLICK,
    USER_SELECT
} from '../../actions/frontend'

export default (state = {}, action) => {
    switch (action.type) {
        case NEW_CLICK:
        case SWAP_CLICK:
        case INVITE_ACCEPT_CLICK:
            return {}
        case USER_SELECT:
            if (action.newChatTab && !action.isRoomCreateTab)
                return {[action.userId]: true}

            const stateCopy = {...state}

            if (stateCopy[action.userId])
                delete stateCopy[action.userId]
            else
                stateCopy[action.userId] = true

            return stateCopy
        default:
            return state
    }
}