const path = require('path')
const gm = require('gm')
const fs = require('fs')
const crypto = require('crypto')
const config = require('../cfg')

const saveUserAvatar = (userId, avatar) => new Promise((resolve, reject) => {
    const relativePath = `users/${userId}/${crypto.randomBytes(5).toString('hex')}.jpg`
    const absolutePath = path.join(__dirname, '../../imagesStore' ,relativePath)

    gm(avatar)
        .noProfile()
        .resize(config.limits.avatarWidth, config.limits.avatarWidth, '!')
        .write(absolutePath, err => {
            err
                ? reject(err)
                : resolve(relativePath)
        })
})

const saveRoomAvatar = (roomId, avatar) => new Promise((resolve, reject) => {
    const relativePath = `rooms/${roomId}/${crypto.randomBytes(5).toString('hex')}.jpg`
    const absolutePath = path.join(__dirname, '../../imagesStore', relativePath)

    gm(avatar)
        .noProfile()
        .resize(config.limits.avatarWidth, config.limits.avatarWidth, '!')
        .write(absolutePath, err => {
            err
                ? reject(err)
                : resolve(relativePath)
        })
})

const saveRoomPhoto = (roomId, avatar) => new Promise((resolve, reject) => {
    const relativePath = `rooms/${roomId}/${crypto.randomBytes(5).toString('hex')}.jpg`
    const absolutePath = path.join(__dirname, '../../imagesStore', relativePath)

    gm(avatar)
        .noProfile()
        .resize(config.limits.maxImageWidth, config.limits.maxImageWidth, '>')
        .write(absolutePath, err => {
            err
                ? reject(err)
                : resolve(relativePath)
        })
})

const createUserDir = userId => new Promise((resolve, reject) => {
    const userPath = path.join(__dirname, `../../imagesStore/users/${userId}`)

    fs.mkdir(userPath, err => {
        err
            ? reject(err)
            : resolve()
    })
})

const createRoomDir = roomId => new Promise((resolve, reject) => {
    const roomPath = path.join(__dirname, `../../imagesStore/rooms/${roomId}`)

    fs.mkdir(roomPath, err => {
        err
            ? reject(err)
            : resolve()
    })
})

module.exports = {
    saveUserAvatar,
    saveRoomAvatar,
    saveRoomPhoto,
    createUserDir,
    createRoomDir
}