import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Harga } from '../types/Harga'

export const useGetHargasQuery = () =>
  useQuery({
    queryKey: ['hargas'],
    queryFn: async () => (await apiClient.get<Harga[]>(`/api/hargas`)).data,
  })

export const useAddHargaMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: Harga) => apiClient.post<Harga>(`/api/hargas`, regak),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['hargas'])
      },
    }
  )
}

export const useUpdateHargaMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murah: Harga) => apiClient.put<Harga>(`/api/hargas/${murah._id}`, murah),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['hargas'])
      },
    }
  )
}

export const useDeleteHargaMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahal: string) => apiClient.delete(`/api/hargas/${mahal}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['hargas'])
      },
    }
  )
}

// Pada bagian onSuccess, setelah permintaan berhasil (misalnya ketika server mengirimkan respons tanpa kesalahan), fungsi queryClient.invalidateQueries(['hargas']) akan dipanggil. Ini berarti setelah harga baru ditambahkan, data yang berkaitan dengan kunci query ['hargas'] akan dihapus dari cache.
// export const useAddHargaMutation = () => {
//   const queryClient = useQueryClient()
//   return useMutation(
//     (regak: Harga) => apiClient.post<Harga>(`/api/hargas`, regak),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['hargas'])
//       },
//     }
//   )
// }
