import { EXIT_CLICK, SWAP_CLICK } from '../../actions/frontend'

export default (state = true, action) => {
    switch (action.type) {
        case SWAP_CLICK:
            return !state
        case EXIT_CLICK:
            return false
        default:
            return state
    }
}