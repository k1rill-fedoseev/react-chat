const users = {}

export const subscribe = userId => {
    users[userId] = true
}

export const unsubscribe = userId => {
    delete users[userId]
}

export const getUserIds = () => {
    const userIds = []

    for(let key in users)
        userIds.push(key)

    return userIds
}