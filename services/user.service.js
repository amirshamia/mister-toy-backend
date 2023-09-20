import fs from 'fs'
import Cryptr from 'cryptr'
import { utilService } from './util.service.js'
const cryptr = new Cryptr('secret-puk-1234')

const users = utilService.readJsonFile('data/user.json')


export const userService = {
    query,
    getById,
    remove,
    save,
    checkLogin,
    getLoginToken,
    validateToken

}


function getLoginToken(user) {
    const str = JSON.stringify(user)
    const encryptedStr = cryptr.encrypt(str)
    return encryptedStr
}

function validateToken(token) {
    const str = cryptr.decrypt(token)
    const user = JSON.parse(str)
    return user
}


function checkLogin({ username, password }) {
    let user = users.find(user => user.username === username)
    if (user) {
        user = {
            _id: user._id,
            fullname: user.fullname,
            score: user.score
        }
        return Promise.resolve(user)
    }
    else return Promise.reject('Invalid login')

}

function query() {
    return Promise.resolve(users)
}

function getById(userId) {
    const user = users.find(user => user._id === userId)
    if (!user) return Promise.reject('User not found!')
    return Promise.resolve(user)
}

function remove(userId) {
    users = users.filter(user => user._id !== userId)
    return _saveUsersToFile()
    // return Promise.resolve('User removed')
}


function save(user) {
    let userToUpdate = user
    if (user._id) {
        userToUpdate = users.find(_user => user._id === _user._id)
        userToUpdate.score = user.score
    } else {
        userToUpdate._id = _makeId()
        users.push(userToUpdate)
    }
    return _saveUsersToFile().then(() => userToUpdate)
}


function _makeId(length = 5) {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        const usersStr = JSON.stringify(users, null, 4)
        fs.writeFile('data/user.json', usersStr, (err) => {
            if (err) {
                return console.log(err);
            }
            resolve()
        })
    })
}