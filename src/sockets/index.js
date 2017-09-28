import * as io from 'socket.io-client'
import { dispatch } from '../store'
import { fetchOnlineUsers } from '../actions/requests'
import { getUserIds } from '../helpers/onlineController'

const fetchOnlineIfNeed = () => {
    const userIds = getUserIds()

    if(Object.keys(userIds).length)
        socket.send(fetchOnlineUsers(userIds))
}

const socket = io(':3001', {
    transports: ['websocket']
})

let intervalId

socket.on('connect', () => {
    console.log('Success connection')

    setTimeout(fetchOnlineIfNeed, 2000)
    intervalId = setInterval(fetchOnlineIfNeed, 60000)
})

socket.on('disconnect', () => {
    clearInterval(intervalId)
})

socket.on('message', (action) => {
    dispatch(action)
})

export default socket
//export const send = socket.send