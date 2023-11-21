import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { Stok, StokModel } from '../models/stokModel'
export const stokRouter = express.Router()
import Papa from 'papaparse'
import multer from 'multer'
import * as fs from 'fs'

const upload = multer({ dest: 'uploads/' })
stokRouter.post(
  '/import',
  upload.single('file'),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' })
      return
    }

    const filePath = req.file.path

    const fileContent = fs.readFileSync(filePath, 'utf8')

    Papa.parse(fileContent, {
      header: true,
      delimiter: ',',
      skipEmptyLines: true,
      complete: async (results) => {
        if (results.errors.length > 0) {
          res.status(500).json({ message: 'Error parsing CSV file' })
          return
        }
        try {
          for (const row of results.data as Stok[]) {
            // Assuming '_id' is the unique identifier in your data
            const existingStok = await StokModel.findOne({
              id_data_barang: row.id_data_barang,
            })

            if (existingStok) {
              // Update the existing record
              await StokModel.updateOne(
                { id_data_barang: row.id_data_barang },
                row
              )
            } else {
              // Insert a new record
              await StokModel.create(row)
            }
          }
          res.status(200).json({ message: 'Stok imported successfully' })
        } catch (error) {
          res.status(500).json({ message: 'Error importing data' })
        }
      },
    })
  })
)

stokRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await StokModel.find({})
    res.json(bebas)
  })
)

stokRouter.get(
  '/:ide',
  asyncHandler(async (req: Request, res: Response) => {
    const angene = await StokModel.findById(req.params.ide)
    if (angene) {
      res.json(angene)
    } else {
      res.status(404).json({ message: 'Stok not found' })
    }
  })
)

stokRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const beudoang = req.body
    delete beudoang._id
    const justStok = await StokModel.create(beudoang)
    res.status(201).json(justStok)
  })
)

stokRouter.put(
  '/:edi',
  asyncHandler(async (req: Request, res: Response) => {
    const { id_stok, jumlah_stok, id_data_barang, id_outlet, id_usaha } =
      req.body

    // Log data yang diterima dari frontend
    // console.log('Data yang diterima:', req.body)

    const justHere = await StokModel.findById(req.params.edi)

    if (justHere) {
      justHere.id_stok = id_stok || justHere.id_stok
      if (jumlah_stok !== undefined && jumlah_stok !== null) {
        justHere.jumlah_stok = jumlah_stok
      }

      justHere.id_data_barang = id_data_barang || justHere.id_data_barang
      justHere.id_outlet = id_outlet || justHere.id_outlet
      justHere.id_usaha = id_usaha || justHere.id_usaha

      const updatedStok = await justHere.save()

      // Log data yang disimpan ke database
      // console.log('Data setelah update:', updatedStok)

      res.json(updatedStok)
    } else {
      res.status(404).json({ message: 'Stok not found' })
    }
  })
)

stokRouter.delete(
  '/:idin',
  asyncHandler(async (req, res) => {
    const teneDwang = await StokModel.findByIdAndDelete(req.params.idin)
    if (teneDwang) {
      res.json({ message: 'Stok deleted successfully' })
    } else {
      res.status(404).json({ message: 'Stok Not Found' })
    }
  })
)

export default stokRouter
