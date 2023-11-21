import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { ReturBeliModel } from '../models/ReturBeliModel'

export const returBeliRouter = express.Router()

returBeliRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await ReturBeliModel.find({})
    res.json(bebas)
  })
)

returBeliRouter.get(
  '/:id_beli',
  asyncHandler(async (req: Request, res: Response) => {
    const posData = await ReturBeliModel.find({ id_beli: req.params.id_beli })
    if (posData && posData.length > 0) {
      res.json(posData)
    } else {
      const posById = await ReturBeliModel.findById(req.params.id_beli)
      if (posById) {
        res.json(posById)
      } else {
        res.status(404).json({ message: 'Pos not found' })
      }
    }
  })
)

// returBeliRouter.post(
//   '/',
//   asyncHandler(async (req, res) => {
//     const posData = req.body
//     delete posData._id
//     const existingInv = await ReturBeliModel.findOne({ inv: posData.inv })
//     if (existingInv) {
//       posData.id_beli = existingInv.id_beli
//     } else {
//       const existingPos = await ReturBeliModel.findOne({ id_beli: posData.id_beli })
//       if (existingPos) {
//         // const newIdPos = generateNewIdPos()
//         // posData.id_beli = newIdPos
//       }
//     }

//     const justPos = await ReturBeliModel.create(posData)
//     res.status(201).json(justPos)
//   })
// )
returBeliRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const beudoang = req.body
    delete beudoang._id
    const justRetur = await ReturBeliModel.create(beudoang)
    res.status(201).json(justRetur)
  })
)
returBeliRouter.put(
  '/:eid',
  asyncHandler(async (req: Request, res: Response) => {
    let onlyHereSpos = await ReturBeliModel.findOne({ id_beli: req.params.eid })

    if (!onlyHereSpos) {
      onlyHereSpos = await ReturBeliModel.findById(req.params.eid)
    }

    if (onlyHereSpos) {
      const {
        _id,
        id_beli,
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
      onlyHereSpos.id_beli = id_beli || onlyHereSpos.id_beli

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

returBeliRouter.delete(
  '/:idol',
  asyncHandler(async (req, res) => {
    const teneDwang = await ReturBeliModel.findByIdAndDelete(req.params.idol)
    if (teneDwang) {
      res.json({ message: 'Pos deleted successfully' })
    } else {
      res.status(404).json({ message: 'Pos Not Found' })
    }
  })
)

export default returBeliRouter
