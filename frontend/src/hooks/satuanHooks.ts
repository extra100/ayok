import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Satuan } from '../types/Satuan'

export const useGetSatuansQuery = () =>
  useQuery({
    queryKey: ['satuans'],
    queryFn: async () => (await apiClient.get<Satuan[]>(`/api/satuans`)).data,
  })

export const useAddSatuanMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: Satuan) => apiClient.post<Satuan>(`/api/satuans`, regak),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['satuans'])
      },
    }
  )
}

export const useUpdateSatuanMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murahnye: Satuan) =>
      apiClient.put<Satuan>(`/api/satuans/${murahnye._id}`, murahnye),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['satuans'])
      },
    }
  )
}

export const useDeleteSatuanMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahelnye: string) => apiClient.delete(`/api/satuans/${mahelnye}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['satuans'])
      },
    }
  )
}
