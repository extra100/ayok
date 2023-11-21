// import React, { useContext, useEffect, useMemo, useState } from 'react'
// import {
//   Button,
//   Collapse,
//   DatePicker,
//   Dropdown,
//   Form,
//   Input,
//   Menu,
//   Select,
//   Table,
// } from 'antd'

// import { v4 as uuidv4 } from 'uuid'

// import moment from 'moment'

// import { Link, useParams } from 'react-router-dom'
// import {
//   AiOutlineArrowLeft,
//   AiOutlineDown,
//   AiOutlineMore,
//   AiOutlinePrinter,
//   AiOutlineSave,
//   AiOutlineShareAlt,
// } from 'react-icons/ai'
// import dayjs, { Dayjs } from 'dayjs'

// import { parseInt } from 'lodash'
// import UserContext from '../../contexts/UserContext'

// import { Pos } from '../../types/Pos'
// import { useGetProductsQuery } from '../../hooks/productHooks'
// import { useGetoutletsQuery } from '../../hooks/outletHooks'
// import PosPrintKomponent from '../printcoba/PosPrintKomponent'
// import { useGetSuppliersQuery } from '../../hooks/supplierHooks'
// import { Outlet } from '../../types/Outlet'
// import TagPage from '../pos/TagPage'
// import { useAddReturBeliMutation } from '../../hooks/returBeliHooks'
// import { useGetPembelianByIdQuery } from '../../hooks/pembelianHooks'
// import { useGetStoksQuery } from '../../hooks/stokHooks'
// import {
//   useGetPosDetailQuery,
//   useUpdatePosMutation,
// } from '../../hooks/posHooks'
// import { Harga } from '../../types/Harga'
// import { useGetPajaksQuery } from '../../hooks/pajakHooks'
// import { useGetMultisQuery } from '../../hooks/multiHooks'
// import { useGetHargasQuery } from '../../hooks/hargaHooks'
// import { Pajak } from '../../types/Pajak'
// import { Bank } from '../../types/Bank'
// import DateCicil from '../DateCicilan'
// import IDRInput from './IdrInput'
// import { useGetPenjualanByIdQuery } from '../../hooks/penjualanHooks'
// import { useGetPelanggansQuery } from '../../hooks/pelangganHooks'
// import TextArea from 'antd/es/input/TextArea'
// import { useGetBanksQuery } from '../../hooks/bankHooks'

// const EditPos: React.FC = (kledo: any) => {
//   const { id_pos } = useParams<{ id_pos?: string }>()
//   const AmbilData = !!id_pos

//   const userContext = useContext(UserContext)
//   const { user } = userContext || {}
//   let idOutletLoggedIn = ''
//   if (user) {
//     idOutletLoggedIn = user.id_outlet
//   }

//   const { data: getPosData } = useGetPosDetailQuery(id_pos as string)
//   //   const { data: getPenjualanDetail } = useGetPembelianByIdQuery(
//   //     id_pos as string
//   //   )
//   const { data: getPenjualanDetail } = useGetPenjualanByIdQuery(
//     id_pos as string
//   )
//   const { data: pelanggans } = useGetPelanggansQuery()

//   const [form] = Form.useForm()
//   const [nilaiPiutang, setNilaiPiutang] = useState<any>(null)
//   const [nilaiBayar, setNilaiBayar] = useState<any>(null)

//   useEffect(() => {
//     if (AmbilData && getPenjualanDetail && getPenjualanDetail.length > 0) {
//       const nilaiTerhutang = parseFloat(getPenjualanDetail[0]?.piutang)
//       setNilaiPiutang(nilaiTerhutang)
//     }
//   }, [AmbilData, getPenjualanDetail])
//   useEffect(() => {
//     if (AmbilData && getPenjualanDetail && getPenjualanDetail.length > 0) {
//       const nilaiTerbayar = parseFloat(getPenjualanDetail[0]?.bayar)
//       setNilaiBayar(nilaiTerbayar)
//     }
//   }, [AmbilData, getPenjualanDetail])

//   useEffect(() => {
//     if (AmbilData) {
//       if (getPosData) {
//         const formData = getPosData.reduce<{ [key: string]: Pos }>(
//           (acc, curr) => {
//             acc[curr._id] = {
//               ...curr,
//             }
//             return acc
//           },
//           {}
//         )

//         setBelis(getPosData)

//         form.setFieldsValue(formData)
//       }

//       if (getPenjualanDetail && getPenjualanDetail.length > 0) {
//         setSelectedPelanganId(getPenjualanDetail[0].id_pelanggan || null)
//       }
//       if (getPenjualanDetail && getPenjualanDetail.length > 0) {
//         setTotalSemua(parseFloat(getPenjualanDetail[0].total_semua) || null)
//       }
//     }
//   }, [AmbilData, getPosData, getPenjualanDetail, form])

//   const [selectedOutletId, setSelectedOutletId] = useState('')
//   const { data: products } = useGetProductsQuery()
//   const { data: outletData } = useGetoutletsQuery()

