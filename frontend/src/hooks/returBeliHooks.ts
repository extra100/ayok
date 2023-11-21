import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { ReturBeli } from '../types/ReturBeli'

export const useGetreturbelisQuery = () =>
  useQuery({
    queryKey: ['returbelis'],
    queryFn: async () =>
      (await apiClient.get<ReturBeli[]>(`/api/returbelis`)).data,
  })

export const useGetReturBeliByIdQuery = (id_beli: string) =>
  useQuery({
    queryKey: ['returbelis', id_beli],
    queryFn: async () =>
      (await apiClient.get<ReturBeli[]>(`/api/returbelis/${id_beli}`)).data,
  })

export const useGetReturBeliDetailQuery = (id_beli: string) => {
  return useQuery({
    queryKey: ['getReturBeliDetail', id_beli],
    queryFn: async () =>
      (await apiClient.get<ReturBeli[]>(`/api/beli/${id_beli}`)).data,
  })
}

export const useAddReturBeliMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: ReturBeli) => {
      return apiClient.post<ReturBeli>(`/api/returbelis`, regak)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['returbelis'])
      },
    }
  )
}
export const useUpdateReturBeliMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murahnye: ReturBeli) => {
      const result = apiClient.put<ReturBeli>(
        `/api/returbelis/${murahnye.id_beli}`,
        murahnye
      )

      return result
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['returbelis'])
      },
    }
  )
}

export const useDeleteReturBeliMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahelnye: string) => {
      console.log('ID yang akan dihapus:', mahelnye)
      const result = apiClient.delete(`/api/returbelis/${mahelnye}`)
      result.catch((error) => {
        console.error('Error saat menghapus:', error.response.data)
      })

      return result
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['returbelis'])
      },
    }
  )
}
