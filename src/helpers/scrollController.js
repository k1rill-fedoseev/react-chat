const scrolls = {}

export const scroll = (chatId, position, maxPosition) => {
    scrolls[chatId] = {
        position,
        isEnd: maxPosition - position < 10
    }
}

export const getScrollInfo =
    chatId =>
        scrolls[chatId]
        ? scrolls[chatId]
        : {isEnd: true}