//   const menu = (
//     <Menu key="1">
//       <Menu.Item>
//         <PosPrintKomponent />
//       </Menu.Item>
//       <Menu.Item key="2">pdf</Menu.Item>
//     </Menu>
//   )

//   const [poss, setBelis] = useState<Pos[]>([])

//   const generateInvoiceId = (): string => {
//     if (AmbilData) {
//       return id_pos
//     }
//     const uuid = uuidv4()
//     const splitUUID = uuid.split('-')
//     const lastPartOfUUID = splitUUID[splitUUID.length - 1]
//     return `INV/${parseInt(lastPartOfUUID, 5)}`
//   }
//   const [currentIdBeli, setCurrentIdBeli] = useState(generateInvoiceId())
//   const { data: hargas } = useGetHargasQuery()

//   const { data: suppliers } = useGetSuppliersQuery()
//   const [selectedPelanganId, setSelectedPelanganId] = useState<string | null>(
//     null
//   )
//   const currentDate = dayjs()
//   const [startDate, setStartDate] = useState<Dayjs>(
//     kledo.value ? dayjs(kledo.value) : currentDate
//   )

//   const handlePerubahanTanggal = (date: Dayjs | null, dateString: string) => {
//     if (date) {
//       setStartDate(date)
//       if (kledo.onChange) {
//         kledo.onChange(date.format('DD-MM-YYYY'))
//       }
//     }
//   }

//   const updatePosMutation = useUpdatePosMutation()

//   useEffect(() => {
//     if (getPosData) {
//       setBelis(getPosData)
//     }
//   }, [getPosData])
//   const [catatan, setCatatan] = useState('')

//   const saveData = () => {
//     const dataToSave: Pos[] = poss.map((item) => ({
//       _id: '',
//       id_pos: '0',
//       inv: '0',
//       total_semua: '0',
//       diskon: '0',
//       bayar: '0',
//       tanggal_mulai: '0',
//       tanggal_akhir: '0',
//       via: '0',
//       piutang: '0',
//       id_pelanggan: '0',
//       selisih: '0',
//       id_harga: '0',
//       id_outlet: user?.id_outlet || '0',
//       catatan: '0',
//       sub_total: '0',
//       nama: '0',
//     }))

//     console.log({ dataToSave })

//     updatePosMutation.mutate(dataToSave as any, {
//       onSuccess: () => {
//         console.log('Data berhasil disimpan')
//       },
//       onError: (error) => {
//         console.error('Gagal menyimpan data:', error)
//       },
//     })
//   }

//   const [subTotal, setSubTotal] = useState<any>(null)
//   const [allTotal, setAllTotal] = useState(0)
//   const hitungTotalSemua = (list = poss) => {
//     console.log({ list })

//     let total = list.reduce((sum, pos) => {
//       const nilaiTotalPos = form.getFieldValue(pos._id)?.total || '0'
//       return sum + parseInt(nilaiTotalPos, 10)
//     }, 0)

//     total = total - 0
//     setTotalSemua(total)
//     setSubTotal(total)
//     setAllTotal(total)
//   }
//   const [tercoba, setTercoba] = useState()
//   const { data: pajaks } = useGetPajaksQuery()
//   const [selectedJenisPajak, setSelectedJenisPajak] = useState('')

//   const { data: stokku } = useGetStoksQuery()
//   const calculation = (posId: string, selectedJenisPajak: string) => {
//     const currentFields = form.getFieldValue([posId])

//     if (currentFields) {
//       const { qty_sold, harga_jual, diskon } = currentFields
//       const total =
//         parseFloat(qty_sold) * parseFloat(harga_jual) - parseInt(diskon)

//       const selectedPajak = pajaks?.find(
//         (pajak) => pajak.jenis_pajak === selectedJenisPajak
//       )
//       const totalPajak = selectedPajak
//         ? (total * parseInt(selectedPajak.jumlah_pajak)) / 100
//         : 0

//       form.setFieldsValue({
//         [posId]: {
//           ...currentFields,
//           total: total.toString(),
//           jumlah_pajak: totalPajak.toString() || 0,
//           jenis_pajak: selectedJenisPajak || '--',
//         },
//       })
//       form.setFieldsValue({
//         [posId]: {
//           total: total,
//         },
//       })

//       setTercoba(total as any)

//       hitungTotalSemua()
//     }
//   }

//   const { Panel } = Collapse

//   const onChange = (key: string | string[]) => {}
//   const text = ''

//   const handleQtyChange = (
//     value: number | string | null | undefined,
//     posId: string
//   ) => {
//     let newValue: number

//     if (AmbilData) {
//       const relevantDetail = getPosData!.find((detail) => detail._id === posId)
//       newValue = relevantDetail ? relevantDetail.qty_sold : 0
//     } else {
//       newValue = typeof value === 'number' ? value : 0
//     }

//     setBelis((prevPoss) => {
//       return prevPoss.map((pos: any) => {
//         if (pos._id === posId) {
//           return {
//             ...pos,
//             qty_sold: newValue,
//           }
//         }
//         return pos
//       })
//     })

