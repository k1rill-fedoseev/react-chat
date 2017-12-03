import { ATTACH_IMAGES, DELETE_ATTACHMENTS, EXIT_CLICK, SEND_CLICK } from '../../actions/frontend'

export default (state = {}, action) => {
    switch (action.type) {
        case ATTACH_IMAGES:
            if (state[action.selectedChat])
                return {
                    ...state,
                    [action.selectedChat]: [
                        ...state[action.selectedChat],
                        ...action.images
                    ]
                }

            return {
                ...state,
                [action.selectedChat]: action.images
            }
        case DELETE_ATTACHMENTS:
        case SEND_CLICK:
            return {
                ...state,
                [action.selectedChat]: []
            }
        case EXIT_CLICK:
            return {}
        default:
            return state
    }
}