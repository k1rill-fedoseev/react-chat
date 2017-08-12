import * as io from 'socket.io-client'
import {dispatch} from '../store'

const socket = io(':3001', {
    transports: ['websocket']
});

socket.on('connect', () => {
    console.log("Success connection")
})

socket.on('message', (action) => {
    dispatch(action)
})

export default socket
//export const send = socket.send