//     calculation(posId, selectedJenisPajak as string)
//   }
//   const [via, setVia] = useState('0')
//   const [selectedBank, setSelectedBank] = useState<string | null>(null)

//   const [showAddDiscount, setShowAddDiscount] = useState(false)
//   const handleAddDiscount = () => {
//     setShowAddDiscount(!showAddDiscount)

//     if (!showAddDiscount) {
//       form.setFieldsValue({ via: null })

//       setVia('')
//       setSelectedBank('')
//     }
//   }
//   const [hargaBadge, setHargaBadge] = useState<{
//     [key: string]: { tinggi: string; rendah: string }
//   }>({})
//   const { data: multis } = useGetMultisQuery()

//   const handleJenisHargaChange = (hargaId: string, posId: string) => {
//     const currentPos = form.getFieldValue(posId)

//     if (currentPos && currentPos.id_data_barang) {
//       const selectedMulti = multis?.find(
//         (m) =>
//           m.id_data_barang === currentPos.id_data_barang &&
//           m.id_harga === hargaId
//       )

//       if (selectedMulti) {
//         form.setFieldsValue({
//           [posId]: {
//             ...currentPos,
//             harga_jual: selectedMulti.harga_tertinggi,
//             harga_jual_rendah: selectedMulti.harga_terendah,
//             id_harga: hargaId,
//           },
//         })

//         setHargaBadge((prevState) => ({
//           ...prevState,
//           [posId]: {
//             tinggi: selectedMulti.harga_tertinggi.toString(),
//             rendah: selectedMulti.harga_terendah.toString(),
//           },
//         }))

//         calculation(posId, selectedJenisPajak as string)
//       }
//     } else {
//     }
//   }

//   const [nmDiskon, setNmDiskon] = useState(0)

//   const handleDiscountChange = (event: any) => {
//     const disini = event.target.value

//     setNmDiskon(disini)
//   }

//   const [showDp, setShowDp] = useState(false)

//   const handleUangMukaClick = () => {
//     setShowDp(!showDp)

//     if (!showDp) {
//       form.setFieldsValue({ via: null })

//       setVia('')
//       setSelectedBank('')
//     }
//   }
//   const [nm, setNm] = useState(0)
//   const [sisaTagihan, setSisaTagihan] = useState<any>(0)

//   useEffect(() => {
//     if (total_semua != null) {
//       setSisaTagihan(total_semua - nm)
//     } else {
//       setSisaTagihan(total_semua)
//     }
//   }, [nm])
//   const [isBayarFilled, setIsBayarFilled] = useState(false)
//   const [kalku, setKalku] = useState(0)
//   const [warnInputan, setWarnInputan] = useState(false)
//   const [inputanDiskon, setInputanDiskon] = useState<any>()
//   const [total_semua, setTotalSemua] = useState<any>(null)
//   const gabungNm = Number(nm) + Number(nmDiskon)
//   const [inputanState, setInputanState] = useState(0)

//   const { data: banks } = useGetBanksQuery()
//   const handleBayarChange = (value: any) => {
//     const numericValue =
//       typeof value === 'string' ? parseInt(value.replace(/\./g, ''), 10) : value

//     if (numericValue !== null && numericValue !== undefined) {
//       const totalBayarDariPenjualanDetail =
//         getPenjualanDetail && getPenjualanDetail.length > 0
//           ? parseFloat(getPenjualanDetail[0].bayar as string)
//           : 0

//       const totalPiutangDariPenjualanDetail =
//         getPenjualanDetail && getPenjualanDetail.length > 0
//           ? parseFloat(getPenjualanDetail[0].piutang as string)
//           : 0

//       const addonBefore = total_semua - numericValue

//       setKalku(addonBefore)
//       const blockInputan = numericValue > totalPiutangDariPenjualanDetail
//       setWarnInputan(blockInputan)

//       setNm(numericValue as any)

//       if (numericValue > 0) {
//         setIsBayarFilled(true)
//       } else {
//         setIsBayarFilled(false)
//       }
//     }
//   }
//   const columns = [
//     {
//       title: 'Nama Barang',
//       dataIndex: 'id_data_barang',
//       key: 'nama_barang',
//       render: (id_data_barang: string) => {
//         const goods = products?.find((goods) => goods._id === id_data_barang)
//         return goods ? goods.nama_barang : '-'
//       },
//     },

//     {
//       title: 'Qty',
//       dataIndex: 'qty_sold',
//       render: (text: string, record: Pos) => {
//         const cui = stokku?.find(
//           (product) =>
//             product.id_data_barang === record.id_data_barang &&
//             product.id_outlet === idOutletLoggedIn
//         )
//         const stokCount = cui ? cui.jumlah_stok : 0

//         if (AmbilData) {
//           const seeds = getPosData?.find(
//             (product) =>
//               product.id_data_barang === record.id_data_barang &&
//               product.id_outlet === idOutletLoggedIn
//           )
//         }

