import socket from '../sockets'
import { fetchOnlineUsers } from '../actions/requests'

const subscribers = {}
const lastUpdate = {}

const fetchIfNeed = () => {
    const keys = Object.keys(subscribers)

    if (keys.length)
        socket.send(fetchOnlineUsers(keys))

    return keys
}

let intervalId = setInterval(fetchIfNeed, 180000)
let timeoutId

export const subscribe = (userId, level = 0) => {
    subscribers[userId] |= 1 << level

    if (!timeoutId && (!lastUpdate[userId] || Date.now() - 180000 > lastUpdate[userId])){
        clearInterval(intervalId)
        timeoutId = setTimeout(() => {
            intervalId = setInterval(fetchIfNeed, 180000)
            timeoutId = 0

            const now = Date.now()
            const keys = fetchIfNeed()
            keys.forEach(userId => lastUpdate[userId] = now)
        }, 1000)
    }

}

export const unsubscribe = (userId, level = 0) => {
    subscribers[userId] ^= 1 << level
    if (!subscribers[userId])
        delete subscribers[userId]
}