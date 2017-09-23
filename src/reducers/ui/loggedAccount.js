import { SIGN_IN_SUCCESS, SIGN_UP_SUCCESS } from '../../actions/responses'

export default (state = '', action) => {
    switch (action.type) {
        case SIGN_IN_SUCCESS:
        case SIGN_UP_SUCCESS:
            return action.account.id
        default:
            return state
    }
}