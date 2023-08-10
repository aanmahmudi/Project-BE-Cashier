import express from "express"
import { index, store, update, show, destroy} from '../controllers/UserController.js'

var router = express.Router()

router.get('/', index)
router.post('/', store)
router.put('/:id', update)
router.get('/:id', show)
router.delete('/:id', destroy)

export default router
