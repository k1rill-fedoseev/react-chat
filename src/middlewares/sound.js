import { NEW_MESSAGE } from '../actions/responses'
const notification = new Audio('sounds/notification.mp3')

export default store => next => action => {
    switch(action.type) {
        case NEW_MESSAGE:
            notification.currentTime = 0
            notification.play()
            break
    }

    next(action)
}