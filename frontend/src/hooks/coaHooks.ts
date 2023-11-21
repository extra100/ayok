import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Coa } from '../types/coa'

export const useGetCoasQuery = () =>
  useQuery({
    queryKey: ['coas'],
    queryFn: async () => (await apiClient.get<Coa[]>(`/api/coas`)).data,
  })

export const useAddCoaMutation = () => {
  const queryClient = useQueryClient()
  return useMutation((regak: Coa) => apiClient.post<Coa>(`/api/coas`, regak), {
    onSuccess: () => {
      queryClient.invalidateQueries(['coas'])
    },
  })
}

export const useUpdateCoaMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murah: Coa) => apiClient.put<Coa>(`/api/coas/${murah._id}`, murah),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['coas'])
      },
    }
  )
}

export const useDeleteCoaMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahal: string) => apiClient.delete(`/api/coas/${mahal}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['coas'])
      },
    }
  )
}
