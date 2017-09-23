import * as io from 'socket.io-client'
import { dispatch } from '../store'
import { fetchOnlineUsers } from '../actions/requests'
import { getUserIds } from '../helpers/onlineController'

const socket = io(':3001', {
    transports: ['websocket']
})

socket.on('connect', () => {
    console.log('Success connection')

    socket.send(fetchOnlineUsers(getUserIds()))
    setInterval(() => {
        socket.send(fetchOnlineUsers(getUserIds()))
    }, 30000)
})

socket.on('message', (action) => {
    dispatch(action)
})

export default socket
//export const send = socket.send