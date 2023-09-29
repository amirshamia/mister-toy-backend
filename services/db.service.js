
import { MongoClient } from 'mongodb'
import { config } from '../config/index.js'
import { loggerService } from './logger.service.js'

export const dbService = {
	getCollection,
}

// Connection URL
const url = false && process.env.NODE_ENV === 'production' ? 'mongodb+srv://theDbUser:camay2019@cluster0-klgzh.mongodb.net/test?retryWrites=true&w=majority' : 'mongodb://localhost:27017'

// Database Name
const dbName = 'toy'

var dbConn = null

async function getCollection(collectionName) {
	const db = await _connect()
	return db.collection(collectionName)
}

async function _connect() {
	if (dbConn) return dbConn
	try {
		const client = await MongoClient.connect(url)
		const db = client.db(dbName)
		dbConn = db
		return db
	} catch (err) {
		console.log('Cannot Connect to DB', err)
		throw err
	}
}