//         return (
//           <Form.Item
//             name={[record._id, 'qty_sold']}
//             style={{ marginBottom: 0 }}
//           >
//             <Input
//               defaultValue={AmbilData ? String(record.qty_sold) : undefined}
//               disabled={!AmbilData && stokCount <= 0}
//               onChange={(e) => handleQtyChange(e.target.value, record._id)}
//               style={{ width: 60 }}
//             />
//           </Form.Item>
//         )
//       },
//     },
//     // {
//     //   title: 'Harga Jual',
//     //   dataIndex: 'harga_jual',
//     //   key: 'harga_jual',
//     //   render: (harga_jual: any) => <Input value={harga_jual} />,
//     // },
//     {
//       title: 'Harga Jual',
//       dataIndex: 'harga_jual',

//       render: (text: string, record: Pos) => (
//         <Form.Item
//           name={[record._id, 'harga_jual']}
//           rules={[
//             {
//               required: true,
//               message: `Please input Harga Jual!`,
//             },

//             ({ getFieldValue }) => ({
//               validator(_, value) {
//                 const hargaInput = parseInt(value, 10)
//                 const hargaTinggi = parseInt(
//                   hargaBadge[record._id]?.tinggi || '0',
//                   10
//                 )
//                 const hargaRendah = parseInt(
//                   hargaBadge[record._id]?.rendah || '0',
//                   10
//                 )
//                 if (hargaInput >= hargaRendah && hargaInput <= hargaTinggi) {
//                   return Promise.resolve()
//                 }
//                 return Promise.reject(
//                   new Error(
//                     `Harga harus antara ${hargaRendah} dan ${hargaTinggi}!`
//                   )
//                 )
//               },
//             }),
//           ]}
//           style={{ marginBottom: 0 }}
//         >
//           <Input
//             defaultValue={AmbilData ? String(record.harga_jual) : undefined}
//             onChange={(value) => {
//               if (value !== null && value !== undefined) {
//                 calculation(record._id, selectedJenisPajak as string)
//               }
//             }}
//           />
//         </Form.Item>
//       ),
//     },
//     {
//       title: 'Jumlah',
//       dataIndex: 'total',
//       render: (text: string, record: Pos) => (
//         <div
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//           }}
//         >
//           <Form.Item
//             style={{
//               flex: 1,
//               marginRight: '8px',
//               marginBottom: 0,
//             }}
//             name={[record._id, 'total']}
//             rules={[
//               {
//                 required: true,
//                 message: `Please input Jumlah!`,
//               },
//             ]}
//           >
//             <Input
//               onChange={(e) => {
//                 calculation(record.total, selectedJenisPajak)
//               }}
//             />
//           </Form.Item>
//         </div>
//       ),
//     },
//     {
//       title: 'Jenis Harga',
//       dataIndex: 'jenis_harga',
//       render: (text: string, record: Pos) => {
//         const badgeHarga = hargaBadge[record._id]
//           ? `${hargaBadge[record._id]?.rendah} - ${
//               hargaBadge[record._id]?.tinggi
//             }`
//           : ''

//         return (
//           <Form.Item
//             style={{ marginBottom: 0 }} // Menghilangkan margin bawah pada Form.Item
//           >
//             <Input
//               addonBefore={
//                 <div>
//                   <Select
//                     showSearch
//                     style={{ width: 100 }}
//                     optionFilterProp="children"
//                     filterOption={(input, option) =>
//                       option?.children?.toString()
//                         ? option.children
//                             .toString()
//                             .toLowerCase()
//                             .includes(input.toLowerCase())
//                         : false
//                     }
//                     onChange={(value) =>
//                       handleJenisHargaChange(value as string, record._id)
//                     }
//                     defaultValue={record.id_harga || undefined}
//                   >
//                     {hargas?.map((harga: Harga) => (
//                       <Select.Option key={harga._id} value={harga._id}>
//                         {harga.jenis_harga}
//                       </Select.Option>
//                     ))}
//                   </Select>
//                 </div>
//               }
//               value={badgeHarga}
//               style={{ width: 240 }}
//             />
//           </Form.Item>
//         )
//       },
//     },
//     {
//       title: 'Diskon',
//       dataIndex: 'diskon',
//       render: (text: string, record: Pos) => (
//         <Form.Item
//           name={[record._id, 'diskon']}
//           rules={[
//             {
//               required: true,
//               message: `Please input Diskon!`,
//             },
//           ]}
//           style={{ marginBottom: 0 }}
//         >
//           <Input
//             onChange={() =>
//               calculation(record._id, selectedJenisPajak as string)
//             }
//             defaultValue={AmbilData ? String(record.diskon) : undefined}
//           />
//         </Form.Item>
//       ),
//     },
//     {
//       title: 'pajak',
//       dataIndex: 'jenis_pajak',

