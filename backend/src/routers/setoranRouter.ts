import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { SetoranModel } from '../models/setoranModel'

export const setoranRouter = express.Router()

setoranRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await SetoranModel.find({})
    res.json(bebas)
  })
)

setoranRouter.get(
  '/:ide',
  asyncHandler(async (req: Request, res: Response) => {
    const angene = await SetoranModel.findById(req.params.ide)
    if (angene) {
      res.json(angene)
    } else {
      res.status(404).json({ message: 'Setoran not found' })
    }
  })
)

setoranRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const beudoang = req.body
    delete beudoang._id
    const justSetoran = await SetoranModel.create(beudoang)
    res.status(201).json(justSetoran)
  })
)

setoranRouter.put(
  '/:edi',
  asyncHandler(async (req: Request, res: Response) => {
    const {
      id_setoran,
      id_outlet,
      tujuan_outlet,
      dari_akun,
      ke_akun,
      nilai,
      status,
      catatan,
      id_data_barang,
    } = req.body

    const justHere = await SetoranModel.findById(req.params.edi)

    if (justHere) {
      justHere.id_setoran = id_setoran || justHere.id_setoran
      justHere.id_outlet = id_outlet || justHere.id_outlet
      justHere.tujuan_outlet = tujuan_outlet || justHere.tujuan_outlet
      justHere.dari_akun = dari_akun || justHere.dari_akun
      justHere.ke_akun = ke_akun || justHere.ke_akun
      justHere.nilai = nilai || justHere.nilai
      justHere.status = status || justHere.status
      justHere.catatan = catatan || justHere.catatan
      justHere.id_data_barang = id_data_barang || justHere.id_data_barang

      const updatedSetoran = await justHere.save()
      res.json(updatedSetoran)
    } else {
      res.status(404).json({ message: 'Setoran not found' })
    }
  })
)

setoranRouter.delete(
  '/:idin',
  asyncHandler(async (req, res) => {
    const teneDwang = await SetoranModel.findByIdAndDelete(req.params.idin)
    if (teneDwang) {
      res.json({ message: 'Setoran deleted successfully' })
    } else {
      res.status(404).json({ message: 'Setoran Not Found' })
    }
  })
)

export default setoranRouter
