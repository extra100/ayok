import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

import App from './App'
import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StoreProvider } from './Store'
import CartPage from './pages/CartPage'
import SignupPage from './pages/SignupPage'
import ShippingAddressPage from './pages/ShippingAddressPage'
import PaymentMethodPage from './pages/PaymentMethodPage'
import PlaceOrderPage from './pages/PlaceOrderPage'
import OrderPage from './pages/OrderPage'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

import ProfilePage from './pages/ProfilePage'
import SigninPage from './pages/SinginPage'
import ProtectedRoute from './components/protectedRoute'
import SupplierPage from './pages/supplier/SupplierPage'
import KindPage from './pages/KindPage'
import PelangganPage from './pages/pelanggan/PelangganPage'
import HargaPage from './pages/harga/HargaPage'
import OutletPage from './pages/outlet/OutletPage'
import SatuanPage from './pages/SatuanPage'
import UsahaPage from './pages/usaha/UsahaPage'
import StokPage from './pages/stok/StokPage'

import AddHargaForm from './pages/harga/AddHargaForm'
import AddSupplierForm from './pages/supplier/AddSupplierForm'

import AddSatuanForm from './pages/satuan/AddSatuanForm'
import AddOutletForm from './pages/outlet/AddOutletForm'
import AddPelangganForm from './pages/pelanggan/AddPelangganForm'
import AddStokForm from './pages/stok/AddStokForm'

import AddUsahaForm from './pages/usaha/AddUsahaForm'

import SetoranPage from './pages/setoran/SetoranPage'
import AddSetoranForm from './pages/setoran/AddSetoranForm'
import AddBankForm from './pages/bank/AddBankForm'
import BankPage from './pages/bank/BankPage'
import JualPage from './pages/jual/JualPage'

import MultiPage from './pages/multi/MultiPage'
import AddMultiForm from './pages/multi/AddMultiForm'

import Mutasi from './pages/mutasi/MutasiPage'
import ProsesMutasi from './pages/mutasi/ProsesMutasi'
import MutasiPage from './pages/mutasi/MutasiPage'
import TerimaPage from './pages/pindah/TerimaPage'

import PindahPage from './pages/pindah/PindahPage'

import ProsesTerimaForm from './pages/pindah/ProsesTerimaForm'

import ProsesPindahForm from './pages/pindah/ProsesPindahForm'

import ComponentToPrint from './pages/printcoba/ComponentToPrint'

import FormAlamat from './pages/alamat/FormAlamat'

import BeliPage from './pages/beli/beliPages'
import PosPageDetail from './pages/pos/PosPageDetail'
import PosPages from './pages/pos/PosPages'

import TagPage from './pages/pos/TagPage'
import BeliPages from './pages/beli/beliPages'
import BeliPageDetail from './pages/beli/beliPageDetail'
import PembelianPage from './pages/pembelian/PembelianPage'

import AddPindahFormKledo from './pages/pindah/addPindahFormKledo'
import ProsesPindahFormKledo from './pages/pindah/ProsesPindahFormKledo'
import PenjualanPageKledo from './pages/penjualan/PenjualanPageKledo'

import HalamanMutasi from './pages/pindah/halamanMutasi'
import PesoPages from './pages/peso/pesoPages'
import ReturBeli from './pages/beli/rebel/ReturBeli'
import TypeKontakForm from './pages/typeKontak/typeKontak'
import ApproveBeli from './pages/beli/approvebeli/approveBeli'
import PesoPageDetail from './pages/peso/pesoPageDetail'
import PesoList from './pages/peso/pesoList'
import EditPeso from './pages/peso/editPeso'
import EditPos from './pages/pos/editPos'
import EditBeli from './pages/beli/editBeli'
import EditApproveBeli from './pages/beli/approvebeli/editApproveBeli'
import ApproveBelis from './pages/beli/approvebeli/approveBelis'
import EditApproveBelis from './pages/beli/editApproveBelis'
import AddCoaForm from './pages/coa/AddCoaForm'
import AkunList from './pages/coa/AkunList'
import AddKategoriAkun from './pages/kategoriakun/KategoriAkun'
import KategoriAkunList from './pages/kategoriakun/KategoriAkunList'