//       render: (text: string, record: Pos) => (
//         <Form.Item
//           name={[record._id, 'jenis_pajak']}
//           rules={[
//             {
//               required: true,
//               message: 'Please input pajak!',
//             },
//           ]}
//           style={{ marginBottom: 0, width: 100 }}
//         >
//           <Select
//             onChange={(value) => calculation(record._id, value)}
//             defaultValue={AmbilData ? String(record.jenis_pajak) : undefined}
//           >
//             {pajaks?.map((pajak: Pajak) => (
//               <Select.Option key={pajak._id} value={pajak.jenis_pajak}>
//                 {pajak.jenis_pajak}
//               </Select.Option>
//             ))}
//           </Select>
//         </Form.Item>
//       ),
//     },
//     {
//       title: 'Jumlah',
//       dataIndex: 'jumlah_pajak',
//       render: (text: string, record: Pos) => (
//         <div
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//           }}
//         >
//           <Form.Item
//             style={{
//               flex: 1,
//               marginRight: '8px',
//               marginBottom: 0,
//               width: 100,
//             }}
//             name={[record._id, 'jumlah_pajak']}
//             rules={[
//               {
//                 required: true,
//                 message: `Please input Jumlah!`,
//               },
//             ]}
//           >
//             <Input
//               readOnly
//               defaultValue={AmbilData ? String(record.jumlah_pajak) : undefined}
//             />
//           </Form.Item>
//         </div>
//       ),
//     },
//   ]

//   return (
//     <div
//       className="radius"
//       style={{
//         border: '1px #f0f0f0 solid',
//         padding: '15px',
//         background: 'white',
//       }}
//     >
//       <div style={{ border: '1px' }}>
//         <div style={{ display: 'flex', marginBottom: 20 }}>
//           <div
//             style={{
//               flex: '1',
//               border: '1px solid white',
//               flexBasis: '40%',
//               textAlign: 'right',
//             }}
//           >
//             <div style={{ textAlign: 'left' }}>
//               <h1 style={{ fontSize: '2.5rem' }}>
//                 Detail Tagihan:{' '}
//                 {AmbilData && getPosData && getPosData.length > 0
//                   ? getPosData[0]?.id_pos
//                   : undefined}
//               </h1>
//             </div>
//           </div>
//           <div
//             style={{
//               flex: '1',
//               border: '1px solid white',
//               flexBasis: '40%',
//               display: 'flex',
//               justifyContent: 'right',
//               alignItems: 'center',
//             }}
//           >
//             <div style={{ textAlign: 'left' }}>
//               <h1 style={{ fontSize: '1.5rem' }}></h1>
//             </div>
//           </div>
//           <div
//             style={{
//               flex: '1',
//               border: '1px solid white',
//               flexBasis: '5%',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}
//           >
//             <span
//               style={{
//                 display: 'flex',

//                 background: '#eb9234',
//                 height: 30,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 color: 'white',
//                 width: '80%',
//               }}
//             >
//               <AiOutlineArrowLeft />
//               Kembali
//             </span>
//           </div>
//         </div>

//         <div
//           style={{
//             display: 'flex',
//             borderTop: '1px #f0f0f0 solid',
//             borderRight: '1px #f0f0f0 solid',
//             borderLeft: '1px #f0f0f0 solid',
//             padding: '15px',
//           }}
//         >
//           <div
//             style={{
//               flex: '1',
//               border: '1px solid white',
//               flexBasis: '30%',
//               display: 'flex',
//               justifyContent: 'left',
//               alignItems: 'center',
//             }}
//           >
//             <div style={{ textAlign: 'left', fontSize: '20px' }}>
//               <h5
//                 className={
//                   nilaiPiutang <= 0
//                     ? 'lunas'
//                     : nilaiBayar > 0
//                     ? 'bayar-setengah'
//                     : 'belum-bayar'
//                 }
//               >
//                 {nilaiPiutang <= 0
//                   ? 'Lunas'
//                   : nilaiBayar > 0
//                   ? 'Dibayar Sebagian'
//                   : 'Belum Dibayar'}
//               </h5>
//             </div>
//           </div>
//           {/* nilaiPiutang */}
//           <div
//             style={{
//               flex: '1',
//               border: '1px solid white',
//               flexBasis: '40%',
//               display: 'flex',
//               justifyContent: 'right',
//               alignItems: 'center',
//             }}
//           >
//             <div style={{ textAlign: 'left' }}>
//               <h1 style={{ fontSize: '1.5rem' }}></h1>
//             </div>
//           </div>

//           <div
//             style={{
//               flex: '1',
//               border: '1px solid white',
//               flexBasis: '2%',
//               display: 'flex',
//               justifyContent: 'flex-end',
//               alignItems: 'center',
//             }}
//           >
//             <div
//               style={{
//                 flex: '1',
//                 border: '1px solid #e9ecef',
//                 flexBasis: '2%',
//                 display: 'flex',
//                 justifyContent: 'flex-end',
//                 alignItems: 'center',
//                 height: '30px',
//               }}
//             >
//               <Dropdown overlay={menu} placement="bottomRight">
//                 <a
//                   style={{ textDecoration: 'none' }}
//                   className="ant-dropdown-link"
//                   onClick={(e) => e.preventDefault()}
//                 >
//                   <div
//                     style={{
//                       flex: '1',

//                       display: 'flex',
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       width: '100px',
//                       color: 'black',
//                     }}
//                   >
//                     <AiOutlineShareAlt />
//                     <div style={{ marginRight: '5px', marginLeft: '5px' }}>
//                       Bagikan
//                     </div>

