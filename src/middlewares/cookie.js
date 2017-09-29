import { SIGN_IN_SUCCESS, SIGN_UP_SUCCESS } from '../actions/responses'
import { EXIT } from '../actions/frontend'

export default store => next => action => {
    switch (action.type) {
        case SIGN_IN_SUCCESS:
        case SIGN_UP_SUCCESS:
            if (action.token)
                document.cookie = `token=${action.token}`
            break
        case EXIT:
            document.cookie = 'token=kek'
            break
    }

    next(action)
}