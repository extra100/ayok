import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { AkunaModel } from '../models/akunaModel'

export const akunaRouter = express.Router()

akunaRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await AkunaModel.find({})
    res.json(bebas)
  })
)

akunaRouter.get(
  '/:ide',
  asyncHandler(async (req: Request, res: Response) => {
    const angene = await AkunaModel.findById(req.params.ide)
    if (angene) {
      res.json(angene)
    } else {
      res.status(404).json({ message: 'Akuna not found' })
    }
  })
)

akunaRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const beudoang = req.body
    delete beudoang._id
    const justAkuna = await AkunaModel.create(beudoang)
    res.status(201).json(justAkuna)
  })
)

akunaRouter.put(
  '/:edi',
  asyncHandler(async (req: Request, res: Response) => {
    const {
      id_akuna,
      id_outlet,
      kategori,
      akun,
      jumlah,
      ket,
      tag,
      pesan,
      tanggal,
      penerima,
    } = req.body

    const justHere = await AkunaModel.findById(req.params.edi)

    if (justHere) {
      justHere.id_akuna = id_akuna || justHere.id_akuna
      justHere.id_outlet = id_outlet || justHere.id_outlet
      justHere.kategori = kategori || justHere.kategori
      justHere.akun = akun || justHere.akun
      justHere.jumlah = jumlah || justHere.jumlah
      justHere.ket = ket || justHere.ket
      justHere.tag = tag || justHere.tag
      justHere.pesan = pesan || justHere.pesan
      justHere.tanggal = tanggal || justHere.tanggal
      justHere.penerima = penerima || justHere.penerima

      const updatedAkuna = await justHere.save()
      res.json(updatedAkuna)
    } else {
      res.status(404).json({ message: 'Akuna not found' })
    }
  })
)

akunaRouter.delete(
  '/:idin',
  asyncHandler(async (req, res) => {
    const teneDwang = await AkunaModel.findByIdAndDelete(req.params.idin)
    if (teneDwang) {
      res.json({ message: 'Akuna deleted successfully' })
    } else {
      res.status(404).json({ message: 'Akuna Not Found' })
    }
  })
)

export default akunaRouter
