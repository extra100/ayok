import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { PenjualanModel } from '../models/penjualanModel'

export const penjualanRouter = express.Router()

penjualanRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await PenjualanModel.find({})
    res.json(bebas)
  })
)

penjualanRouter.get(
  '/:die',
  asyncHandler(async (req: Request, res: Response) => {
    const angene = await PenjualanModel.find({ id_pos: req.params.die })
    if (angene && angene.length > 0) {
      res.json(angene)
    } else {
      res.status(404).json({ message: 'Pos not found' })
    }
  })
)

penjualanRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const beudoang = req.body
    delete beudoang._id
    const justPenjualan = await PenjualanModel.create(beudoang)
    res.status(201).json(justPenjualan)
  })
)

penjualanRouter.put(
  '/:eid',
  asyncHandler(async (req: Request, res: Response) => {
    console.log('Received PUT request for ID:', req.params.eid)

    let onlyHereSpos = await PenjualanModel.findOne({ id_pos: req.params.eid })

    if (!onlyHereSpos) {
      onlyHereSpos = await PenjualanModel.findById(req.params.eid)
    }

    if (onlyHereSpos) {
      const {
        _id,
        id_pos,
        total_semua,
        diskon,
        bayar,
        // kembalian,
        tanggal_mulai, // Ubah dari tanggal ke tanggal_mulai
        tanggal_akhir, // Tambahkan properti ini
        via,
        piutang,
        id_pelanggan,
        inv,
        selisih,
        id_harga,
        id_outlet,
        catatan,
        sub_total,
        nama,
      } = req.body

      onlyHereSpos.id_pos = id_pos || onlyHereSpos.id_pos
      onlyHereSpos._id = _id || onlyHereSpos._id

      onlyHereSpos.total_semua = total_semua || onlyHereSpos.total_semua
      onlyHereSpos.diskon = diskon || onlyHereSpos.diskon
      onlyHereSpos.bayar = bayar || onlyHereSpos.bayar
      // onlyHereSpos.kembalian = kembalian || onlyHereSpos.kembalian
      onlyHereSpos.tanggal_mulai = tanggal_mulai || onlyHereSpos.tanggal_mulai // Ubah dari tanggal ke tanggal_mulai
      onlyHereSpos.tanggal_akhir = tanggal_akhir || onlyHereSpos.tanggal_akhir // Tambahkan baris ini
      onlyHereSpos.via = via || onlyHereSpos.via
      onlyHereSpos.piutang = piutang || onlyHereSpos.piutang
      onlyHereSpos.id_pelanggan = id_pelanggan || onlyHereSpos.id_pelanggan
      onlyHereSpos.inv = inv || onlyHereSpos.inv
      onlyHereSpos.selisih = selisih || onlyHereSpos.selisih
      onlyHereSpos.id_harga = id_harga || onlyHereSpos.id_harga
      onlyHereSpos.id_outlet = id_outlet || onlyHereSpos.id_outlet
      onlyHereSpos.catatan = catatan || onlyHereSpos.catatan
      onlyHereSpos.sub_total = sub_total || onlyHereSpos.sub_total
      onlyHereSpos.nama = nama || onlyHereSpos.nama

      const updatedPos = await onlyHereSpos.save()

      res.json(updatedPos)
    } else {
      res.status(404).json({ message: 'Pos not found' })
    }
  })
)

// penjualanRouter.put(
//   '/:edi',

//   asyncHandler(async (req: Request, res: Response) => {
//     console.log('Received PUT request for ID:', req.params.aneh)

//     const {
//       id_pos,
//       total_semua,
//       diskon,
//       bayar,
//       kembalian,
//       tanggal_mulai, // Ubah dari tanggal ke tanggal_mulai
//       tanggal_akhir, // Tambahkan properti ini
//       via,
//       piutang,
//       id_pelanggan,
//       inv,
//       selisih,
//       id_harga,
//       id_outlet,
//     } = req.body
//     // console.log('Received PUT Data:', req.body)

//     const onlyHereSpos = await PenjualanModel.findById(req.params.edi)

//     if (onlyHereSpos) {
//       onlyHereSpos.id_pos = id_pos || onlyHereSpos.id_pos
//       onlyHereSpos.total_semua = total_semua || onlyHereSpos.total_semua
//       onlyHereSpos.diskon = diskon || onlyHereSpos.diskon
//       onlyHereSpos.bayar = bayar || onlyHereSpos.bayar
//       onlyHereSpos.kembalian = kembalian || onlyHereSpos.kembalian
//       onlyHereSpos.tanggal_mulai = tanggal_mulai || onlyHereSpos.tanggal_mulai // Ubah dari tanggal ke tanggal_mulai
//       onlyHereSpos.tanggal_akhir = tanggal_akhir || onlyHereSpos.tanggal_akhir // Tambahkan baris ini
//       onlyHereSpos.via = via || onlyHereSpos.via
//       onlyHereSpos.piutang = piutang || onlyHereSpos.piutang
//       onlyHereSpos.id_pelanggan = id_pelanggan || onlyHereSpos.id_pelanggan
//       onlyHereSpos.inv = inv || onlyHereSpos.inv
//       onlyHereSpos.selisih = selisih || onlyHereSpos.selisih
//       onlyHereSpos.id_harga = id_harga || onlyHereSpos.id_harga
//       onlyHereSpos.id_outlet = id_outlet || onlyHereSpos.id_outlet

//       const updatedPenjualan = await onlyHereSpos.save()
//       res.json(updatedPenjualan)
//     } else {
//       res.status(404).json({ message: 'Penjualan not found' })
//     }
//   })
// )

penjualanRouter.delete(
  '/:idin',
  asyncHandler(async (req, res) => {
    const teneDwang = await PenjualanModel.findByIdAndDelete(req.params.idin)
    if (teneDwang) {
      res.json({ message: 'Penjualan deleted successfully' })
    } else {
      res.status(404).json({ message: 'Penjualan Not Found' })
    }
  })
)

export default penjualanRouter
