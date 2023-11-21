import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { KategoriAkunModel } from '../models/kategoriAkunModel'

export const kategoriAkunRouter = express.Router()

kategoriAkunRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await KategoriAkunModel.find({})
    res.json(bebas)
  })
)

kategoriAkunRouter.get(
  '/:ide',
  asyncHandler(async (req: Request, res: Response) => {
    const angene = await KategoriAkunModel.findById(req.params.ide)
    if (angene) {
      res.json(angene)
    } else {
      res.status(404).json({ message: 'KategoriAkun not found' })
    }
  })
)

kategoriAkunRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const beudoang = req.body
    delete beudoang._id
    const justKategoriAkun = await KategoriAkunModel.create(beudoang)
    res.status(201).json(justKategoriAkun)
  })
)

kategoriAkunRouter.put(
  '/:edi',
  asyncHandler(async (req: Request, res: Response) => {
    const { _id, kode_kategori_akun, kategori } = req.body

    const justHere = await KategoriAkunModel.findById(req.params.edi)

    if (justHere) {
      justHere._id = _id || justHere._id
      justHere.kode_kategori_akun =
        kode_kategori_akun || justHere.kode_kategori_akun

      justHere.kategori = kategori || justHere.kategori

      const updatedKategoriAkun = await justHere.save()
      res.json(updatedKategoriAkun)
    } else {
      res.status(404).json({ message: 'KategoriAkun not found' })
    }
  })
)

kategoriAkunRouter.delete(
  '/:idin',
  asyncHandler(async (req, res) => {
    const teneDwang = await KategoriAkunModel.findByIdAndDelete(req.params.idin)
    if (teneDwang) {
      res.json({ message: 'KategoriAkun deleted successfully' })
    } else {
      res.status(404).json({ message: 'KategoriAkun Not Found' })
    }
  })
)

export default kategoriAkunRouter
