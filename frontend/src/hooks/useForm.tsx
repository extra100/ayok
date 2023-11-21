// import React, { useEffect, useState } from 'react'
// import { useGetProductsQuery } from './productHooks'
// import { render } from 'react-dom'
// import { useForm, useFieldArray } from 'react-hook-form'
// import { yupResolver } from '@hookform/resolvers/yup'
// import * as yup from 'yup'
// import Select from 'react-select'
// import SelectorForm from '../components/SelectorForm'

// const AddRowTable = () => {
//   const { data: products } = useGetProductsQuery()
//   const [save, setSave] = useState<any>([])
//   const method = useForm({
//     mode: 'all',
//     resolver: yupResolver(
//       yup.object().shape({
//         barang: yup.array().of(
//           yup.object().shape({
//             id_barang: yup.string(),
//             nama_barang: yup.string(),
//             stok: yup.number(),
//           })
//         ),
//       })
//     ),
//   })
//   const opt = products?.map((d) => {
//     return { value: d.id_data_barang, label: d.nama_barang }
//   })
//   const { fields, append, remove } = useFieldArray({
//     control: method.control,
//     name: 'barang',
//   })
//   return (
//     <div>
//       <button onClick={() => append({ id_barang: '' })}>Tambah</button>
//       {fields.map((data, id) => {
//         return (
//           <div key={id}>
//             <SelectorForm
//               method={method}
//               methodName={`barang[${id}].id_barang`}
//               options={opt}
//               onChange={(e: any) => {
//                 setSave([])
//               }}
//             />
//             <table style={{ marginTop: '10px' }}>
//               <thead>
//                 <tr>
//                   <th
//                     style={{
//                       paddingBottom: '12px',
//                       paddingTop: '12px',
//                       paddingLeft: '24px',
//                       paddingRight: '24px',
//                     }}
//                   >
//                     No
//                   </th>
//                   <th
//                     style={{
//                       paddingBottom: '12px',
//                       paddingTop: '12px',
//                       paddingLeft: '24px',
//                       paddingRight: '24px',
//                     }}
//                   >
//                     Nama Barang
//                   </th>
//                   <th
//                     style={{
//                       paddingBottom: '12px',
//                       paddingTop: '12px',
//                       paddingLeft: '24px',
//                       paddingRight: '24px',
//                     }}
//                   >
//                     Stok
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td
//                     style={{
//                       paddingBottom: '12px',
//                       paddingTop: '12px',
//                       paddingLeft: '24px',
//                       paddingRight: '24px',
//                     }}
//                   >
//                     1
//                   </td>
//                   <td
//                     style={{
//                       paddingBottom: '12px',
//                       paddingTop: '12px',
//                       paddingLeft: '24px',
//                       paddingRight: '24px',
//                     }}
//                   >
//                     {
//                       products?.find(
//                         (e) =>
//                           e.id_data_barang ===
//                           method.getValues()?.barang[id]?.id_barang
//                       )?.nama_barang
//                     }
//                   </td>
//                   <td
//                     style={{
//                       paddingBottom: '12px',
//                       paddingTop: '12px',
//                       paddingLeft: '24px',
//                       paddingRight: '24px',
//                     }}
//                   >
//                     {
//                       products?.find(
//                         (e) =>
//                           e.id_data_barang ===
//                           method.getValues()?.barang[id]?.id_barang
//                       )?.jumlah_stok
//                     }
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         )
//       })}
//     </div>
//   )
// }

// export default AddRowTable
