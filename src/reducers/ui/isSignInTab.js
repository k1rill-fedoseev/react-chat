import { EXIT_CLICK, SWITCH_CLICK } from '../../actions/frontend'

export default (state = true, action) => {
    switch (action.type) {
        case SWITCH_CLICK:
            return !state
        case EXIT_CLICK:
            return true
        default:
            return state
    }
}