module.exports = {
    port: 3001,
    token: {
        size: 20,
        key: 'dfb3963626664b932d4dba14cc1bfe4478d7f0c8',
        maxCount: 10
    },
    cookie: {
        name: 'token'
    },
    messages: {
        startMessage: 'Send your messages here'
    },
    limits: {
        length: {
            username: {min: 1, max: 20},
            password: {min: 3, max: 128},
            name: {min: 2, max: 16},
            roomName: {min: 1, max: 30},
            surname: {min: 2, max: 16},
            avatar: {max: 256},
            description: {max: 256},
            message: {min: 1, max: 1024},
            search: {max: 256}
        },
        roomMaxUsers: 30,
        packetSize: 50
    }
}