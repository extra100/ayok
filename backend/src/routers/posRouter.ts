import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { PosModel } from '../models/posModel'
// import { v4 as uuidv4 } from 'uuid'

export const posRouter = express.Router()

// const generateNewIdPos = (): string => {
//   return uuidv4()
// }

posRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await PosModel.find({})
    res.json(bebas)
  })
)

posRouter.get(
  '/:id_pos',
  asyncHandler(async (req: Request, res: Response) => {
    const posData = await PosModel.find({ id_pos: req.params.id_pos })
    if (posData && posData.length > 0) {
      res.json(posData)
    } else {
      // If not found by id_pos, try finding by _id
      const posById = await PosModel.findById(req.params.id_pos)
      if (posById) {
        res.json(posById)
      } else {
        res.status(404).json({ message: 'Pos not found' })
      }
    }
  })
)

posRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const posData = req.body
    delete posData._id
    const existingInv = await PosModel.findOne({ inv: posData.inv })
    if (existingInv) {
      posData.id_pos = existingInv.id_pos
    } else {
      const existingPos = await PosModel.findOne({ id_pos: posData.id_pos })
      if (existingPos) {
        // const newIdPos = generateNewIdPos()
        // posData.id_pos = newIdPos
      }
    }

    const justPos = await PosModel.create(posData)
    res.status(201).json(justPos)
  })
)

posRouter.put(
  '/:eid',
  asyncHandler(async (req: Request, res: Response) => {
    let onlyHereSpos = await PosModel.findOne({ id_pos: req.params.eid })

    if (!onlyHereSpos) {
      onlyHereSpos = await PosModel.findById(req.params.eid)
    }

    if (onlyHereSpos) {
      const {
        _id,
        id_pos,
        id_data_barang,
        qty_sold,
        harga_jual,
        total,
        diskon,
        id_harga,
        inv,
        biji,
        id_outlet,
        id_satuan,
        id_pajak,
        jumlah_pajak,
        jenis_pajak,
        tag,
        // via,
      } = req.body

      onlyHereSpos.id_pos = id_pos || onlyHereSpos.id_pos
      onlyHereSpos._id = _id || onlyHereSpos._id
      onlyHereSpos.id_data_barang =
        id_data_barang || onlyHereSpos.id_data_barang
      onlyHereSpos.qty_sold = qty_sold || onlyHereSpos.qty_sold
      onlyHereSpos.harga_jual = harga_jual || onlyHereSpos.harga_jual
      onlyHereSpos.total = total || onlyHereSpos.total
      onlyHereSpos.diskon = diskon || onlyHereSpos.diskon
      onlyHereSpos.id_harga = id_harga || onlyHereSpos.id_harga
      onlyHereSpos.inv = inv || onlyHereSpos.inv
      onlyHereSpos.biji = biji || onlyHereSpos.biji
      onlyHereSpos.id_outlet = id_outlet || onlyHereSpos.id_outlet
      onlyHereSpos.id_satuan = id_satuan || onlyHereSpos.id_satuan
      onlyHereSpos.id_pajak = id_pajak || onlyHereSpos.id_pajak
      onlyHereSpos.jumlah_pajak = jumlah_pajak || onlyHereSpos.jumlah_pajak
      onlyHereSpos.jenis_pajak = jenis_pajak || onlyHereSpos.jenis_pajak
      onlyHereSpos.tag = tag || onlyHereSpos.tag
      // onlyHereSpos.via = via || onlyHereSpos.via

      const updatedPos = await onlyHereSpos.save()

      res.json(updatedPos)
    } else {
      res.status(404).json({ message: 'Pos not found' })
    }
  })
)

posRouter.delete(
  '/:idol',
  asyncHandler(async (req, res) => {
    const teneDwang = await PosModel.findByIdAndDelete(req.params.idol)
    if (teneDwang) {
      res.json({ message: 'Pos deleted successfully' })
    } else {
      res.status(404).json({ message: 'Pos Not Found' })
    }
  })
)

export default posRouter
