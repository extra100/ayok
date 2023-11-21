import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { SupplierModel } from '../models/supplierModel'

export const supplierRouter = express.Router()

// GET /api/suppliers
supplierRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const suppliers = await SupplierModel.find({})
    res.json(suppliers)
  })
)

// GET /api/suppliers/:id
supplierRouter.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const supplier = await SupplierModel.findById(req.params.id)
    if (supplier) {
      res.json(supplier)
    } else {
      res.status(404).json({ message: 'Supplier not found' })
    }
  })
)

supplierRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const supplierData = req.body
    delete supplierData._id // Menghapus atribut _id dari objek suppleir

    const newSupplier = await SupplierModel.create(supplierData)
    res.status(201).json(newSupplier)
  })
)

// POST /api/suppliers
// supplierRouter.post(
//   '/',
//   asyncHandler(async (req: Request, res: Response) => {
//     const { id_supplier, nama_supplier, alamat_supplier, kontak_supplier } =
//       req.body

//     const supplier = await SupplierModel.create({
//       id_supplier,
//       nama_supplier,
//       alamat_supplier,
//       kontak_supplier,
//     })

//     res.status(201).json(supplier)
//   })
// )

// PUT /api/suppliers/:id

supplierRouter.put(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const {
      id_supplier,
      nama_supplier,
      alamat_supplier,
      kontak_supplier,
      id_harga,
    } = req.body

    const supplier = await SupplierModel.findById(req.params.id)

    if (supplier) {
      supplier.id_supplier = id_supplier || supplier.id_supplier
      supplier.nama_supplier = nama_supplier || supplier.nama_supplier
      supplier.alamat_supplier = alamat_supplier || supplier.alamat_supplier
      supplier.kontak_supplier = kontak_supplier || supplier.kontak_supplier
      supplier.id_harga = id_harga || supplier.id_harga

      const updatedSupplier = await supplier.save()
      res.json(updatedSupplier)
    } else {
      res.status(404).json({ message: 'Supplier not found' })
    }
  })
)

supplierRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const supplier = await SupplierModel.findByIdAndDelete(req.params.id)
    if (supplier) {
      res.json({ message: 'Supplier deleted successfully' })
    } else {
      res.status(404).json({ message: 'Supplier Not Found' })
    }
  })
)

export default supplierRouter
