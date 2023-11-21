import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { CicilanModel } from '../models/cicilanModel'

export const cicilanRouter = express.Router()

cicilanRouter.get(
  '/:die',
  asyncHandler(async (req: Request, res: Response) => {
    const cicilans = await CicilanModel.find({ id_pos: req.params.die })
    if (cicilans && cicilans.length > 0) {
      res.json(cicilans)
    } else {
      res.status(404).json({ message: 'Pos not found' })
    }
  })
)

cicilanRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const cicilanData = req.body
    delete cicilanData._id
    const newCicilan = await CicilanModel.create(cicilanData)
    res.status(201).json(newCicilan)
  })
)

cicilanRouter.put(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { cicil, id_pos, tanggal, id_bank, piutang } = req.body

    const cicilan = await CicilanModel.findById(req.params.id)

    if (cicilan) {
      cicilan.cicil = cicil || cicilan.cicil
      cicilan.id_pos = id_pos || cicilan.id_pos
      cicilan.tanggal = tanggal || cicilan.tanggal
      cicilan.id_bank = id_bank || cicilan.id_bank
      cicilan.piutang = piutang || cicilan.piutang

      const updatedCicilan = await cicilan.save()
      res.json(updatedCicilan)
    } else {
      res.status(404).json({ message: 'Supplier not found' })
    }
  })
)

cicilanRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const cicilan = await CicilanModel.findByIdAndDelete(req.params.id)
    if (cicilan) {
      res.json({ message: 'Supplier deleted successfully' })
    } else {
      res.status(404).json({ message: 'Supplier Not Found' })
    }
  })
)

export default cicilanRouter
