import { loggerService } from '../../services/logger.service.js'
import { socketService } from '../../services/socket.service.js'
import { toyService } from './toy.service.js'

export async function getToys(req, res) {
    try {
        const filterBy = {
            name: req.query.name || '',
            price: req.query.price || [0,500],
            label: req.query.label || ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle', 'Outdoor', 'Battery Powered'],
        }
        loggerService.debug('Getting toys', filterBy)
        const toys = await toyService.query(filterBy)
        res.json(toys)
    } catch (err) {
        loggerService.error('Failed to get toys', err)
        res.status(500).send({ err: 'Failed to get toys' })
    }
}

export async function getToyById(req, res) {
    try {
        const toyId = req.params.id
        const toy = await toyService.getById(toyId)
        res.json(toy)
    } catch (err) {
        loggerService.error('Failed to get toy', err)
        res.status(500).send({ err: 'Failed to get toy' })
    }
}

export async function addToy(req, res) {
    const { loggedinUser } = req

    try {
        const toy = req.body
        const addedToy = await toyService.add(toy)
        socketService.broadcast({ type: 'toy-added', data: addedToy, userId: loggedinUser._id })

        res.json(addedToy)
    } catch (err) {
        loggerService.error('Failed to add toy', err)
        res.status(500).send({ err: 'Failed to add toy' })
    }
}

export async function updateToy(req, res) {
    try {
        const toy = req.body
        loggerService.info(req.body)
        const updatedToy = await toyService.update(toy)
        res.json(updatedToy)
    } catch (err) {
        loggerService.error('Failed to update toy', err)
        res.status(500).send({ err: 'Failed to update toy' })
    }
}

export async function removeToy(req, res) {
    const { loggedinUser } = req

    try {
        const toyId = req.params.id
        await toyService.remove(toyId)
        socketService.broadcast({ type: 'toy-removed', data: toyId, userId: loggedinUser._id })

        res.send()
    } catch (err) {
        loggerService.error('Failed to remove toy', err)
        res.status(500).send({ err: 'Failed to remove toy' })
    }
}

export async function addToyMsg(req, res) {
    const { loggedinUser } = req
  const { _id, fullname } = loggedinUser
loggerService.info(req.body)
    try {
        const toyId = req.params.id
        const msg = {
            txt: req.body.txt,
            by: { _id, fullname },
            id: req.body.id
        }
        console.log(msg,'msg');
        const savedMsg = await toyService.addToyMsg(toyId, msg)
        res.json(savedMsg)
    } catch (err) {
        loggerService.error('Failed to update toy', err)
        res.status(500).send({ err: 'Failed to update toy' })
    }
}
export async function addToyReview(req, res) {
    const { loggedinUser } = req
  const { _id, fullname } = loggedinUser
    try {
        const toyId = req.params.id
        const review = {
            txt: req.body.txt,
            userId: req.body.userId,
            toyId: req.body.toyId
        }
        console.log(review,'review');
        const savedReview = await toyService.addToyReview(toyId, review)
        res.json(savedReview)
    } catch (err) {
        loggerService.error('Failed to update toy', err)
        res.status(500).send({ err: 'Failed to update toy' })
    }
}

export async function removeToyMsg(req, res) {
    const { loggedinUser } = req
    try {
        const toyId = req.params.id
        const { msgId } = req.params

        const removedId = await toyService.removetoyMsg(toyId, msgId)
        res.send(removedId)
    } catch (err) {
        loggerService.error('Failed to remove toy msg', err)
        res.status(500).send({ err: 'Failed to remove toy msg' })
    }
}