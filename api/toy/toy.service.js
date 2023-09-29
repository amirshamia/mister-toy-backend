import fs from 'fs'
import { utilService } from '../../services/util.service.js'
import { dbService } from '../../services/db.service.js'

import _ from 'lodash'
import { loggerService } from '../../services/logger.service.js'

const toys = utilService.readJsonFile('data/toy.json')

export const toyService = {
    query,
    getById,
    remove,
    add,
    update
}
async function query(filterBy={}) {
    try {
        const criteria = {
            name: { $regex: filterBy.name, $options: 'i' },
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
            console.log(toyId);
    try {
        const collection = await dbService.getCollection('toys')
        const toy = collection.findOne({ _id: ObjectId(toyId) })
        return toy
    } catch (err) {
        loggerService.error(`while finding toy ${toyId}`, err)
        throw err
    }
}


    async function remove(toyId) {
        try {
            const collection = await dbService.getCollection('toys')
            await collection.deleteOne({ _id: ObjectId(toyId) })
        } catch (err) {
            loggerService.error(`cannot remove toy ${toyId}`, err)
            throw err
        }
    }


    async function add(toy) {
        try {
            const collection = await dbService.getCollection('toys')
            await collection.insertOne(toy)
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
            const collection = await dbService.getCollection('toys')
            await collection.updateOne({ _id: ObjectId(toy._id) }, { $set: toyToSave })
            return toy
        } catch (err) {
            loggerService.error(`cannot update toy ${toyId}`, err)
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
