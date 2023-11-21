import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Penjualan } from '../types/Penjualan'

export const useGetPenjualansQuery = () =>
  useQuery({
    queryKey: ['penjualans'],
    queryFn: async () =>
      (await apiClient.get<Penjualan[]>(`/api/penjualans`)).data,
  })
export const useGetsPenjualansQuery = () =>
  useQuery({
    queryKey: ['penjualans'],
    queryFn: async () =>
      (await apiClient.get<Penjualan>(`/api/penjualans`)).data,
  })
export const useGetPenjualanByIdQuery = (id_pos: string) => {
  return useQuery({
    queryKey: ['penjualanDetail', id_pos],
    queryFn: async () =>
      (await apiClient.get<Penjualan[]>(`/api/penjualans/${id_pos}`)).data,
  })
}
export const useAddPenjualanMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: Penjualan) => apiClient.post<Penjualan>(`/api/penjualans`, regak),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['penjualans'])
      },
    }
  )
}

export const useUpdatePenjualanMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murahnye: Penjualan) => {
      const result = apiClient.put<Penjualan>(
        `/api/penjualans/${murahnye.id_pos}`,
        murahnye
      )

      return result
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['penjualans'])
      },
    }
  )
}

// export const useUpdatePenjualanMutation = () => {
//   const queryClient = useQueryClient()
//   return useMutation(
//     (murah: Penjualan) =>
//       apiClient.put<Penjualan>(`/api/penjualans/${murah.id_pos}`, murah),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['penjualans'])
//       },
//     }
//   )
// }

export const useDeletePenjualanMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahal: string) => apiClient.delete(`/api/penjualans/${mahal}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['penjualans'])
      },
    }
  )
}
