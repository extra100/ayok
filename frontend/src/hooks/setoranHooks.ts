import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Setoran } from '../types/Setoran'

export const useGetSetoransQuery = () =>
  useQuery({
    queryKey: ['setorans'],
    queryFn: async () => (await apiClient.get<Setoran[]>(`/api/setorans`)).data,
  })

export const useAddSetoranMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: Setoran) => apiClient.post<Setoran>(`/api/setorans`, regak),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['setorans'])
      },
    }
  )
}

export const useUpdateSetoranMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murah: Setoran) =>
      apiClient.put<Setoran>(`/api/setorans/${murah._id}`, murah),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['setorans'])
      },
    }
  )
}

export const useDeleteSetoranMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahal: string) => apiClient.delete(`/api/setorans/${mahal}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['setorans'])
      },
    }
  )
}
