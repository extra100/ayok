import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { KategoriAkun } from '../types/KategoriAkun'

export const useGetKategoriAkunsQuery = () =>
  useQuery({
    queryKey: ['kategoriAkuns'],
    queryFn: async () =>
      (await apiClient.get<KategoriAkun[]>(`/api/kategoriAkuns`)).data,
  })

export const useAddKategoriAkunMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: KategoriAkun) =>
      apiClient.post<KategoriAkun>(`/api/kategoriAkuns`, regak),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['kategoriAkuns'])
      },
    }
  )
}

export const useUpdateKategoriAkunMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murah: KategoriAkun) =>
      apiClient.put<KategoriAkun>(`/api/kategoriAkuns/${murah._id}`, murah),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['kategoriAkuns'])
      },
    }
  )
}

export const useDeleteKategoriAkunMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahal: string) => apiClient.delete(`/api/kategoriAkuns/${mahal}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['kategoriAkuns'])
      },
    }
  )
}
