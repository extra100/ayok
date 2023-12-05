import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { ApproveBeliModel } from '../models/approveBeliModel'

export const approveBeliRouter = express.Router()

approveBeliRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await ApproveBeliModel.find({})
    res.json(bebas)
  })
)

approveBeliRouter.get(
  '/:id_beli',
  asyncHandler(async (req: Request, res: Response) => {
    const posData = await ApproveBeliModel.find({ id_beli: req.params.id_beli })
    if (posData && posData.length > 0) {
      res.json(posData)
    } else {
      const posById = await ApproveBeliModel.findById(req.params.id_beli)
      if (posById) {
        res.json(posById)
      } else {
        res.status(404).json({ message: 'Pos not found' })
      }
    }
  })
)

// approveBeliRouter.post(
//   '/',
//   asyncHandler(async (req, res) => {
//     const posData = req.body
//     delete posData._id
//     const existingInv = await ApproveBeliModel.findOne({ inv: posData.inv })
//     if (existingInv) {
//       posData.id_beli = existingInv.id_beli
//     } else {
//       const existingPos = await ApproveBeliModel.findOne({ id_beli: posData.id_beli })
//       if (existingPos) {
//         // const newIdPos = generateNewIdPos()
//         // posData.id_beli = newIdPos
//       }
//     }

//     const justPos = await ApproveBeliModel.create(posData)
//     res.status(201).json(justPos)
//   })
// )
approveBeliRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const beudoang = req.body
    delete beudoang._id
    const justRetur = await ApproveBeliModel.create(beudoang)
    res.status(201).json(justRetur)
  })
)

// approveBeliRouter.put(
//   '/:eid',
//   asyncHandler(async (req: Request, res: Response) => {
//     let onlyHereSpos = await ApproveBeliModel.findOne({
//       id_beli: req.params.eid,
//     })

//     if (!onlyHereSpos) {
//       onlyHereSpos = await ApproveBeliModel.findById(req.params.eid)
//     }

//     if (onlyHereSpos) {
//       const {
//         _id,
//         id_beli,
//         id_data_barang,

//         harga_jual,
//         total,
//         diskon,
//         id_outlet,
//         id_satuan,
//         qty_diapprove,
//         uang_retur,
//       } = req.body

//       onlyHereSpos._id = _id || onlyHereSpos._id
//       onlyHereSpos.id_beli = id_beli || onlyHereSpos.id_beli

//       onlyHereSpos.id_data_barang =
//         id_data_barang || onlyHereSpos.id_data_barang

//       onlyHereSpos.harga_jual = harga_jual || onlyHereSpos.harga_jual
//       onlyHereSpos.total = total || onlyHereSpos.total
//       onlyHereSpos.diskon = diskon || onlyHereSpos.diskon
//       onlyHereSpos.id_outlet = id_outlet || onlyHereSpos.id_outlet
//       onlyHereSpos.id_satuan = id_satuan || onlyHereSpos.id_satuan
//       onlyHereSpos.qty_diapprove = qty_diapprove || onlyHereSpos.qty_diapprove
//       onlyHereSpos.uang_retur = uang_retur || onlyHereSpos.uang_retur

//       const updatedPos = await onlyHereSpos.save()

//       res.json(updatedPos)
//     } else {
//       res.status(404).json({ message: 'Pos not found' })
//     }
//   })
// )

approveBeliRouter.put(
  '/:eid',
  asyncHandler(async (req: Request, res: Response) => {
    let onlyHereBeli = await ApproveBeliModel.findOne({
      id_beli: req.params.eid,
    })

    if (!onlyHereBeli) {
      onlyHereBeli = await ApproveBeliModel.findById(req.params.eid)
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

      const updatedPembelian = await onlyHereBeli.save()

      res.json(updatedPembelian)
    } else {
      res.status(404).json({ message: 'Pembelian not found' })
    }
  })
)
approveBeliRouter.delete(
  '/:idol',
  asyncHandler(async (req, res) => {
    const teneDwang = await ApproveBeliModel.findByIdAndDelete(req.params.idol)
    if (teneDwang) {
      res.json({ message: 'Pos deleted successfully' })
    } else {
      res.status(404).json({ message: 'Pos Not Found' })
    }
  })
)

export default approveBeliRouter
