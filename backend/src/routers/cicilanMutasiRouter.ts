import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { CicilanMutasiModel } from '../models/cicilanMutasiModel'

export const cicilanMutasiRouter = express.Router()

cicilanMutasiRouter.get(
  '/:die',
  asyncHandler(async (req: Request, res: Response) => {
    const cicilanmutasis = await CicilanMutasiModel.find({
      id_pos: req.params.die,
    })
    if (cicilanmutasis && cicilanmutasis.length > 0) {
      res.json(cicilanmutasis)
    } else {
      res.status(404).json({ message: 'Mutasi not found' })
    }
  })
)

cicilanMutasiRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    console.log('Handling POST request for cicilanmutasis')
    const cicilanMutasiData = req.body
    delete cicilanMutasiData._id
    const newCicilan = await CicilanMutasiModel.create(cicilanMutasiData)
    res.status(201).json(newCicilan)
  })
)

cicilanMutasiRouter.put(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const {
      id_pindah,
      qty_minta,
      qty_beri,
      sisa_minta,
      id_data_barang,
      id_outlet,
      id_outlet_tujuan,
      tanggal,
      ket,
    } = req.body

    const cicilan = await CicilanMutasiModel.findById(req.params.id)

    if (cicilan) {
      cicilan.id_pindah = id_pindah || cicilan.id_pindah
      cicilan.qty_minta = qty_minta || cicilan.qty_minta
      cicilan.qty_beri = qty_beri || cicilan.qty_beri
      cicilan.sisa_minta = sisa_minta || cicilan.sisa_minta
      cicilan.id_data_barang = id_data_barang || cicilan.id_data_barang
      cicilan.id_outlet = id_outlet || cicilan.id_outlet
      cicilan.id_outlet_tujuan = id_outlet_tujuan || cicilan.id_outlet_tujuan
      cicilan.tanggal = tanggal || cicilan.tanggal
      cicilan.ket = ket || cicilan.ket

      const updatedCicilan = await cicilan.save()
      res.json(updatedCicilan)
    } else {
      res.status(404).json({ message: 'Supplier not found' })
    }
  })
)

cicilanMutasiRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const cicilan = await CicilanMutasiModel.findByIdAndDelete(req.params.id)
    if (cicilan) {
      res.json({ message: 'Mutasi deleted successfully' })
    } else {
      res.status(404).json({ message: 'Mutasi Not Found' })
    }
  })
)

export default cicilanMutasiRouter
