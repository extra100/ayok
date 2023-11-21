import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Bank } from '../types/Bank'

export const useGetBanksQuery = () =>
  useQuery({
    queryKey: ['banks'],
    queryFn: async () => (await apiClient.get<Bank[]>(`/api/banks`)).data,
  })

export const useAddBankMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: Bank) => apiClient.post<Bank>(`/api/banks`, regak),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['banks'])
      },
    }
  )
}

export const useUpdateBankMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murah: Bank) => apiClient.put<Bank>(`/api/banks/${murah._id}`, murah),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['banks'])
      },
    }
  )
}

export const useDeleteBankMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahal: string) => apiClient.delete(`/api/banks/${mahal}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['banks'])
      },
    }
  )
}