//                     <AiOutlineDown />
//                   </div>
//                 </a>
//               </Dropdown>
//             </div>
//           </div>
//           <div
//             style={{
//               flex: '1',
//               border: '1px solid white',
//               flexBasis: '2%',
//               display: 'flex',
//               justifyContent: 'flex-end',
//               alignItems: 'center',
//             }}
//           >
//             <div
//               style={{
//                 flex: '1',
//                 border: '1px solid #e9ecef',
//                 flexBasis: '2%',
//                 display: 'flex',
//                 justifyContent: 'flex-end',
//                 alignItems: 'center',
//                 height: '30px',
//               }}
//             >
//               <Dropdown overlay={menu} placement="bottomRight">
//                 <a
//                   style={{ textDecoration: 'none' }}
//                   className="ant-dropdown-link"
//                   onClick={(e) => e.preventDefault()}
//                 >
//                   <div
//                     style={{
//                       flex: '1',

//                       display: 'flex',
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       width: '100px',
//                       color: 'black',
//                     }}
//                   >
//                     <AiOutlinePrinter />
//                     <div style={{ marginRight: '5px', marginLeft: '5px' }}>
//                       Print
//                     </div>

//                     <AiOutlineDown />
//                   </div>
//                 </a>
//               </Dropdown>
//             </div>
//           </div>
//           <div
//             style={{
//               flex: '1',
//               border: '1px solid white',
//               flexBasis: '2%',
//               display: 'flex',
//               justifyContent: 'flex-end',
//               alignItems: 'center',
//             }}
//           >
//             <div
//               style={{
//                 flex: '1',
//                 border: '1px solid white',
//                 flexBasis: '2%',
//                 display: 'flex',
//                 justifyContent: 'flex-end',
//                 alignItems: 'center',
//               }}
//             >
//               <Dropdown overlay={menu} placement="bottomRight">
//                 <AiOutlineMore />
//               </Dropdown>
//             </div>
//           </div>
//         </div>

//         <div
//           style={{
//             borderTop: '1px #f0f0f0 solid',
//             borderBottom: '1px #f0f0f0 solid',
//             borderLeft: '1px #f0f0f0 solid',
//             borderRight: '1px #f0f0f0 solid',
//             padding: '20px',
//           }}
//         >
//           <div
//             style={{
//               display: 'flex',
//             }}
//           >
//             <div
//               style={{
//                 flex: '1',
//                 flexBasis: '40%',
//                 textAlign: 'right',
//                 marginBottom: '16px',
//               }}
//             >
//               <div style={{ textAlign: 'left' }}>
//                 <span>Nama Pelanggan</span>
//                 <br />
//                 <h5>
//                   {AmbilData &&
//                   getPenjualanDetail &&
//                   getPenjualanDetail.length > 0 ? (
//                     <Link
//                       style={{ textDecoration: 'none' }}
//                       to={`/customer/${getPenjualanDetail[0]?.id_pelanggan}`}
//                     >
//                       {
//                         pelanggans?.find(
//                           (outlet) =>
//                             outlet._id === getPenjualanDetail[0]?.id_pelanggan
//                         )?.nama
//                       }
//                     </Link>
//                   ) : undefined}
//                 </h5>
//               </div>
//             </div>
//             <div
//               style={{
//                 flex: '1',
//                 flexBasis: '40%',
//                 textAlign: 'right',
//               }}
//             >
//               <div style={{ textAlign: 'left' }}>
//                 <span>Nomor</span>
//                 <br />
//                 <h5 style={{ fontSize: '1.25rem' }}>
//                   {AmbilData && getPosData && getPosData.length > 0
//                     ? getPosData[0]?.id_pos
//                     : undefined}
//                 </h5>
//               </div>
//             </div>
//           </div>

//           <div
//             style={{
//               display: 'flex',
//             }}
//           >
//             <div
//               style={{
//                 flex: '1',
//                 flexBasis: '40%',
//                 textAlign: 'right',
//                 marginBottom: '16px',
//               }}
//             >
//               <div style={{ textAlign: 'left' }}>
//                 <span>Tgl. Transaksi</span>
//                 <br />
//                 <h5>
//                   {AmbilData &&
//                   getPenjualanDetail &&
//                   getPenjualanDetail.length > 0
//                     ? [getPenjualanDetail[0]?.tanggal_mulai]
//                     : undefined}
//                 </h5>
//               </div>
//             </div>
//             <div
//               style={{
//                 flex: '1',
//                 flexBasis: '40%',
//                 textAlign: 'right',
//               }}
//             >
//               <div style={{ textAlign: 'left' }}>
//                 <span>Tgl. Jatuh Tempo</span>
//                 <br />
//                 <h5>
//                   {AmbilData &&
//                   getPenjualanDetail &&
//                   getPenjualanDetail.length > 0
//                     ? [getPenjualanDetail[0]?.tanggal_akhir]
//                     : undefined}
//                 </h5>
//               </div>
//             </div>
//           </div>
//           <div
//             style={{
//               display: 'flex',
//             }}
//           >
//             <div
//               style={{
//                 flex: '1',
//                 flexBasis: '40%',
//                 textAlign: 'right',
//                 marginBottom: '16px',
//               }}
//             >
//               <div style={{ textAlign: 'left' }}>
//                 <span>Outlet</span>
//                 <br />
//                 {/* hu */}
//                 <h5>
//                   {AmbilData &&
//                   getPenjualanDetail &&
//                   getPenjualanDetail.length > 0
//                     ? outletData?.find(
//                         (outlet) =>
//                           outlet._id === getPenjualanDetail[0]?.id_outlet
//                       )?.nama_outlet
//                     : undefined}
//                 </h5>
//               </div>
//             </div>

