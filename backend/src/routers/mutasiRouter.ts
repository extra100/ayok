import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { MutasiModel } from '../models/mutasiModel'

export const mutasiRouter = express.Router()

mutasiRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await MutasiModel.find({})
    res.json(bebas)
  })
)

mutasiRouter.get(
  '/:ide',
  asyncHandler(async (req: Request, res: Response) => {
    const angene = await MutasiModel.findById(req.params.ide)
    if (angene) {
      res.json(angene)
    } else {
      res.status(404).json({ message: 'Multiharga not found' })
    }
  })
)

mutasiRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const beudoang = req.body
    delete beudoang._id
    const justMultiharga = await MutasiModel.create(beudoang)
    res.status(201).json(justMultiharga)
  })
)

mutasiRouter.put(
  '/:edi',
  asyncHandler(async (req: Request, res: Response) => {
    const { id_mutasi, id_data_barang, dari, untuk, qty, tanggal, ket } =
      req.body

    const justHere = await MutasiModel.findById(req.params.edi)

    if (justHere) {
      justHere.id_mutasi = id_mutasi || justHere.id_mutasi
      justHere.id_data_barang = id_data_barang || justHere.id_data_barang
      justHere.dari = dari || justHere.dari
      justHere.untuk = untuk || justHere.untuk
      justHere.qty = qty || justHere.qty
      justHere.tanggal = tanggal || justHere.tanggal
      justHere.ket = ket || justHere.ket

      const updatedMultiharga = await justHere.save()
      res.json(updatedMultiharga)
    } else {
      res.status(404).json({ message: 'Multiharga not found' })
    }
  })
)

mutasiRouter.delete(
  '/:idin',
  asyncHandler(async (req, res) => {
    const teneDwang = await MutasiModel.findByIdAndDelete(req.params.idin)
    if (teneDwang) {
      res.json({ message: 'Multiharga deleted successfully' })
    } else {
      res.status(404).json({ message: 'Multiharga Not Found' })
    }
  })
)

export default mutasiRouter
