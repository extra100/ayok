import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { Pindah, PindahModel } from '../models/pindahModel'

export const pindahRouter = express.Router()

pindahRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await PindahModel.find({})
    res.json(bebas)
  })
)

// pindahRouter.get(
//   '/:die',
//   asyncHandler(async (req: Request, res: Response) => {
//     const angene = await PindahModel.findById(req.params.die)
//     if (angene) {
//       res.json(angene)
//     } else {
//       res.status(404).json({ message: 'Satuan not found' })
//     }
//   })
// )
pindahRouter.get(
  '/:id_pindah',
  asyncHandler(async (req: Request, res: Response) => {
    const pindahData = await PindahModel.find({
      id_pindah: req.params.id_pindah,
    })
    if (pindahData && pindahData.length > 0) {
      res.json(pindahData)
    } else {
      // If not found by id_pindah, try finding by _id
      const pindahById = await PindahModel.findById(req.params.id_pindah)
      if (pindahById) {
        res.json(pindahById)
      } else {
        res.status(404).json({ message: 'pindah not found' })
      }
    }
  })
)
// pindahRouter.post(
//   '/',
//   asyncHandler(async (req, res) => {
//     const pindahData = req.body

//     const existingInv = await PindahModel.findOne({ inv: pindahData.inv })
//     if (existingInv) {
//       pindahData._id = existingInv._id
//     } else {
//       const existingPindah = await PindahModel.findOne({
//         _id: pindahData._id,
//       })
//       if (existingPindah) {
//         const newIdPindah = generateNewIdPindah()
//         pindahData._id = newIdPindah
//       }
//     }

//     const justPindah = await PindahModel.create(pindahData)
//     res.status(201).json(justPindah)
//   })
// )

pindahRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const beudoang = req.body
    delete beudoang._id
    const justSatuan = await PindahModel.create(beudoang)
    res.status(201).json(justSatuan)
  })
)

pindahRouter.put(
  '/',
  asyncHandler(async (req, res) => {
    const updatedKopiPindahArray: Pindah[] = req.body

    const updatedKopiPindahPromises = updatedKopiPindahArray.map(
      async (updatedKopiPindah) => {
        try {
          const onlyHereSpindah: Pindah | null = await PindahModel.findOne({
            id_pindah: updatedKopiPindah.id_pindah,
          })
          if (!onlyHereSpindah) {
            return null
          }
          Object.assign(onlyHereSpindah, updatedKopiPindah)
          const updatedKopiPindahResult: Pindah | null =
            await onlyHereSpindah.save()
          return updatedKopiPindahResult
        } catch (error) {
          return null
        }
      }
    )
    const updatedKopiPindahResults = await Promise.all(
      updatedKopiPindahPromises
    )
    const successfulUpdates = updatedKopiPindahResults.filter(
      (result) => result !== null
    )
    res.json(successfulUpdates)
  })
)

// pindahRouter.put(
//   '/:eid',
//   asyncHandler(async (req: Request, res: Response) => {
//     let onlyHereSpindah = await PindahModel.findOne({
//       _id: req.params.eid,
//     })

//     if (!onlyHereSpindah) {
//       onlyHereSpindah = await PindahModel.findById(req.params.eid)
//     }

//     if (onlyHereSpindah) {
//       const {
//         _id,
//         id_pindah,
//         id_data_barang,
//         qty_minta,
//         qty_beri,
//         id_outlet,
//         id_outlet_tujuan,
//         tanggal,
//       } = req.body

//       onlyHereSpindah.id_pindah = id_pindah || onlyHereSpindah.id_pindah
//       onlyHereSpindah._id = _id || onlyHereSpindah._id
//       onlyHereSpindah.id_data_barang =
//         id_data_barang || onlyHereSpindah.id_data_barang
//       onlyHereSpindah.qty_minta = qty_minta || onlyHereSpindah.qty_minta
//       onlyHereSpindah.qty_beri = qty_beri || onlyHereSpindah.qty_beri
//       onlyHereSpindah.id_outlet =
//         id_outlet || onlyHereSpindah.id_outlet

//       onlyHereSpindah.id_outlet_tujuan =
//         id_outlet_tujuan || onlyHereSpindah.id_outlet_tujuan
//       onlyHereSpindah.tanggal = tanggal || onlyHereSpindah.tanggal

//       const updatedPindah = await onlyHereSpindah.save()

//       res.json(updatedPindah)
//     } else {
//       res.status(404).json({ message: 'Pindah not found' })
//     }
//   })
// )

pindahRouter.delete(
  '/:idol',
  asyncHandler(async (req, res) => {
    const teneDwang = await PindahModel.findByIdAndDelete(req.params.idol)
    if (teneDwang) {
      res.json({ message: 'Pindah deleted successfully' })
    } else {
      res.status(404).json({ message: 'Pindah Not Found' })
    }
  })
)

export default pindahRouter
