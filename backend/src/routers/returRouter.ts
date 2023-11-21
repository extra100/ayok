import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { ReturModel } from '../models/returModel'

export const returRouter = express.Router()

returRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await ReturModel.find({})
    res.json(bebas)
  })
)

returRouter.get(
  '/:id_pos',
  asyncHandler(async (req: Request, res: Response) => {
    const posData = await ReturModel.find({ id_pos: req.params.id_pos })
    if (posData && posData.length > 0) {
      res.json(posData)
    } else {
      const posById = await ReturModel.findById(req.params.id_pos)
      if (posById) {
        res.json(posById)
      } else {
        res.status(404).json({ message: 'Pos not found' })
      }
    }
  })
)

// returRouter.post(
//   '/',
//   asyncHandler(async (req, res) => {
//     const posData = req.body
//     delete posData._id
//     const existingInv = await ReturModel.findOne({ inv: posData.inv })
//     if (existingInv) {
//       posData.id_pos = existingInv.id_pos
//     } else {
//       const existingPos = await ReturModel.findOne({ id_pos: posData.id_pos })
//       if (existingPos) {
//         // const newIdPos = generateNewIdPos()
//         // posData.id_pos = newIdPos
//       }
//     }

//     const justPos = await ReturModel.create(posData)
//     res.status(201).json(justPos)
//   })
// )
returRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const beudoang = req.body
    delete beudoang._id
    const justRetur = await ReturModel.create(beudoang)
    res.status(201).json(justRetur)
  })
)
returRouter.put(
  '/:eid',
  asyncHandler(async (req: Request, res: Response) => {
    let onlyHereSpos = await ReturModel.findOne({ id_pos: req.params.eid })

    if (!onlyHereSpos) {
      onlyHereSpos = await ReturModel.findById(req.params.eid)
    }

    if (onlyHereSpos) {
      const {
        _id,
        id_pos,
        id_data_barang,

        harga_jual,
        total,
        diskon,
        id_outlet,
        id_satuan,
        qty_retur,
        uang_retur,
      } = req.body

      onlyHereSpos._id = _id || onlyHereSpos._id
      onlyHereSpos.id_pos = id_pos || onlyHereSpos.id_pos

      onlyHereSpos.id_data_barang =
        id_data_barang || onlyHereSpos.id_data_barang

      onlyHereSpos.harga_jual = harga_jual || onlyHereSpos.harga_jual
      onlyHereSpos.total = total || onlyHereSpos.total
      onlyHereSpos.diskon = diskon || onlyHereSpos.diskon
      onlyHereSpos.id_outlet = id_outlet || onlyHereSpos.id_outlet
      onlyHereSpos.id_satuan = id_satuan || onlyHereSpos.id_satuan
      onlyHereSpos.qty_retur = qty_retur || onlyHereSpos.qty_retur
      onlyHereSpos.uang_retur = uang_retur || onlyHereSpos.uang_retur

      const updatedPos = await onlyHereSpos.save()

      res.json(updatedPos)
    } else {
      res.status(404).json({ message: 'Pos not found' })
    }
  })
)

returRouter.delete(
  '/:idol',
  asyncHandler(async (req, res) => {
    const teneDwang = await ReturModel.findByIdAndDelete(req.params.idol)
    if (teneDwang) {
      res.json({ message: 'Pos deleted successfully' })
    } else {
      res.status(404).json({ message: 'Pos Not Found' })
    }
  })
)

export default returRouter
