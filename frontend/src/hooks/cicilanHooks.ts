import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Cicilan } from '../types/Cicilan'

export const useGetCicilansQuery = () =>
  useQuery({
    queryKey: ['cicilans'],
    queryFn: async () => (await apiClient.get<Cicilan[]>(`/api/cicilans`)).data,
  })

export const useGetCicilanByIdQuery = (id_pos: string) => {
  return useQuery({
    queryKey: ['cicilanDetail', id_pos],
    queryFn: async () =>
      (await apiClient.get<Cicilan[]>(`/api/cicilans/${id_pos}`)).data,
  })
}

export const useAddCicilanMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: Cicilan) => apiClient.post<Cicilan>(`/api/cicilans`, regak),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['cicilans'])
      },
    }
  )
}

export const useUpdateCicilanMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murahnye: Cicilan) =>
      apiClient.put<Cicilan>(`/api/cicilans/${murahnye._id}`, murahnye),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['cicilans'])
      },
    }
  )
}

export const useDeleteCicilanMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahelnye: string) => apiClient.delete(`/api/cicilans/${mahelnye}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['cicilans'])
      },
    }
  )
}
