import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Mutasi } from '../types/Mutasi'

export const useGetMutasisQuery = () =>
  useQuery({
    queryKey: ['mutasis'],
    queryFn: async () => (await apiClient.get<Mutasi[]>(`/api/mutasis`)).data,
  })

export const useAddMutasiMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (multi: Mutasi) => apiClient.post<Mutasi[]>(`/api/mutasis`, multi),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['mutasis'])
      },
    }
  )
}

export const useUpdateMutasiMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (multi: Mutasi) =>
      apiClient.put<Mutasi>(`/api/mutasis/${multi.id_mutasi}`, multi),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['mutasis'])
      },
    }
  )
}

export const useDeleteMutasiMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (multiId: string) => apiClient.delete(`/api/mutasis/${multiId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['mutasis'])
      },
    }
  )
}
