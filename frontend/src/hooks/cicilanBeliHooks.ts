import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { CicilanBeli } from '../types/CicilanBeli'

export const useGetcicilansBeliQuery = () =>
  useQuery({
    queryKey: ['cicilansBeli'],
    queryFn: async () =>
      (await apiClient.get<CicilanBeli[]>(`/api/cicilansBeli`)).data,
  })

export const useGetCicilanBeliByIdQuery = (id_beli: string) => {
  return useQuery({
    queryKey: ['cicilanDetail', id_beli],
    queryFn: async () =>
      (await apiClient.get<CicilanBeli[]>(`/api/cicilansBeli/${id_beli}`)).data,
  })
}

export const useAddCicilanBeliMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: CicilanBeli) =>
      apiClient.post<CicilanBeli>(`/api/cicilansBeli`, regak),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['cicilansBeli'])
      },
    }
  )
}

export const useUpdateCicilanBeliMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murahnye: CicilanBeli) =>
      apiClient.put<CicilanBeli>(`/api/cicilansBeli/${murahnye._id}`, murahnye),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['cicilansBeli'])
      },
    }
  )
}

export const useDeleteCicilanBeliMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahelnye: string) => apiClient.delete(`/api/cicilansBeli/${mahelnye}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['cicilansBeli'])
      },
    }
  )
}