//             <div
//               style={{
//                 flex: '1',
//                 flexBasis: '40%',
//                 textAlign: 'right',
//               }}
//             >
//               <div style={{ textAlign: 'left' }}>
//                 <span>Tag</span>
//                 <br />
//                 <h5>
//                   {AmbilData && getPosData && getPosData.length > 0
//                     ? [getPosData[0]?.tag]
//                     : undefined}
//                 </h5>
//               </div>
//             </div>
//           </div>

//           <Form
//             form={form}
//             style={{ borderRadius: '0 0 0 ', flexBasis: '500px' }}
//           >
//             <Table
//               style={{ borderRadius: '0 0 0 ', flexBasis: '500px' }}
//               dataSource={poss}
//               columns={columns}
//               rowKey={(record) => record._id}
//               pagination={false}
//               rowClassName={() => 'testos'}
//             />
//           </Form>
//           <div style={{ display: 'flex', marginTop: 20 }}>
//             <div style={{ display: 'flex', marginTop: 20 }}>
//               <div>
//                 <Collapse
//                   onChange={onChange}
//                   style={{
//                     width: '500px',
//                     textAlign: 'left',
//                     backgroundColor: '#f2f4f8',
//                   }}
//                 >
//                   <Panel header="Pesan" key="1">
//                     <TextArea
//                       name="coba"
//                       style={{
//                         width: '100%',
//                         minHeight: '50px',
//                         border: '1px solid #cfcdcd',

//                         backgroundColor: 'white',
//                       }}
//                       placeholder="Tambahkan pesan di sini..."
//                       value={catatan}
//                       onChange={(e) => setCatatan(e.target.value)}
//                     />
//                   </Panel>
//                 </Collapse>
//               </div>

//               <div style={{ display: 'flex', width: '800px' }}>
//                 <div
//                   style={{
//                     flex: '1',

//                     flexBasis: '70%',

//                     textAlign: 'right',
//                     marginTop: 10,
//                   }}
//                 >
//                   <div style={{ textAlign: 'right', marginBottom: 20 }}>
//                     <span style={{ fontWeight: 'bold' }}>Sub Total</span>
//                   </div>

//                   {showAddDiscount ? (
//                     <div style={{ display: 'flex' }}>
//                       <Form.Item
//                         name="adddiscount"
//                         style={{ flex: 1, marginRight: '15px' }}
//                       ></Form.Item>

//                       <Form.Item>
//                         <Input.Group compact>
//                           <Input
//                             style={{
//                               flex: 1,
//                               textAlign: 'center',
//                               width: '100px',
//                               borderRight: 0,
//                             }}
//                             placeholder="Diskon"
//                           />
//                           <Input
//                             style={{
//                               width: 110,
//                               textAlign: 'center',
//                             }}
//                             type="string"
//                             onChange={handleDiscountChange}
//                           />
//                         </Input.Group>
//                       </Form.Item>
//                     </div>
//                   ) : (
//                     <div style={{ textAlign: 'right', marginBottom: 20 }}>
//                       <span style={{ color: 'white' }}>Sunyi</span>
//                     </div>
//                   )}

//                   {showDp ? (
//                     <div style={{ display: 'flex' }}>
//                       <Form.Item
//                         name="via"
//                         style={{ flex: 1, marginRight: '15px' }}
//                         rules={[
//                           {
//                             required: true,
//                             validator: (_, value) => {
//                               if (!value || value === '0') {
//                                 return Promise.reject(
//                                   new Error('Harap pilih bank!')
//                                 )
//                               }
//                               return Promise.resolve()
//                             },
//                           },
//                         ]}
//                       >
//                         <Input.Group compact>
//                           <Input
//                             style={{
//                               flex: 1,
//                               textAlign: 'center',
//                               width: '80px',
//                             }}
//                             placeholder="Dibayar ke"
//                             disabled
//                           />
//                           <div className="my-select-container">
//                             <Select
//                               style={{
//                                 flex: 1,
//                                 textAlign: 'left',
//                                 width: 120,
//                               }}
//                               showSearch
//                               optionFilterProp="children"
//                               value={via}
//                               onChange={(value) => {
//                                 setSelectedBank(value)
//                                 setVia(value)
//                               }}
//                               filterOption={(input, option) =>
//                                 option?.children
//                                   ? option.children
//                                       .toString()
//                                       .toLowerCase()
//                                       .includes(input.toLowerCase())
//                                   : false
//                               }
//                               placeholder="Pilih bank"
//                             >
//                               {banks?.map((bank: Bank) => (
//                                 <Select.Option key={bank._id} value={bank._id}>
//                                   {bank.nama_akun}
//                                 </Select.Option>
//                               ))}
//                             </Select>
//                           </div>
//                         </Input.Group>
//                       </Form.Item>

