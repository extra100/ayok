import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { KindModel } from '../models/kindModel'

export const kindRouter = express.Router()

// GET /api/kinds
kindRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const kinds = await KindModel.find({})
    res.json(kinds)
  })
)

// GET /api/kinds/:id
kindRouter.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const kind = await KindModel.findById(req.params.id)
    if (kind) {
      res.json(kind)
    } else {
      res.status(404).json({ message: 'Kategori not found' })
    }
  })
)

kindRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const kindData = req.body
    delete kindData._id // Menghapus atribut _id dari objek suppleir

    const newKind = await KindModel.create(kindData)
    res.status(201).json(newKind)
  })
)

// POST /api/kinds
// kindRouter.post(
//   '/',
//   asyncHandler(async (req: Request, res: Response) => {
//     const { id_supplier, nama_supplier, alamat_supplier, kontak_supplier } =
//       req.body

//     const kind = await KindModel.create({
//       id_supplier,
//       nama_supplier,
//       alamat_supplier,
//       kontak_supplier,
//     })

//     res.status(201).json(kind)
//   })
// )

// PUT /api/kinds/:id

kindRouter.put(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id_kategori, jenis_kategori } = req.body

    const kind = await KindModel.findById(req.params.id)

    if (kind) {
      kind.id_kategori = id_kategori || kind.id_kategori
      kind.jenis_kategori = jenis_kategori || kind.jenis_kategori

      const updatedKind = await kind.save()
      res.json(updatedKind)
    } else {
      res.status(404).json({ message: 'Supplier not found' })
    }
  })
)

kindRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const kind = await KindModel.findByIdAndDelete(req.params.id)
    if (kind) {
      res.json({ message: 'Supplier deleted successfully' })
    } else {
      res.status(404).json({ message: 'Supplier Not Found' })
    }
  })
)

export default kindRouter
