import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { HargaModel } from '../models/hargaModel'

export const hargaRouter = express.Router()

hargaRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await HargaModel.find({})
    res.json(bebas)
  })
)

hargaRouter.get(
  '/:ide',
  asyncHandler(async (req: Request, res: Response) => {
    const angene = await HargaModel.findById(req.params.ide)
    if (angene) {
      res.json(angene)
    } else {
      res.status(404).json({ message: 'Harga not found' })
    }
  })
)

hargaRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const beudoang = req.body
    delete beudoang._id
    const justHarga = await HargaModel.create(beudoang)
    res.status(201).json(justHarga)
  })
)

hargaRouter.put(
  '/:edi',
  asyncHandler(async (req: Request, res: Response) => {
    const { id_harga, jenis_harga } = req.body

    const justHere = await HargaModel.findById(req.params.edi)

    if (justHere) {
      justHere.id_harga = id_harga || justHere.id_harga
      justHere.jenis_harga = jenis_harga || justHere.jenis_harga

      const updatedHarga = await justHere.save()
      res.json(updatedHarga)
    } else {
      res.status(404).json({ message: 'Harga not found' })
    }
  })
)

hargaRouter.delete(
  '/:idin',
  asyncHandler(async (req, res) => {
    const teneDwang = await HargaModel.findByIdAndDelete(req.params.idin)
    if (teneDwang) {
      res.json({ message: 'Harga deleted successfully' })
    } else {
      res.status(404).json({ message: 'Harga Not Found' })
    }
  })
)

export default hargaRouter
