import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { KopiPindahModel } from '../models/kopiPindahModel'

export const kopiPindahRouter = express.Router()

kopiPindahRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await KopiPindahModel.find({})
    res.json(bebas)
  })
)

kopiPindahRouter.get(
  '/:id_pindah',
  asyncHandler(async (req: Request, res: Response) => {
    const pindahData = await KopiPindahModel.find({
      id_pindah: req.params.id_pindah,
    })
    if (pindahData && pindahData.length > 0) {
      res.json(pindahData)
    } else {
      // If not found by id_pindah, try finding by _id
      const pindahById = await KopiPindahModel.findById(req.params.id_pindah)
      if (pindahById) {
        res.json(pindahById)
      } else {
        res.status(404).json({ message: 'pindah not found' })
      }
    }
  })
)
// kopiPindahRouter.post(
//   '/',
//   asyncHandler(async (req, res) => {
//     const pindahData = req.body

//     const existingInv = await KopiPindahModel.findOne({ inv: pindahData.inv })
//     if (existingInv) {
//       pindahData._id = existingInv._id
//     } else {
//       const existingKopiPindah = await KopiPindahModel.findOne({
//         _id: pindahData._id,
//       })
//       if (existingKopiPindah) {
//         const newIdKopiPindah = generateNewIdKopiPindah()
//         pindahData._id = newIdKopiPindah
//       }
//     }

//     const justKopiPindah = await KopiPindahModel.create(pindahData)
//     res.status(201).json(justKopiPindah)
//   })
// )

kopiPindahRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const tete = req.body
    delete tete._id
    const leqTe = await KopiPindahModel.create(tete)
    res.status(201).json(leqTe)
  })
)

// kopiPindahRouter.put(
//   '/:eid',
//   asyncHandler(async (req: Request, res: Response) => {
//     let onlyHereSpindah = await KopiPindahModel.findOne({
//       id_pindah: req.params.eid,
//     })

//     if (!onlyHereSpindah) {
//       onlyHereSpindah = await KopiPindahModel.findById(req.params.eid)
//     }

//     if (onlyHereSpindah) {
//       const {
//         _id,
//         id_pindah,
//         id_data_barang,
//         qty_minta,
//         qty_beri,
//         sisa_minta,
//         id_outlet,
//         id_outlet_tujuan,
//         tanggal,
//       } = req.body

//       onlyHereSpindah.id_pindah = id_pindah || onlyHereSpindah.id_pindah
//       onlyHereSpindah._id = _id || onlyHereSpindah._id
//       onlyHereSpindxah.id_data_barang =
//         id_data_barang || onlyHereSpindah.id_data_barang
//       onlyHereSpindah.qty_minta = qty_minta || onlyHereSpindah.qty_minta
//       onlyHereSpindah.qty_beri = qty_beri || onlyHereSpindah.qty_beri
//       onlyHereSpindah.sisa_minta = sisa_minta || onlyHereSpindah.sisa_minta
//       onlyHereSpindah.id_outlet =
//         id_outlet || onlyHereSpindah.id_outlet

//       onlyHereSpindah.id_outlet_tujuan =
//         id_outlet_tujuan || onlyHereSpindah.id_outlet_tujuan
//       onlyHereSpindah.tanggal = tanggal || onlyHereSpindah.tanggal

//       const updatedKopiPindah = await onlyHereSpindah.save()

//       res.json(updatedKopiPindah)
//     } else {
//       res.status(404).json({ message: 'KopiPindah not found' })
//     }
//   })
// )

kopiPindahRouter.put(
  '/:eid',
  asyncHandler(async (req: Request, res: Response) => {
    let onlyHereSpindah = await KopiPindahModel.findOne({
      _id: req.params.eid,
    })

    if (!onlyHereSpindah) {
      onlyHereSpindah = await KopiPindahModel.findById(req.params.eid)
    }

    if (onlyHereSpindah) {
      const {
        _id,
        id_pindah,
        id_data_barang,
        qty_minta,
        qty_beri,
        id_outlet_dari,
        id_outlet_tujuan,
        tanggal,
      } = req.body

      onlyHereSpindah.id_pindah = id_pindah || onlyHereSpindah.id_pindah
      onlyHereSpindah._id = _id || onlyHereSpindah._id
      onlyHereSpindah.id_data_barang =
        id_data_barang || onlyHereSpindah.id_data_barang
      onlyHereSpindah.qty_minta = qty_minta || onlyHereSpindah.qty_minta
      onlyHereSpindah.qty_beri = qty_beri || onlyHereSpindah.qty_beri
      onlyHereSpindah.id_outlet_dari =
        id_outlet_dari || onlyHereSpindah.id_outlet_dari

      onlyHereSpindah.id_outlet_tujuan =
        id_outlet_tujuan || onlyHereSpindah.id_outlet_tujuan
      onlyHereSpindah.tanggal = tanggal || onlyHereSpindah.tanggal

      const updatedPindah = await onlyHereSpindah.save()

      res.json(updatedPindah)
    } else {
      res.status(404).json({ message: 'Pindah not found' })
    }
  })
)

// kopiPindahRouter.put(
//   '/',
//   asyncHandler(async (req, res) => {
//     const updatedKopiPindahArray: KopiPindah[] = req.body

//     const updatedKopiPindahPromises = updatedKopiPindahArray.map(
//       async (updatedKopiPindah) => {
//         try {
//           const onlyHereSpindah: KopiPindah | null =
//             await KopiPindahModel.findOne({
//               id_pindah: updatedKopiPindah.id_pindah,
//             })
//           if (!onlyHereSpindah) {
//             return null
//           }
//           Object.assign(onlyHereSpindah, updatedKopiPindah)
//           const updatedKopiPindahResult: KopiPindah | null =
//             await onlyHereSpindah.save()
//           return updatedKopiPindahResult
//         } catch (error) {
//           return null
//         }
//       }
//     )
//     const updatedKopiPindahResults = await Promise.all(
//       updatedKopiPindahPromises
//     )
//     const successfulUpdates = updatedKopiPindahResults.filter(
//       (result) => result !== null
//     )
//     res.json(successfulUpdates)
//   })
// )

kopiPindahRouter.delete(
  '/:idol',
  asyncHandler(async (req, res) => {
    const teneDwang = await KopiPindahModel.findByIdAndDelete(req.params.idol)
    if (teneDwang) {
      res.json({ message: 'KopiPindah deleted successfully' })
    } else {
      res.status(404).json({ message: 'KopiPindah Not Found' })
    }
  })
)

export default kopiPindahRouter
