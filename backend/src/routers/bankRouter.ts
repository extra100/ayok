import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { BankModel } from '../models/akunBankModel'

export const bankRouter = express.Router()

bankRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await BankModel.find({})
    res.json(bebas)
  })
)

bankRouter.get(
  '/:ide',
  asyncHandler(async (req: Request, res: Response) => {
    const angene = await BankModel.findById(req.params.ide)
    if (angene) {
      res.json(angene)
    } else {
      res.status(404).json({ message: 'Bank not found' })
    }
  })
)

bankRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const beudoang = req.body
    delete beudoang._id
    const justBank = await BankModel.create(beudoang)
    res.status(201).json(justBank)
  })
)

bankRouter.put(
  '/:edi',
  asyncHandler(async (req: Request, res: Response) => {
    const { id_bank, nama_bank, no_rekening, ket } = req.body

    const justHere = await BankModel.findById(req.params.edi)

    if (justHere) {
      justHere.id_bank = id_bank || justHere.id_bank
      justHere.nama_bank = nama_bank || justHere.nama_bank
      justHere.no_rekening = no_rekening || justHere.no_rekening
      justHere.ket = ket || justHere.ket

      const updatedBank = await justHere.save()
      res.json(updatedBank)
    } else {
      res.status(404).json({ message: 'Bank not found' })
    }
  })
)

bankRouter.delete(
  '/:idin',
  asyncHandler(async (req, res) => {
    const teneDwang = await BankModel.findByIdAndDelete(req.params.idin)
    if (teneDwang) {
      res.json({ message: 'Bank deleted successfully' })
    } else {
      res.status(404).json({ message: 'Bank Not Found' })
    }
  })
)

export default bankRouter
