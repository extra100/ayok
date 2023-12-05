import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

import { v4 as uuidv4 } from 'uuid'
import { PesoModel } from '../models/pesoModel'

export const pesoRouter = express.Router()

const generateNewIdPembelian = (): string => {
  return uuidv4()
}

pesoRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await PesoModel.find({})
    res.json(bebas)
  })
)

pesoRouter.get(
  '/:id_peso',
  asyncHandler(async (req: Request, res: Response) => {
    const pembelianData = await PesoModel.find({
      id_peso: req.params.id_peso,
    })
    if (pembelianData && pembelianData.length > 0) {
      res.json(pembelianData)
    } else {
      // If not found by id_peso, try finding by _id
      const pembelianById = await PesoModel.findById(req.params.id_peso)
      if (pembelianById) {
        res.json(pembelianById)
      } else {
        res.status(404).json({ message: 'Pembelian not found' })
      }
    }
  })
)

pesoRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const pembelianData = req.body
    delete pembelianData._id
    const existingInv = await PesoModel.findOne({ inv: pembelianData.inv })
    if (existingInv) {
      pembelianData.id_peso = existingInv.id_peso
    } else {
      const existingPembelian = await PesoModel.findOne({
        id_peso: pembelianData.id_peso,
      })
      if (existingPembelian) {
        const newIdPembelian = generateNewIdPembelian()
        pembelianData.id_peso = newIdPembelian
      }
    }

    const justPembelian = await PesoModel.create(pembelianData)
    res.status(201).json(justPembelian)
  })
)

pesoRouter.put(
  '/:eid',
  asyncHandler(async (req: Request, res: Response) => {
    console.log()

    let pesot = await PesoModel.findOne({
      id_peso: req.params.eid,
    })

    if (!pesot) {
      pesot = await PesoModel.findById(req.params.eid)
    }

    if (pesot) {
      const {
        _id,
        id_peso,
        id_data_barang,
        qty_sold,
        harga_jual,
        total_semua,

        inv,

        id_outlet,
        tanggal,
        via,
      } = req.body

      pesot.id_peso = id_peso || pesot.id_peso
      pesot._id = _id || pesot._id
      pesot.id_data_barang = id_data_barang || pesot.id_data_barang
      pesot.qty_sold = qty_sold || pesot.qty_sold
      pesot.harga_jual = harga_jual || pesot.harga_jual
      pesot.total_semua = total_semua || pesot.total_semua

      pesot.inv = inv || pesot.inv

      pesot.id_outlet = id_outlet || pesot.id_outlet
      pesot.tanggal = tanggal || pesot.tanggal
      pesot.via = via || pesot.via

      const updatePeso = await pesot.save()

      res.json(updatePeso)
    } else {
      res.status(404).json({ message: 'Pembelian not found' })
    }
  })
)

pesoRouter.delete(
  '/:idol',
  asyncHandler(async (req, res) => {
    const teneDwang = await PesoModel.findByIdAndDelete(req.params.idol)
    if (teneDwang) {
      res.json({ message: 'Pembelian deleted successfully' })
    } else {
      res.status(404).json({ message: 'Pembelian Not Found' })
    }
  })
)

export default pesoRouter
