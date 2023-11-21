// import express, { Request, Response } from 'express'
// import asyncHandler from 'express-async-handler'
// import { ProductModel } from '../models/productModel'

// export const productRouter = express.Router()

// productRouter.get(
//   '/',
//   asyncHandler(async (req, res) => {
//     const products = await ProductModel.find()
//     res.json(products)
//   })
// )

// productRouter.get(
//   '/categories',
//   asyncHandler(async (req: Request, res: Response) => {
//     const categories = await ProductModel.find().distinct('satuan')
//     res.json(categories)
//   })
// )

// productRouter.get(
//   '/id_data_barang/:id_data_barang',
//   asyncHandler(async (req, res) => {
//     const product = await ProductModel.findOne({
//       id_data_barang: req.params.id_data_barang,
//     })
//     if (product) {
//       res.json(product)
//     } else {
//       res.status(404).json({ message: 'Product Not Found' })
//     }
//   })
// )
// productRouter.post(
//   '/',
//   asyncHandler(async (req, res) => {
//     const productData = req.body
//     delete productData._id // Menghapus atribut _id dari objek produk

//     const newProduct = await ProductModel.create(productData)
//     res.status(201).json(newProduct)
//   })
// )

// productRouter.put(
//   '/:id',
//   asyncHandler(async (req, res) => {
//     const product = await ProductModel.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     )
//     if (product) {
//       res.json(product)
//     } else {
//       res.status(404).json({ message: 'Product Not Found' })
//     }
//   })
// )
// productRouter.delete(
//   '/:id',
//   asyncHandler(async (req, res) => {
//     const product = await ProductModel.findByIdAndDelete(req.params.id)
//     if (product) {
//       res.json({ message: 'Product deleted successfully' })
//     } else {
//       res.status(404).json({ message: 'Product Not Found' })
//     }
//   })
// )

import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { ProductModel } from '../models/productModel'

export const productRouter = express.Router()

productRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    try {
      const products = await ProductModel.find()
      res.json(products)
    } catch (error) {
      console.error('Server Error:', error) // Menangani kesalahan server
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })
)

productRouter.get(
  '/categories',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const categories = await ProductModel.find().distinct('satuan')
      res.json(categories)
    } catch (error) {
      console.error('Server Error:', error) // Menangani kesalahan server
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })
)

productRouter.get(
  '/id_data_barang/:id_data_barang',
  asyncHandler(async (req, res) => {
    try {
      const product = await ProductModel.findOne({
        id_data_barang: req.params.id_data_barang,
      })
      if (product) {
        res.json(product)
      } else {
        res.status(404).json({ message: 'Product Not Found' })
      }
    } catch (error) {
      console.error('Server Error:', error) // Menangani kesalahan server
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })
)

productRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    try {
      const productData = req.body
      delete productData._id // Menghapus atribut _id dari objek produk

      const newProduct = await ProductModel.create(productData)
      res.status(201).json(newProduct)
    } catch (error) {
      console.error('Server Error:', error) // Menangani kesalahan server
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })
)

productRouter.put(
  '/:id',
  asyncHandler(async (req, res) => {
    try {
      const product = await ProductModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      )
      if (product) {
        res.json(product)
      } else {
        res.status(404).json({ message: 'Product Not Found' })
      }
    } catch (error) {
      console.error('Server Error:', error) // Menangani kesalahan server
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })
)

productRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    try {
      const product = await ProductModel.findByIdAndDelete(req.params.id)
      if (product) {
        res.json({ message: 'Product deleted successfully' })
      } else {
        res.status(404).json({ message: 'Product Not Found' })
      }
    } catch (error) {
      console.error('Server Error:', error) // Menangani kesalahan server
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })
)
