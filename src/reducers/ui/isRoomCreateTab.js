import { SWAP_CLICK } from '../../actions/frontend'

export default (state = true, action) => {
    switch (action.type) {
        case SWAP_CLICK:
            return !state
        default:
            return state
    }
}