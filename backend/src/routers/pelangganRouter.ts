import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { PelangganModel } from '../models/pelangganModel'

export const pelangganRouter = express.Router()

pelangganRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const pelanggans = await PelangganModel.find({})
    res.json(pelanggans)
  })
)

pelangganRouter.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const pelanggan = await PelangganModel.findById(req.params.id)
    if (pelanggan) {
      res.json(pelanggan)
    } else {
      res.status(404).json({ message: 'Pelanggan not found' })
    }
  })
)

pelangganRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const pelangganData = req.body
    delete pelangganData._id
    const newPelanggan = await PelangganModel.create(pelangganData)
    res.status(201).json(newPelanggan)
  })
)

pelangganRouter.put(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const {
      id_pelanggan,
      id_outlet,
      type_kontak,
      id_harga,
      nama,
      perusahaan,
      rt,
      provinsi,
      kabupaten,
      kecamatan,
      desa,
      email,
      hp,
      pengenal,
      no_pengenal,
      npwp,
      koordinat,
      tanggal,
    } = req.body

    const pelanggan = await PelangganModel.findById(req.params.id)

    if (pelanggan) {
      pelanggan.id_pelanggan = id_pelanggan || pelanggan.id_pelanggan
      pelanggan.id_outlet = id_outlet || pelanggan.id_outlet
      pelanggan.type_kontak = type_kontak || pelanggan.type_kontak
      pelanggan.id_harga = id_harga || pelanggan.id_harga
      pelanggan.nama = nama || pelanggan.nama
      pelanggan.perusahaan = perusahaan || pelanggan.perusahaan
      pelanggan.rt = rt || pelanggan.rt
      pelanggan.provinsi = provinsi || pelanggan.provinsi
      pelanggan.kabupaten = kabupaten || pelanggan.kabupaten
      pelanggan.kecamatan = kecamatan || pelanggan.kecamatan
      pelanggan.desa = desa || pelanggan.desa
      pelanggan.email = email || pelanggan.email
      pelanggan.hp = hp || pelanggan.hp
      pelanggan.pengenal = pengenal || pelanggan.pengenal
      pelanggan.no_pengenal = no_pengenal || pelanggan.no_pengenal
      pelanggan.npwp = npwp || pelanggan.npwp
      pelanggan.koordinat = koordinat || pelanggan.koordinat
      pelanggan.tanggal = tanggal || pelanggan.tanggal

      const updatedPelanggan = await pelanggan.save()
      res.json(updatedPelanggan)
    } else {
      res.status(404).json({ message: 'Pelanggan not found' })
    }
  })
)

pelangganRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const pelanggan = await PelangganModel.findByIdAndDelete(req.params.id)
    if (pelanggan) {
      res.json({ message: 'Pelanggan deleted successfully' })
    } else {
      res.status(404).json({ message: 'Pelanggan Not Found' })
    }
  })
)

export default pelangganRouter
