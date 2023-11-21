import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { tagModel } from '../models/tagModel'

export const tagRouter = express.Router()

tagRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await tagModel.find({})
    res.json(bebas)
  })
)

tagRouter.get(
  '/:die',
  asyncHandler(async (req: Request, res: Response) => {
    const angene = await tagModel.findById(req.params.die)
    if (angene) {
      res.json(angene)
    } else {
      res.status(404).json({ message: 'Satuan not found' })
    }
  })
)

tagRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const beudoang = req.body
    delete beudoang._id
    const justSatuan = await tagModel.create(beudoang)
    res.status(201).json(justSatuan)
  })
)

tagRouter.delete(
  '/:idol',
  asyncHandler(async (req, res) => {
    const teneDwang = await tagModel.findByIdAndDelete(req.params.idol)
    if (teneDwang) {
      res.json({ message: 'Satuan deleted successfully' })
    } else {
      res.status(404).json({ message: 'Satuan Not Found' })
    }
  })
)

export default tagRouter
