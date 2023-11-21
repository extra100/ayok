import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { MultiModel } from '../models/multiModel'

export const multiRouter = express.Router()

multiRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await MultiModel.find({})
    res.json(bebas)
  })
)

multiRouter.get(
  '/:ide',
  asyncHandler(async (req: Request, res: Response) => {
    const angene = await MultiModel.findById(req.params.ide)
    if (angene) {
      res.json(angene)
    } else {
      res.status(404).json({ message: 'Multiharga not found' })
    }
  })
)

multiRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const beudoang = req.body
    delete beudoang._id
    const justMultiharga = await MultiModel.create(beudoang)
    res.status(201).json(justMultiharga)
  })
)

multiRouter.put(
  '/:edi',
  asyncHandler(async (req: Request, res: Response) => {
    const {
      id_data_barang,
      id_harga,
      harga_terendah,
      harga_tertinggi,
      id_multi,
    } = req.body

    const justHere = await MultiModel.findById(req.params.edi)

    if (justHere) {
      justHere.id_data_barang = id_data_barang || justHere.id_data_barang
      justHere.id_harga = id_harga || justHere.id_harga
      justHere.harga_terendah = harga_terendah || justHere.harga_terendah
      justHere.harga_tertinggi = harga_tertinggi || justHere.harga_tertinggi
      justHere.id_multi = id_multi || justHere.id_multi

      const updatedMultiharga = await justHere.save()
      res.json(updatedMultiharga)
    } else {
      res.status(404).json({ message: 'Multiharga not found' })
    }
  })
)

multiRouter.delete(
  '/:idin',
  asyncHandler(async (req, res) => {
    const teneDwang = await MultiModel.findByIdAndDelete(req.params.idin)
    if (teneDwang) {
      res.json({ message: 'Multiharga deleted successfully' })
    } else {
      res.status(404).json({ message: 'Multiharga Not Found' })
    }
  })
)

export default multiRouter
