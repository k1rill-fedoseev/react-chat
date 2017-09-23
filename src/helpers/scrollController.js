const scrolls = {}

export const scroll = (chatId, position, maxPosition) => {
    scrolls[chatId] = {
        position,
        isEnd: position === maxPosition
    }
}

export const getInfo =
    chatId =>
        scrolls[chatId]
        ? scrolls[chatId]
        : {isEnd: true}