import KasBanke from './pages/kasbank/KasBanke'
import ListKasBangke from './pages/kasbank/ListKasBangke'
import Akuna from './pages/Akun/akunA'
import AkunaList from './pages/Akun/akunList'
import Uang from './pages/Akun/keuangan'
import AllInOne from './pages/pos/allInOne'
import AkunMandiri from './pages/semuaakun/akunMandiri'
import Pemesanan from './pages/pembelian/Pemesanan'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="cart" element={<CartPage />} />
      <Route path="signin" element={<SigninPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="" element={<ProtectedRoute />}>
        <Route path="shipping" element={<ShippingAddressPage />} />
        <Route path="payment" element={<PaymentMethodPage />} />
        <Route path="placeorder" element={<PlaceOrderPage />} />
        <Route path="/order/:id" element={<OrderPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/supplier" element={<SupplierPage />} />{' '}
        <Route path="/kind" element={<KindPage />} />
        <Route path="/pelanggan" element={<PelangganPage />} />
        <Route path="/form-pelanggan" element={<AddPelangganForm />} />
        <Route path="/harga" element={<HargaPage />} />
        <Route path="/outlet" element={<OutletPage />} />
        <Route path="/usaha" element={<UsahaPage />} />
        <Route path="/satuan" element={<SatuanPage />} />
        <Route path="/stok" element={<StokPage />} />
        <Route path="/stok/export" element={<StokPage />} />
        <Route path="/form-harga" element={<AddHargaForm />} />
        <Route path="/form-supplier" element={<AddSupplierForm />} />
        <Route path="/form-satuan" element={<AddSatuanForm />} />
        <Route path="/form-outlet" element={<AddOutletForm />} />
        <Route path="/form-harga" element={<AddHargaForm />} />
        <Route path="/form-stok" element={<AddStokForm />} />
        <Route path="/form-usaha" element={<AddUsahaForm />} />
        <Route path="/setoran" element={<SetoranPage />} />
        <Route path="/form-setoran" element={<AddSetoranForm />} />
        <Route path="/form-bank" element={<AddBankForm />} />
        <Route path="/bank" element={<BankPage />} />
        <Route path="/jual" element={<JualPage />} />
        <Route path="/kasiTerima/:id_pindah" element={<ProsesTerimaForm />} />
        <Route
          path="/kasikledo/:id_pindah"
          element={<ProsesPindahFormKledo />}
        />
        <Route path="/kasipindah/:id_pindah" element={<ProsesPindahForm />} />
        <Route path="/kasiPindah/:id_pindah" element={<ProsesPindahForm />} />
        <Route path="/penjualankledo" element={<PenjualanPageKledo />} />
        <Route path="/multi" element={<MultiPage />} />
        <Route path="/posdua" element={<PosPages />} />
        <Route path="/form-multi" element={<AddMultiForm />} />
        <Route path="/beli" element={<BeliPage />} />
        <Route path="/mutasi" element={<Mutasi />} />
        <Route path="/tabelmutasi" element={<ProsesMutasi />} />
        <Route path="/mutasi/:id_mutasi" element={<MutasiPage />} />
        <Route path="/mutasikasi" element={<MutasiPage />} />
        <Route path="/pindah" element={<PindahPage />} />
        <Route path="/terima" element={<TerimaPage />} />
        <Route path="/pret" element={<ComponentToPrint />} />
        <Route path="/form-pindah" element={<AddPindahFormKledo />} />
        <Route path="/alamat" element={<FormAlamat />} />
        <Route path="/beli" element={<BeliPages />} />
        <Route path="/peso" element={<PesoPages />} />
        <Route path="/posdetail/:id_pos" element={<PosPageDetail />} />
        <Route path="/returbeli/:id_beli" element={<ReturBeli />} />
        <Route path="/approvebeli/:id_beli" element={<ApproveBeli />} />
        <Route path="/approvebelis/:id_beli" element={<ApproveBelis />} />
        <Route path="/beliDetail/:id_beli" element={<BeliPageDetail />} />
        <Route path="/pesoDetail/:id_peso" element={<PesoPageDetail />} />
      </Route>
      <Route path="/pembelian" element={<PembelianPage />} />
      <Route path="/pesolist" element={<PesoList />} />
      <Route path="/halamanmutasi" element={<HalamanMutasi />} />
      <Route path="/editpeso/:id_peso" element={<EditPeso />} />
      <Route path="/editpos/:id_pos" element={<EditPos />} />
      <Route path="/editBeli/:id_beli" element={<EditBeli />} />
      <Route path="/editapprovebeli/:id_beli" element={<EditApproveBeli />} />
      <Route path="/editapprovebelis/:id_beli" element={<EditApproveBelis />} />
      <Route path="/coa" element={<AddCoaForm />} />
      <Route path="/akunlist" element={<AkunList />} />
      <Route path="/kategoriakun" element={<AddKategoriAkun />} />
      <Route path="/kategoriakunlist" element={<KategoriAkunList />} />
      <Route path="/kasbanke" element={<KasBanke />} />
      <Route path="/listbanke" element={<ListKasBangke />} />
      <Route path="/akuna" element={<Akuna />} />
      <Route path="/akunalist" element={<AkunaList />} />
      <Route path="/uang" element={<Uang />} />
      <Route path="/allinone" element={<AllInOne />} />
      <Route path="/akunrekeningmandiri" element={<AkunMandiri />} />
      <Route path="/typekontak" element={<TypeKontakForm />} />
      <Route path="/pemesananpembelian" element={<Pemesanan />} />
    </Route>
  )
)

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </HelmetProvider>
    </StoreProvider>
  </React.StrictMode>
)
