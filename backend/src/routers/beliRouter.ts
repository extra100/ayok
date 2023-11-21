import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

// import { v4 as uuidv4 } from 'uuid'
import { BeliModel } from '../models/BeliModel'

export const beliRouter = express.Router()

// const generateNewIdPembelian = (): string => {
//   return uuidv4()
// }

beliRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await BeliModel.find({})
    res.json(bebas)
  })
)

beliRouter.get(
  '/:id_beli',
  asyncHandler(async (req: Request, res: Response) => {
    const pembelianData = await BeliModel.find({
      id_beli: req.params.id_beli,
    })
    if (pembelianData && pembelianData.length > 0) {
      res.json(pembelianData)
    } else {
      // If not found by id_beli, try finding by _id
      const pembelianById = await BeliModel.findById(req.params.id_beli)
      if (pembelianById) {
        res.json(pembelianById)
      } else {
        res.status(404).json({ message: 'Pembelian not found' })
      }
    }
  })
)

beliRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const pembelianData = req.body
    delete pembelianData._id
    const existingInv = await BeliModel.findOne({ inv: pembelianData.inv })
    if (existingInv) {
      pembelianData.id_beli = existingInv.id_beli
    } else {
      const existingPembelian = await BeliModel.findOne({
        id_beli: pembelianData.id_beli,
      })
      if (existingPembelian) {
        // const newIdPembelian = generateNewIdPembelian()
        // pembelianData.id_beli = newIdPembelian
      }
    }

    const justPembelian = await BeliModel.create(pembelianData)
    res.status(201).json(justPembelian)
  })
)

beliRouter.put(
  '/:eid',
  asyncHandler(async (req: Request, res: Response) => {
    let onlyHereBeli = await BeliModel.findOne({
      id_beli: req.params.eid,
    })

    if (!onlyHereBeli) {
      onlyHereBeli = await BeliModel.findById(req.params.eid)
    }

    if (onlyHereBeli) {
      const {
        _id,
        id_beli,
        id_data_barang,
        qty_sold,
        harga_jual,
        total,
        diskon,
        id_harga,
        inv,
        biji,
        id_outlet,
        id_pajak,
        jumlah_pajak,
        jenis_pajak,
        tag,
        sumber,
      } = req.body

      onlyHereBeli.id_beli = id_beli || onlyHereBeli.id_beli
      onlyHereBeli._id = _id || onlyHereBeli._id
      onlyHereBeli.id_data_barang =
        id_data_barang || onlyHereBeli.id_data_barang
      onlyHereBeli.qty_sold = qty_sold || onlyHereBeli.qty_sold
      onlyHereBeli.harga_jual = harga_jual || onlyHereBeli.harga_jual
      onlyHereBeli.total = total || onlyHereBeli.total
      onlyHereBeli.diskon = diskon || onlyHereBeli.diskon
      onlyHereBeli.id_harga = id_harga || onlyHereBeli.id_harga
      onlyHereBeli.inv = inv || onlyHereBeli.inv
      onlyHereBeli.biji = biji || onlyHereBeli.biji
      onlyHereBeli.id_outlet = id_outlet || onlyHereBeli.id_outlet
      onlyHereBeli.id_pajak = id_pajak || onlyHereBeli.id_pajak
      onlyHereBeli.jumlah_pajak = jumlah_pajak || onlyHereBeli.jumlah_pajak
      onlyHereBeli.jenis_pajak = jenis_pajak || onlyHereBeli.jenis_pajak
      onlyHereBeli.tag = tag || onlyHereBeli.tag
      onlyHereBeli.sumber = sumber || onlyHereBeli.sumber

      const updatedPembelian = await onlyHereBeli.save()

      res.json(updatedPembelian)
    } else {
      res.status(404).json({ message: 'Pembelian not found' })
    }
  })
)

beliRouter.delete(
  '/:idol',
  asyncHandler(async (req, res) => {
    const teneDwang = await BeliModel.findByIdAndDelete(req.params.idol)
    if (teneDwang) {
      res.json({ message: 'Pembelian deleted successfully' })
    } else {
      res.status(404).json({ message: 'Pembelian Not Found' })
    }
  })
)

export default beliRouter
