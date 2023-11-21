// import {
//   QueryCache,
//   useMutation,
//   useQuery,
//   useQueryClient,
// } from '@tanstack/react-query'
// import apiClient from '../apiClient'
// import { Product } from '../types/Product'

// export const useGetProductsQuery = () =>
//   useQuery({
//     queryKey: ['products'],
//     queryFn: async () => (await apiClient.get<Product[]>(`/api/products`)).data,
//   })

// export const useGetProductDetailsById_data_barangQuery = (
//   id_data_barang: string
// ) =>
//   useQuery({
//     queryKey: ['products', id_data_barang],
//     queryFn: async () =>
//       (
//         await apiClient.get<Product>(
//           `/api/products/id_data_barang/${id_data_barang}`
//         )
//       ).data,
//   })

// // Blok ini mengekspor fungsi custom hook useAddProductMutation. Fungsi ini menggunakan useMutation dari React Query untuk mendefinisikan mutasi yang akan terjadi saat menambahkan produk baru. Pada onSuccess, queryClient.invalidateQueries(['products']) digunakan untuk memperbarui cache dari query 'products' setelah mutasi berhasil dieksekusi.
// export const useAddProductMutation = () => {
//   const queryClient = useQueryClient()

//   return useMutation(
//     (product: Product) => apiClient.post<Product>(`/api/products`, product),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['products'])
//       },
//     }
//   )
// }

// export const useUpdateProductMutation = () => {
//   const queryClient = useQueryClient()

//   return useMutation(
//     (product: Product) =>
//       apiClient.put<Product>(
//         `/api/products/id_data_barang/${product.id_data_barang}`,
//         product
//       ),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['products'])
//       },
//     }
//   )
// }
