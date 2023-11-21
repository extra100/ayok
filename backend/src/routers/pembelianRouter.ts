import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { PembelianModel } from '../models/pembelianModel'

export const pembelianRouter = express.Router()

pembelianRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await PembelianModel.find({})
    res.json(bebas)
  })
)

pembelianRouter.get(
  '/:die',
  asyncHandler(async (req: Request, res: Response) => {
    const angene = await PembelianModel.find({ id_beli: req.params.die })
    if (angene && angene.length > 0) {
      res.json(angene)
    } else {
      res.status(404).json({ message: 'Pos not found' })
    }
  })
)

pembelianRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const beudoang = req.body
    delete beudoang._id
    const justPenjualan = await PembelianModel.create(beudoang)
    res.status(201).json(justPenjualan)
  })
)

pembelianRouter.put(
  '/:eid',
  asyncHandler(async (req: Request, res: Response) => {
    console.log('Received PUT request for ID:', req.params.eid)

    let onlyHereSpos = await PembelianModel.findOne({ id_beli: req.params.eid })

    if (!onlyHereSpos) {
      onlyHereSpos = await PembelianModel.findById(req.params.eid)
    }

    if (onlyHereSpos) {
      const {
        _id,
        id_beli,
        total_semua,
        diskon,
        bayar,
        kembalian,
        tanggal_mulai,
        tanggal_akhir,
        via,
        piutang,
        id_supplier,
        inv,
        selisih,
        id_harga,
        id_outlet,
        catatan,
        sub_total,
        nama,
        sumber,
      } = req.body

      onlyHereSpos._id = _id || onlyHereSpos._id
      onlyHereSpos.id_beli = id_beli || onlyHereSpos.id_beli
      onlyHereSpos.total_semua = total_semua || onlyHereSpos.total_semua
      onlyHereSpos.diskon = diskon || onlyHereSpos.diskon
      onlyHereSpos.bayar = bayar || onlyHereSpos.bayar
      onlyHereSpos.kembalian = kembalian || onlyHereSpos.kembalian
      onlyHereSpos.tanggal_mulai = tanggal_mulai || onlyHereSpos.tanggal_mulai
      onlyHereSpos.tanggal_akhir = tanggal_akhir || onlyHereSpos.tanggal_akhir
      onlyHereSpos.via = via || onlyHereSpos.via
      onlyHereSpos.piutang = piutang || onlyHereSpos.piutang
      onlyHereSpos.id_supplier = id_supplier || onlyHereSpos.id_supplier
      onlyHereSpos.inv = inv || onlyHereSpos.inv
      onlyHereSpos.selisih = selisih || onlyHereSpos.selisih
      onlyHereSpos.id_harga = id_harga || onlyHereSpos.id_harga
      onlyHereSpos.id_outlet = id_outlet || onlyHereSpos.id_outlet
      onlyHereSpos.catatan = catatan || onlyHereSpos.catatan
      onlyHereSpos.sub_total = sub_total || onlyHereSpos.sub_total
      onlyHereSpos.nama = nama || onlyHereSpos.nama
      onlyHereSpos.sumber = sumber || onlyHereSpos.sumber

      const updatedPos = await onlyHereSpos.save()

      res.json(updatedPos)
    } else {
      res.status(404).json({ message: 'Pos not found' })
    }
  })
)

// pembelianRouter.put(
//   '/:edi',

//   asyncHandler(async (req: Request, res: Response) => {
//     console.log('Received PUT request for ID:', req.params.aneh)

//     const {
//       id_beli,
//       total_semua,
//       diskon,
//       bayar,
//       kembalian,
//       tanggal_mulai, // Ubah dari tanggal ke tanggal_mulai
//       tanggal_akhir, // Tambahkan properti ini
//       via,
//       piutang,
//       id_supplier,
//       inv,
//       selisih,
//       id_harga,
//       id_outlet,
//     } = req.body
//     // console.log('Received PUT Data:', req.body)

//     const onlyHereSpos = await PembelianModel.findById(req.params.edi)

//     if (onlyHereSpos) {
//       onlyHereSpos.id_beli = id_beli || onlyHereSpos.id_beli
//       onlyHereSpos.total_semua = total_semua || onlyHereSpos.total_semua
//       onlyHereSpos.diskon = diskon || onlyHereSpos.diskon
//       onlyHereSpos.bayar = bayar || onlyHereSpos.bayar
//       onlyHereSpos.kembalian = kembalian || onlyHereSpos.kembalian
//       onlyHereSpos.tanggal_mulai = tanggal_mulai || onlyHereSpos.tanggal_mulai // Ubah dari tanggal ke tanggal_mulai
//       onlyHereSpos.tanggal_akhir = tanggal_akhir || onlyHereSpos.tanggal_akhir // Tambahkan baris ini
//       onlyHereSpos.via = via || onlyHereSpos.via
//       onlyHereSpos.piutang = piutang || onlyHereSpos.piutang
//       onlyHereSpos.id_supplier = id_supplier || onlyHereSpos.id_supplier
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

pembelianRouter.delete(
  '/:idin',
  asyncHandler(async (req, res) => {
    const teneDwang = await PembelianModel.findByIdAndDelete(req.params.idin)
    if (teneDwang) {
      res.json({ message: 'Penjualan deleted successfully' })
    } else {
      res.status(404).json({ message: 'Penjualan Not Found' })
    }
  })
)

export default pembelianRouter
