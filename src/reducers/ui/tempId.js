import { EXIT, SEND_CLICK } from '../../actions/frontend'

export default (state = 0, action) => {
    switch (action.type) {
        case SEND_CLICK:
            return state + 1
        case EXIT:
            return 0
        default:
            return state
    }
}