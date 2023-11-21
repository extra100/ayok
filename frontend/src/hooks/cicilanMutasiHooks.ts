import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { CicilanMutasi } from '../types/CicilanMutasi'

export const useGetCicilanmutasisQuery = () =>
  useQuery({
    queryKey: ['cicilanmutasis'],
    queryFn: async () =>
      (await apiClient.get<CicilanMutasi[]>(`/api/cicilanmutasis`)).data,
  })

export const useGetcicilanMutasiByIdQuery = (id_pos: string) => {
  return useQuery({
    queryKey: ['cicilanDetail', id_pos],
    queryFn: async () =>
      (await apiClient.get<CicilanMutasi[]>(`/api/cicilanmutasis/${id_pos}`))
        .data,
  })
}

export const useAddCicilanMutasiMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: CicilanMutasi) =>
      apiClient.post<CicilanMutasi>(`/api/cicilanmutasis`, regak),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['cicilanmutasis'])
      },
    }
  )
}

export const useUpdateCicilanMutasiMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murahnye: CicilanMutasi) =>
      apiClient.put<CicilanMutasi>(
        `/api/cicilanmutasis/${murahnye._id}`,
        murahnye
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['cicilanmutasis'])
      },
    }
  )
}

export const useDeleteCicilanMutasiMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahelnye: string) => apiClient.delete(`/api/cicilanmutasis/${mahelnye}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['cicilanmutasis'])
      },
    }
  )
}
