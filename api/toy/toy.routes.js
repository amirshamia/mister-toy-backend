import express from 'express'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getToys, getToyById, addToy, updateToy, removeToy, addToyMsg, removeToyMsg, addToyReview } from './toy.controller.js'

export const toyRoutes = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

toyRoutes.get('', log, getToys)
toyRoutes.get('/:id', getToyById)
toyRoutes.post('/', requireAuth,requireAdmin, addToy)
toyRoutes.put('/', updateToy)
toyRoutes.delete('/:id', requireAuth,requireAdmin, removeToy)
toyRoutes.post('/:id/msg', requireAuth, addToyMsg)
toyRoutes.post('/:id/review', requireAuth, addToyReview)


// router.delete('/:id', requireAuth, requireAdmin, removetoy)

// toyRoutes.post('/:id/msg', requireAuth, addtoyMsg)
// toyRoutes.delete('/:id/msg/:msgId', requireAuth, removetoyMsg)