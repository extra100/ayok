import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Transaksi } from '../types/Transaksi'

export const useGetTransaksisQuery = () =>
  useQuery({
    queryKey: ['transaksis'],
    queryFn: async () =>
      (await apiClient.get<Transaksi[]>(`/api/transaksis`)).data,
  })

export const useAddTransaksiMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: Transaksi) => apiClient.post<Transaksi>(`/api/transaksis`, regak),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['transaksis'])
      },
    }
  )
}

export const useUpdateTransaksiMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murah: Transaksi) =>
      apiClient.put<Transaksi>(`/api/transaksis/${murah._id}`, murah),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['transaksis'])
      },
    }
  )
}

export const useDeleteTransaksiMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahal: string) => apiClient.delete(`/api/transaksis/${mahal}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['transaksis'])
      },
    }
  )
}

// Pada bagian onSuccess, setelah permintaan berhasil (misalnya ketika server mengirimkan respons tanpa kesalahan), fungsi queryClient.invalidateQueries(['transaksis']) akan dipanggil. Ini berarti setelah harga baru ditambahkan, data yang berkaitan dengan kunci query ['transaksis'] akan dihapus dari cache.
// export const useAddTransaksiMutation = () => {
//   const queryClient = useQueryClient()
//   return useMutation(
//     (regak: Transaksi) => apiClient.post<Transaksi>(`/api/transaksis`, regak),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['transaksis'])
//       },
//     }
//   )
// }
