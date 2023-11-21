import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { TransaksiModel } from '../models/transaksiModel'

export const transaksiRouter = express.Router()

transaksiRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await TransaksiModel.find({})
    res.json(bebas)
  })
)

transaksiRouter.get(
  '/:ide',
  asyncHandler(async (req: Request, res: Response) => {
    const angene = await TransaksiModel.findById(req.params.ide)
    if (angene) {
      res.json(angene)
    } else {
      res.status(404).json({ message: 'Transaksi not found' })
    }
  })
)

transaksiRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const beudoang = req.body
    delete beudoang._id
    const justTransaksi = await TransaksiModel.create(beudoang)
    res.status(201).json(justTransaksi)
  })
)

transaksiRouter.put(
  '/:edi',
  asyncHandler(async (req: Request, res: Response) => {
    const {
      id_transaksi,
      status,
      total_harga,
      id_pelanggan,
      id_outlet,
      terhutang,
      id_harga,
    } = req.body

    const justHere = await TransaksiModel.findById(req.params.edi)

    if (justHere) {
      justHere.id_transaksi = id_transaksi || justHere.id_transaksi
      justHere.status = status || justHere.status
      justHere.total_harga = total_harga || justHere.total_harga
      justHere.id_pelanggan = id_pelanggan || justHere.id_pelanggan
      justHere.id_outlet = id_outlet || justHere.id_outlet
      justHere.terhutang = terhutang || justHere.terhutang
      justHere.id_harga = id_harga || justHere.id_harga

      const updatedTransaksi = await justHere.save()
      res.json(updatedTransaksi)
    } else {
      res.status(404).json({ message: 'Transaksi not found' })
    }
  })
)

transaksiRouter.delete(
  '/:idin',
  asyncHandler(async (req, res) => {
    const teneDwang = await TransaksiModel.findByIdAndDelete(req.params.idin)
    if (teneDwang) {
      res.json({ message: 'Transaksi deleted successfully' })
    } else {
      res.status(404).json({ message: 'Transaksi Not Found' })
    }
  })
)

export default transaksiRouter
