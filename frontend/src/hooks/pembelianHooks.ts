import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Pembelian } from '../types/Pembelian'

export const useGetPembeliansQuery = () =>
  useQuery({
    queryKey: ['pembelians'],
    queryFn: async () =>
      (await apiClient.get<Pembelian[]>(`/api/pembelians`)).data,
  })

export const useGetPembelianByIdQuery = (id_beli: string) => {
  return useQuery({
    queryKey: ['penjualanDetail', id_beli],
    queryFn: async () =>
      (await apiClient.get<Pembelian[]>(`/api/pembelians/${id_beli}`)).data,
  })
}
export const useAddPembelianMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: Pembelian) => apiClient.post<Pembelian>(`/api/pembelians`, regak),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pembelians'])
      },
    }
  )
}

export const useUpdatePembelianMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murahnye: Pembelian) => {
      const result = apiClient.put<Pembelian>(
        `/api/pembelians/${murahnye.id_beli}`,
        murahnye
      )

      return result
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pembelians'])
      },
    }
  )
}

// export const useUpdatePembelianMutation = () => {
//   const queryClient = useQueryClient()
//   return useMutation(
//     (murah: Pembelian) =>
//       apiClient.put<Pembelian>(`/api/pembelians/${murah.id_beli}`, murah),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['pembelians'])
//       },
//     }
//   )
// }

export const useDeletePembelianMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahal: string) => apiClient.delete(`/api/pembelians/${mahal}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pembelians'])
      },
    }
  )
}
