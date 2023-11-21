import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Pelanggan } from '../types/Pelanggan'

export const useGetPelanggansQuery = () =>
  useQuery({
    queryKey: ['pelanggans'],
    queryFn: async () =>
      (await apiClient.get<Pelanggan[]>(`/api/pelanggans`)).data,
  })

export const useAddPelangganMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (pelanggan: Pelanggan) =>
      apiClient.post<Pelanggan>(`/api/pelanggans`, pelanggan),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pelanggans'])
      },
    }
  )
}

export const useUpdatePelangganMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (pelanggan: Pelanggan) =>
      apiClient.put<Pelanggan>(`/api/pelanggans/${pelanggan._id}`, pelanggan),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pelanggans'])
      },
    }
  )
}

export const useDeletePelangganMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (pelangganId: string) => apiClient.delete(`/api/pelanggans/${pelangganId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pelanggans'])
      },
    }
  )
}
