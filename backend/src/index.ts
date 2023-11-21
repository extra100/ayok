import cors from 'cors'
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import path from 'path'

import { keyRouter } from './routers/keyRouter'
import { orderRouter } from './routers/orderRouter'
import { productRouter } from './routers/productRouter'
// import { seedRouter } from './routers/seedRouter'
import { userRouter } from './routers/userRouter'
import { supplierRouter } from './routers/supplierRouter'
import { kindRouter } from './routers/kindRouter'
import { pelangganRouter } from './routers/pelangganRouter'
import { hargaRouter } from './routers/hargaRouter'
import { outletRouter } from './routers/outletRouter'
import { usahaRouter } from './routers/usahaRouter'
import { satuanRouter } from './routers/satuanRouter'
import { stokRouter } from './routers/stokRouter'
import { transaksiRouter } from './routers/transaksiRouter'

import posRouter from './routers/posRouter'
import setoranRouter from './routers/setoranRouter'
import bankRouter from './routers/bankRouter'
import penjualanRouter from './routers/penjualanRouter'
import multiRouter from './routers/multiRouter'
import cicilanRouter from './routers/cicilanRouter'
import mutasiRouter from './routers/mutasiRouter'
import pindahRouter from './routers/pindahRouter'
import kopiPindahRouter from './routers/kopiPindahRouter'
import beliRouter from './routers/beliRouter'
import tagRouter from './routers/tagRouter'
import pembelianRouter from './routers/pembelianRouter'
import cicilanBeliRouter from './routers/cicilanBeliRouter'
import returRouter from './routers/returRouter'
import pajakRouter from './routers/pajakRouter'
import pesoRouter from './routers/pesoRouter'
import returBeliRouter from './routers/returBeliRouter'
import typeKontakRouter from './routers/typeKontakRouter'
import approveBeliRouter from './routers/approveBeliRouter'
import coaRouter from './routers/coaRouter'
import kategoriAkunRouter from './routers/kategoriAkunRouter'
import kasBankRouter from './routers/kasBankRouter'
import akunaRouter from './routers/akunaRouter'

dotenv.config()
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost/tsmernamazonadb'
mongoose.set('strictQuery', true)
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to mongodb')
  })
  .catch(() => {
    console.log('error mongodb')
  })
const app = express()
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5173'],
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/products', productRouter)

app.use('/api/users', userRouter)
app.use('/api/orders', orderRouter)
// app.use('/api/seed', seedRouter)
app.use('/api/keys', keyRouter)

app.use('/api/suppliers', supplierRouter)
app.use('/api/kinds', kindRouter)
app.use('/api/pelanggans', pelangganRouter)
app.use('/api/hargas', hargaRouter)
app.use('/api/outlets', outletRouter)
app.use('/api/usahas', usahaRouter)
app.use('/api/satuans', satuanRouter)
app.use('/api/stoks', stokRouter)
app.use('/api/transaksis', transaksiRouter)

app.use('/api/poss', posRouter)
app.use('/api/setorans', setoranRouter)
app.use('/api/banks', bankRouter)
app.use('/api/pos', posRouter)
app.use('/api/penjualans', penjualanRouter)
app.use('/api/pembelians', pembelianRouter)
app.use('/api/multis', multiRouter)
app.use('/api/cicilans', cicilanRouter)
app.use('/api/mutasis', mutasiRouter)
app.use('/api/pindahs', pindahRouter)
app.use('/api/kopipindahs', kopiPindahRouter)
app.use('/api/belis', beliRouter)

app.use('/api/tages', tagRouter)

app.use('/api/cicilansBeli', cicilanBeliRouter)
app.use('/api/returs', returRouter)
app.use('/api/returbelis', returBeliRouter)
app.use('/api/approvebelis', approveBeliRouter)
app.use('/api/pajaks', pajakRouter)
app.use('/api/pesos', pesoRouter)
app.use('/api/typekontaks', typeKontakRouter)
app.use('/api/coas', coaRouter)
app.use('/api/kategoriAkuns', kategoriAkunRouter)
app.use('/api/kasbanks', kasBankRouter)
app.use('/api/akunas', akunaRouter)

console.log(path.join(__dirname, 'frontend/dist'))

app.use(express.static(path.join(__dirname, '../../frontend/dist')))
app.get('*', (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, '../../frontend/index.html'))
)

const PORT: number = parseInt((process.env.PORT || '4000') as string, 10)

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`)
})
