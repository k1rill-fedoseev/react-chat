import { SIGN_IN_SUCCESS, SIGN_UP_SUCCESS } from '../../actions/responses'
import { EXIT_CLICK } from '../../actions/frontend'

export default (state = '', action) => {
    switch (action.type) {
        case SIGN_IN_SUCCESS:
        case SIGN_UP_SUCCESS:
            return action.user.id
        case EXIT_CLICK:
            return ''
        default:
            return state
    }
}