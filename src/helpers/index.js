const getLastMessageTime = (state, chatId) => {
    const messagesList = state.ui.messagesLists[chatId]

    if(messagesList.length === 0)
        return 0
    return state.db.messages[messagesList[messagesList.length - 1]].time
}

export const compare = state =>
    (a, b) => getLastMessageTime(state, b) - getLastMessageTime(state, a)

export const parseMs = (ms) => {
    ms /= 1000
    if (ms < 30)
        return 'now'
    else if (ms < 3600)
        return Math.round(ms / 60) + ' min'
    else if (ms < 86400)
        return Math.round(ms / 3600) + ' hrs'
    else {
        let days = Math.round(ms / 86400)
        if (days === 1)
            return '1 day'
        return days + ' days'
    }
}