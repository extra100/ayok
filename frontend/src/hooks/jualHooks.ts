import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Jual } from '../types/Jual'

export const useGetJualsQuery = () =>
  useQuery({
    queryKey: ['Juals'],
    queryFn: async () => (await apiClient.get<Jual[]>(`/api/Juals`)).data,
  })

export const useAddJualMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: Jual) => apiClient.post<Jual>(`/api/Juals`, regak),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['Juals'])
      },
    }
  )
}

export const useUpdateJualMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murah: Jual) => apiClient.put<Jual>(`/api/Juals/${murah._id}`, murah),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['Juals'])
      },
    }
  )
}

export const useDeleteJualMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahal: string) => apiClient.delete(`/api/Juals/${mahal}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['Juals'])
      },
    }
  )
}
