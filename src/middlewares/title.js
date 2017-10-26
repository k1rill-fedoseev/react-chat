let intervalId
let status = false

const updateTitle = (status, newMessages) => {
    if (status)
        document.title = `${newMessages} new message${newMessages === 1
            ? ''
            : 's'}`
    else
        document.title = 'Messenger'
}

export default store => next => action => {
    const state = store.getState()

    next(action)

    const newState = store.getState()

    if (state.ui.newMessages !== newState.ui.newMessages) {
        clearInterval(intervalId)
        status = false

        if (newState.ui.newMessages) {
            status = true
            intervalId = setInterval(() => {
                status = !status
                updateTitle(status, newState.ui.newMessages)
            }, 1000)
        }
        updateTitle(status, newState.ui.newMessages)
    }
}