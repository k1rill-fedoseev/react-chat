import { SWITCH_CLICK } from '../../actions/frontend'

export default (state = true, action) => {
    switch (action.type) {
        case SWITCH_CLICK:
            return !state
        default:
            return state
    }
}