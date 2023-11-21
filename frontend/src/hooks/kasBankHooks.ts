import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { KasBank } from '../types/KasBank'

export const useGetKasBanksQuery = () =>
  useQuery({
    queryKey: ['kasbanks'],
    queryFn: async () => (await apiClient.get<KasBank[]>(`/api/kasbanks`)).data,
  })

export const useAddKasBankMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: KasBank) => apiClient.post<KasBank>(`/api/kasbanks`, regak),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['kasbanks'])
      },
    }
  )
}

export const useUpdateKasBankMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murah: KasBank) =>
      apiClient.put<KasBank>(`/api/kasbanks/${murah._id}`, murah),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['kasbanks'])
      },
    }
  )
}

export const useDeleteKasBankMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahal: string) => apiClient.delete(`/api/kasbanks/${mahal}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['kasbanks'])
      },
    }
  )
}
