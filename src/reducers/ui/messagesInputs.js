import { EXIT_CLICK, MESSAGE_INPUT_CHANGE, SEND_CLICK } from '../../actions/frontend'

export default (state = {}, action) => {
    switch (action.type) {
        case MESSAGE_INPUT_CHANGE:
            return {
                ...state,
                [action.selectedChat]: action.value
            }
        case SEND_CLICK:
            return {
                ...state,
                [action.selectedChat]: ''
            }
        case EXIT_CLICK:
            return {}
        default:
            return state
    }
}