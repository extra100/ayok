import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { CicilanBeliModel } from '../models/cicilanBeli'

export const cicilanBeliRouter = express.Router()

cicilanBeliRouter.get(
  '/:die',
  asyncHandler(async (req: Request, res: Response) => {
    const cicilanBelis = await CicilanBeliModel.find({
      id_beli: req.params.die,
    })
    if (cicilanBelis && cicilanBelis.length > 0) {
      res.json(cicilanBelis)
    } else {
      res.status(404).json({ message: 'Pos not found' })
    }
  })
)

cicilanBeliRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    console.log('Handling POST request for cicilanBelis') // Logging here
    const cicilanBeliData = req.body
    delete cicilanBeliData._id
    const newCicilan = await CicilanBeliModel.create(cicilanBeliData)
    res.status(201).json(newCicilan)
  })
)

cicilanBeliRouter.put(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { cicil, id_beli, tanggal, id_bank, piutang } = req.body

    const cicilanBeli = await CicilanBeliModel.findById(req.params.id)

    if (cicilanBeli) {
      cicilanBeli.cicil = cicil || cicilanBeli.cicil
      cicilanBeli.id_beli = id_beli || cicilanBeli.id_beli
      cicilanBeli.tanggal = tanggal || cicilanBeli.tanggal
      cicilanBeli.id_bank = id_bank || cicilanBeli.id_bank
      cicilanBeli.piutang = piutang || cicilanBeli.piutang

      const updatedCicilan = await cicilanBeli.save()
      res.json(updatedCicilan)
    } else {
      res.status(404).json({ message: 'Supplier not found' })
    }
  })
)

cicilanBeliRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const cicilanBeli = await CicilanBeliModel.findByIdAndDelete(req.params.id)
    if (cicilanBeli) {
      res.json({ message: 'Supplier deleted successfully' })
    } else {
      res.status(404).json({ message: 'Supplier Not Found' })
    }
  })
)

export default cicilanBeliRouter
