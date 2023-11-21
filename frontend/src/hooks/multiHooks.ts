import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Multi } from '../types/Multi'

export const useGetMultisQuery = () =>
  useQuery({
    queryKey: ['multis'],
    queryFn: async () => (await apiClient.get<Multi[]>(`/api/multis`)).data,
  })

export const useAddMultiMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (multi: Multi) => apiClient.post<Multi>(`/api/multis`, multi),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['multis'])
      },
    }
  )
}

export const useUpdateMultiMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (multi: Multi) => apiClient.put<Multi>(`/api/multis/${multi._id}`, multi),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['multis'])
      },
    }
  )
}

export const useDeleteMultiMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (multiId: string) => apiClient.delete(`/api/multis/${multiId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['multis'])
      },
    }
  )
}
