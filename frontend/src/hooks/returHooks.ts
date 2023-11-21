import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Retur } from '../types/Retur'

export const useGetRetursQuery = () =>
  useQuery({
    queryKey: ['returs'],
    queryFn: async () => (await apiClient.get<Retur[]>(`/api/returs`)).data,
  })

export const useGetReturByIdQuery = (id_pos: string) =>
  useQuery({
    queryKey: ['returs', id_pos],
    queryFn: async () =>
      (await apiClient.get<Retur[]>(`/api/returs/${id_pos}`)).data,
  })

export const useGetReturDetailQuery = (id_pos: string) => {
  return useQuery({
    queryKey: ['getReturDetail', id_pos],
    queryFn: async () =>
      (await apiClient.get<Retur[]>(`/api/pos/${id_pos}`)).data,
  })
}

export const useAddReturMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: Retur) => {
      return apiClient.post<Retur>(`/api/returs`, regak)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['returs'])
      },
    }
  )
}
export const useUpdateReturMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murahnye: Retur) => {
      const result = apiClient.put<Retur>(
        `/api/returs/${murahnye.id_pos}`,
        murahnye
      )

      return result
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['returs'])
      },
    }
  )
}

export const useDeleteReturMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahelnye: string) => {
      console.log('ID yang akan dihapus:', mahelnye)
      const result = apiClient.delete(`/api/returs/${mahelnye}`)
      result.catch((error) => {
        console.error('Error saat menghapus:', error.response.data)
      })

      return result
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['returs'])
      },
    }
  )
}
