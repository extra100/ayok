import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { JualModel } from '../models/jualModels'

export const JualRouter = express.Router()

JualRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await JualModel.find({})
    res.json(bebas)
  })
)

JualRouter.get(
  '/:ide',
  asyncHandler(async (req: Request, res: Response) => {
    const angene = await JualModel.findById(req.params.ide)
    if (angene) {
      res.json(angene)
    } else {
      res.status(404).json({ message: 'Jual not found' })
    }
  })
)

JualRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const beudoang = req.body
    delete beudoang._id
    const justJual = await JualModel.create(beudoang)
    res.status(201).json(justJual)
  })
)

JualRouter.put(
  '/:edi',
  asyncHandler(async (req: Request, res: Response) => {
    const { id_jual, id_data_barang } = req.body

    const justHere = await JualModel.findById(req.params.edi)

    if (justHere) {
      justHere.id_jual = id_jual || justHere.id_jual
      justHere.id_data_barang = id_data_barang || justHere.id_data_barang

      const updatedJual = await justHere.save()
      res.json(updatedJual)
    } else {
      res.status(404).json({ message: 'Jual not found' })
    }
  })
)

JualRouter.delete(
  '/:idin',
  asyncHandler(async (req, res) => {
    const teneDwang = await JualModel.findByIdAndDelete(req.params.idin)
    if (teneDwang) {
      res.json({ message: 'Jual deleted successfully' })
    } else {
      res.status(404).json({ message: 'Jual Not Found' })
    }
  })
)

export default JualRouter