//                       <Form.Item>
//                         <Input.Group compact>
//                           <Input
//                             style={{
//                               flex: 1,
//                               textAlign: 'center',
//                               width: '100px',
//                               borderRight: 0,
//                             }}
//                             placeholder="Jml. Bayar"
//                             disabled
//                           />
//                           <IDRInput
//                             style={{
//                               width: 110,
//                               textAlign: 'center',
//                             }}
//                             type="number"
//                             onChange={handleBayarChange}
//                             value={inputanState}
//                           />
//                         </Input.Group>
//                       </Form.Item>
//                     </div>
//                   ) : (
//                     <div style={{ textAlign: 'right', marginBottom: 20 }}>
//                       <span style={{ color: 'white' }}>Sunyi</span>
//                     </div>
//                   )}

//                   <div style={{ textAlign: 'right', marginBottom: 30 }}>
//                     <span style={{ fontWeight: 'bold' }}>Total</span>
//                   </div>
//                   <div style={{ textAlign: 'right', marginBottom: 20 }}>
//                     <span style={{ fontWeight: 'bold' }}>Sisa Tagihan</span>
//                   </div>
//                 </div>

//                 <div
//                   style={{
//                     flex: '1',
//                     border: '1px solid white',
//                     flexBasis: '30%',

//                     textAlign: 'right',
//                     marginTop: 10,
//                   }}
//                 >
//                   {/* <div style={{ textAlign: 'right', marginBottom: 20 }}>
//                   <span style={{ fontWeight: 'bold' }}>{0}</span>
//                 </div> */}
//                   <div style={{ textAlign: 'right', marginBottom: 20 }}>
//                     <span style={{ fontWeight: 'bold' }}>{total_semua}</span>
//                   </div>
//                   <div
//                     style={{ textAlign: 'right', marginBottom: 30 }}
//                     onClick={handleAddDiscount}
//                   >
//                     <span
//                       style={{
//                         fontWeight: 'bold',
//                         color: 'blue',
//                         cursor: 'pointer',
//                       }}
//                     >
//                       + Tambahan Diskon
//                     </span>
//                   </div>
//                   {/* dkmglkmg;rl */} {/* ndklgmld.gmd */}
//                   {/* s.fdger////// */}
//                   <div
//                     style={{ textAlign: 'right', marginBottom: 20 }}
//                     onClick={handleUangMukaClick}
//                   >
//                     <span
//                       style={{
//                         fontWeight: 'bold',
//                         color: 'blue',
//                         cursor: 'pointer',
//                       }}
//                     >
//                       + Uang Muka
//                     </span>
//                   </div>{' '}
//                   {/* nmngnjvlsd */}
//                   {/* dgmrkhlmer */}
//                   <div style={{ textAlign: 'right', marginBottom: 30 }}>
//                     <span style={{ fontWeight: 'bold' }}>
//                       {''}
//                       {total_semua - nmDiskon}
//                     </span>
//                   </div>
//                   <div style={{ textAlign: 'right', marginBottom: 30 }}>
//                     <span style={{ fontWeight: 'bold' }}>
//                       {' '}
//                       {total_semua - gabungNm}
//                     </span>
//                   </div>
//                   <br />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div style={{ border: '1px' }}>
//           <div style={{ display: 'flex', padding: '20px' }}>
//             <div
//               style={{
//                 flex: '1',
//                 borderTop: '1px solid #f0f0f0',
//                 borderLeft: '1px solid #f0f0f0',
//                 borderBottom: '1px solid #f0f0f0',
//                 padding: '20px',
//                 textAlign: 'right',
//                 width: '100',
//               }}
//             ></div>

//             <div
//               style={{
//                 flex: '1',
//                 borderTop: '1px solid #f0f0f0',
//                 padding: '20px',

//                 borderRight: '1px solid #f0f0f0',
//                 borderBottom: '1px solid #f0f0f0',
//                 textAlign: 'right',
//               }}
//             >
//               <div
//                 style={{
//                   flex: '1',
//                   flexBasis: '10px',
//                   textAlign: 'right',
//                 }}
//               >
//                 <div>
//                   <Form.Item>
//                     <Link to={`/posDetail/${id_pos}`}>
//                       <Button
//                         size="small"
//                         type="primary"
//                         style={{
//                           background: '#0190fe',
//                           width: '50%',
//                           height: '2.2rem',
//                           color: 'white',
//                           borderRadius: '0px 0px 0px',
//                           marginTop: '10px',
//                         }}
//                         onClick={saveData}
//                       >
//                         <AiOutlineSave
//                           style={{ marginRight: 7, marginTop: -4 }}
//                         />
//                         Simpan
//                       </Button>
//                     </Link>
//                   </Form.Item>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default EditPos
