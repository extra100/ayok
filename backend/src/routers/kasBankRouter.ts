import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { KasBankModel } from '../models/kasBankModel'

export const kasBankRouter = express.Router()

kasBankRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await KasBankModel.find({})
    res.json(bebas)
  })
)

kasBankRouter.get(
  '/:ide',
  asyncHandler(async (req: Request, res: Response) => {
    const angene = await KasBankModel.findById(req.params.ide)
    if (angene) {
      res.json(angene)
    } else {
      res.status(404).json({ message: 'Bank not found' })
    }
  })
)

kasBankRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const beudoang = req.body
    delete beudoang._id
    const justBank = await KasBankModel.create(beudoang)
    res.status(201).json(justBank)
  })
)

kasBankRouter.put(
  '/:edi',
  asyncHandler(async (req: Request, res: Response) => {
    const { _id, nama_akun, kode_akun, kategori, deskripsi } = req.body

    const justHere = await KasBankModel.findById(req.params.edi)

    if (justHere) {
      justHere._id = _id || justHere._id
      justHere.nama_akun = nama_akun || justHere.nama_akun
      justHere.kode_akun = kode_akun || justHere.kode_akun
      justHere.kategori = kategori || justHere.kategori
      justHere.deskripsi = deskripsi || justHere.deskripsi

      const updatedBank = await justHere.save()
      res.json(updatedBank)
    } else {
      res.status(404).json({ message: 'Bank not found' })
    }
  })
)

kasBankRouter.delete(
  '/:idin',
  asyncHandler(async (req, res) => {
    const teneDwang = await KasBankModel.findByIdAndDelete(req.params.idin)
    if (teneDwang) {
      res.json({ message: 'Bank deleted successfully' })
    } else {
      res.status(404).json({ message: 'Bank Not Found' })
    }
  })
)

export default kasBankRouter
