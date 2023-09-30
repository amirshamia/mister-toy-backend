import { utilService } from '../../services/util.service.js'
import { dbService } from '../../services/db.service.js'

import _ from 'lodash'
import { loggerService } from '../../services/logger.service.js'
import { ObjectId } from 'mongodb'
import mongodb from 'mongodb'

const toys = utilService.readJsonFile('data/toy.json')

export const toyService = {
    query,
    getById,
    remove,
    add,
    update
}
async function query(filterBy = {}) {
    console.log(filterBy);
    const minPrice = +filterBy.price[0]
    const maxPrice = +filterBy.price[1]
    try {
        const criteria = {
            name: { $regex: filterBy.name, $options: 'i' },
            price: { $gt: minPrice, $lt: maxPrice },
            labels: { $in: filterBy.label }
        }
        const collection = await dbService.getCollection('toys')
        var toys = await collection.find(criteria).toArray()
        return toys
    } catch (err) {
        loggerService.error('cannot find toys', err)
        throw err
    }
}

async function getById(toyId) {
    try {
        loggerService.info(toyId)
        const collection = await dbService.getCollection('toys')
        const toy = collection.findOne({ _id:new ObjectId(toyId)})

        return toy
    } catch (err) {
        loggerService.error(`while finding toy ${toyId}`, err)
        throw err
    }
}


async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toys')
        loggerService.info(toyId)
        await collection.deleteOne({ _id: new ObjectId(toyId) })
    } catch (err) {
        loggerService.error(`cannot remove toy ${toyId}`, err)
        throw err
    }
}


async function add(toy) {
    try {
        const collection = await dbService.getCollection('toys')
        await collection.insertOne(toy)
        loggerService.info(toy)

        return toy
    } catch (err) {
        loggerService.error('cannot insert toy', err)
        throw err
    }
}

async function update(toy) {
    try {
        const toyToSave = {
            name: toy.name,
            price: toy.price,
            labels: toy.labels,
            inStock: toy.inStock,
            createdAt: toy.createdAt,
            img: toy.img
        }
        loggerService.info(toyToSave)
        const collection = await dbService.getCollection('toys')
        await collection.updateOne({ _id: new ObjectId(toy._Id) }, { $set: toyToSave })
        return toy
    } catch (err) {
        loggerService.error(`cannot update toy ${toy._Id}`, err)
        throw err
    }
}



function _makeId(length = 5) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
