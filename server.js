import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { toyService } from './services/toy.service.js'
import { userService } from './services/user.service.js'
import { loggerService } from './services/logger.service.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express()


// App Configuration
const corsOptions = {
    origin: [
        'http://127.0.0.1:8080',
        'http://localhost:8080',
        'http://127.0.0.1:5173',
        'http://localhost:5173',
    ],
    credentials: true
}

app.use(cors(corsOptions))
app.use(cookieParser()) // for res.cookies
app.use(express.json()) // for req.body
app.use(express.static('public'))



// **************** toys API ****************:
// List
app.get('/api/toy', (req, res) => {
    const { name, price, label } = req.query
    const filterBy = { name, price, label }
    toyService.query(filterBy)
        .then(toys => {
            console.log(toys);
            res.send(toys)
        })
        .catch(err => {
            loggerService.error('Cannot load toys', err)
            res.status(400).send('Cannot load toys')
        })
})

// Add
app.post('/api/toy', (req, res) => {

    const { name, labels, price, inStock } = req.body

    const toy = {
        name,
        labels: labels,
        price: +price,
        inStock: inStock
    }
    toyService.save(toy)
        .then(savedtoy => {
            res.send(savedtoy)
        })
        .catch(err => {
            loggerService.error('Cannot add toy', err)
            res.status(400).send('Cannot add toy')
        })
})

// Edit
app.put('/api/toy', (req, res) => {
    // const loggedinUser = userService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot update toy')
    console.log(req.body);
    const { name, labels, price, _id, inStock, img } = req.body
    const toy = {
        _id,
        name,
        labels,
        price: +price,
        inStock,
        img
    }
    toyService.save(toy)
        .then((savedtoy) => {
            res.send(savedtoy)
        })
        .catch(err => {
            loggerService.error('Cannot update toy', err)
            res.status(400).send('Cannot update toy')
        })

})

// Read - getById
app.get('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params
    toyService.get(toyId)
        .then(toy => {
            // toy.msgs =['HEllo']
            res.send(toy)
        })
        .catch(err => {
            loggerService.error('Cannot get toy', err)
            res.status(400).send(err)
        })
})

// Remove
app.delete('/api/toy/:toyId', (req, res) => {
    // const loggedinUser = userService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot delete toy')

    const { toyId } = req.params
    toyService.remove(toyId)
        .then(msg => {
            res.send({ msg, toyId })
        })
        .catch(err => {
            loggerService.error('Cannot delete toy', err)
            res.status(400).send('Cannot delete toy, ' + err)
        })
})


// **************** Users API ****************:
app.get('/api/auth/:userId', (req, res) => {
    const { userId } = req.params
    userService.getById(userId)
        .then(user => {
            res.send(user)
        })
        .catch(err => {
            loggerService.error('Cannot get user', err)
            res.status(400).send('Cannot get user')
        })
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            const token = userService.getLoginToken(user)
            res.cookie('loginToken', token)
            res.send(user)
        })
        .catch(err => {
            loggerService.error('Cannot login', err)
            res.status(401).send('Not you!')
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
            const token = userService.getLoginToken(user)
            res.cookie('loginToken', token)
            res.send(user)
        })
        .catch(err => {
            loggerService.error('Cannot signup', err)
            res.status(401).send('Nope!')
        })
})


app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})


app.put('/api/user', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('No logged in user')
    const { diff } = req.body
    if (loggedinUser.score + diff < 0) return res.status(400).send('No credit')
    loggedinUser.score += diff
    return userService.save(loggedinUser).then(user => {
        const token = userService.getLoginToken(user)
        res.cookie('loginToken', token)
        res.send(user)
    })
})


app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})



// Listen will always be the last line in our server!
const port = 3030
app.listen(port, () => {
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
})