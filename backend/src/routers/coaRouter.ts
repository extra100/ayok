import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { CoaModel } from '../models/coamodel'

export const coaRouter = express.Router()

coaRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await CoaModel.find({})
    res.json(bebas)
  })
)

coaRouter.get(
  '/:ide',
  asyncHandler(async (req: Request, res: Response) => {
    const angene = await CoaModel.findById(req.params.ide)
    if (angene) {
      res.json(angene)
    } else {
      res.status(404).json({ message: 'Bank not found' })
    }
  })
)

coaRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const beudoang = req.body
    delete beudoang._id
    const justBank = await CoaModel.create(beudoang)
    res.status(201).json(justBank)
  })
)

coaRouter.put(
  '/:edi',
  asyncHandler(async (req: Request, res: Response) => {
    const { _id, nama_akun, kode_akun, kategori, deskripsi } = req.body

    const justHere = await CoaModel.findById(req.params.edi)

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

coaRouter.delete(
  '/:idin',
  asyncHandler(async (req, res) => {
    const teneDwang = await CoaModel.findByIdAndDelete(req.params.idin)
    if (teneDwang) {
      res.json({ message: 'Bank deleted successfully' })
    } else {
      res.status(404).json({ message: 'Bank Not Found' })
    }
  })
)

export default coaRouter
