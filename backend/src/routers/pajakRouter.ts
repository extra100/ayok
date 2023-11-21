import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { PajakModel } from '../models/pajakModel'

export const pajakRouter = express.Router()

pajakRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await PajakModel.find({})
    res.json(bebas)
  })
)

pajakRouter.get(
  '/:ide',
  asyncHandler(async (req: Request, res: Response) => {
    const angene = await PajakModel.findById(req.params.ide)
    if (angene) {
      res.json(angene)
    } else {
      res.status(404).json({ message: 'Pajak not found' })
    }
  })
)

pajakRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const beudoang = req.body
    // delete beudoang._id
    const justPajak = await PajakModel.create(beudoang)
    res.status(201).json(justPajak)
  })
)

pajakRouter.put(
  '/:edi',
  asyncHandler(async (req: Request, res: Response) => {
    const { _id, id_pajak, jenis_pajak, jumlah_pajak } = req.body

    const justHere = await PajakModel.findById(req.params.edi)

    if (justHere) {
      justHere._id = _id || justHere._id
      justHere.id_pajak = id_pajak || justHere.id_pajak
      justHere.jenis_pajak = jenis_pajak || justHere.jenis_pajak
      justHere.jumlah_pajak = jumlah_pajak || justHere.jumlah_pajak

      const updatedPajak = await justHere.save()
      res.json(updatedPajak)
    } else {
      res.status(404).json({ message: 'Pajak not found' })
    }
  })
)

pajakRouter.delete(
  '/:idin',
  asyncHandler(async (req, res) => {
    const teneDwang = await PajakModel.findByIdAndDelete(req.params.idin)
    if (teneDwang) {
      res.json({ message: 'Pajak deleted successfully' })
    } else {
      res.status(404).json({ message: 'Pajak Not Found' })
    }
  })
)

export default pajakRouter
