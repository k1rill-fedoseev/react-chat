import { SIGN_IN_SUCCESS, SIGN_UP_SUCCESS } from '../../actions/responses'
import { EXIT } from '../../actions/frontend'

export default (state = '', action) => {
    switch (action.type) {
        case SIGN_IN_SUCCESS:
        case SIGN_UP_SUCCESS:
            return action.account.id
        case EXIT:
            return ''
        default:
            return state
    }
}