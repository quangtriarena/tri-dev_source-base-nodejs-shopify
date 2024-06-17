import express from 'express'

const router = express.Router()

router.use('/v1', (req, res) => {
    res.status(200).json({ message: 'Hello External route' })
})

export default router
