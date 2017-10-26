import { CLEAR_ERROR } from '../../actions/frontend'
import { ERROR } from '../../actions/responses'

export default (state = '', action) => {
    switch (action.type) {
        case CLEAR_ERROR:
            return ''
        case ERROR:
            console.error(`[${Date.now()}] ERROR ${action.requestType} : ${action.error}`)
            return 'ERROR ' + action.requestType + ': ' + action.error
        default:
            return state
    }
}