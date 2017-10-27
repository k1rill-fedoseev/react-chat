import * as io from 'socket.io-client'
import { dispatch } from '../store'

const socket = process.env.NODE_ENV === 'development'
    ? io(':3001', {
        transports: ['websocket']
    })
    : io({
        transports: ['websocket']
    })

socket.on('connect', () => {
    console.log('Success connection')
})

socket.on('disconnect', () => {
    console.warn('Disconnected from server')
})

socket.on('message', dispatch)

export default socket