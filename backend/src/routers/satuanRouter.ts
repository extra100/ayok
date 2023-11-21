import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { SatuanModel } from '../models/satuanModel'

export const satuanRouter = express.Router()

satuanRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await SatuanModel.find({})
    res.json(bebas)
  })
)

satuanRouter.get(
  '/:die',
  asyncHandler(async (req: Request, res: Response) => {
    const angene = await SatuanModel.findById(req.params.die)
    if (angene) {
      res.json(angene)
    } else {
      res.status(404).json({ message: 'Satuan not found' })
    }
  })
)

satuanRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const beudoang = req.body
    delete beudoang._id
    const justSatuan = await SatuanModel.create(beudoang)
    res.status(201).json(justSatuan)
  })
)

satuanRouter.put(
  '/:eid',
  asyncHandler(async (req: Request, res: Response) => {
    const { id_satuan, nama_satuan } = req.body

    const onlyHereSsatuan = await SatuanModel.findById(req.params.eid)

    if (onlyHereSsatuan) {
      onlyHereSsatuan.id_satuan = id_satuan || onlyHereSsatuan.id_satuan
      onlyHereSsatuan.nama_satuan = nama_satuan || onlyHereSsatuan.nama_satuan

      const updatedSatuan = await onlyHereSsatuan.save()
      res.json(updatedSatuan)
    } else {
      res.status(404).json({ message: 'Satuan not found' })
    }
  })
)

satuanRouter.delete(
  '/:idol',
  asyncHandler(async (req, res) => {
    const teneDwang = await SatuanModel.findByIdAndDelete(req.params.idol)
    if (teneDwang) {
      res.json({ message: 'Satuan deleted successfully' })
    } else {
      res.status(404).json({ message: 'Satuan Not Found' })
    }
  })
)

export default satuanRouter
