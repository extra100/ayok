import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Outlet } from '../types/Outlet'

export const useGetoutletsQuery = () =>
  useQuery({
    queryKey: ['outlets'],
    queryFn: async () => (await apiClient.get<Outlet[]>(`/api/outlets`)).data,
  })

export const useAddoutletMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: Outlet) => apiClient.post<Outlet>(`/api/outlets`, regak),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['outlets'])
      },
    }
  )
}

export const useUpdateoutletMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murah: Outlet) =>
      apiClient.put<Outlet>(`/api/outlets/${murah._id}`, murah),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['outlets'])
      },
    }
  )
}

export const useDeleteoutletMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahal: string) => apiClient.delete(`/api/outlets/${mahal}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['outlets'])
      },
    }
  )
}

// Pada bagian onSuccess, setelah permintaan berhasil (misalnya ketika server mengirimkan respons tanpa kesalahan), fungsi queryClient.invalidateQueries(['outlets']) akan dipanggil. Ini berarti setelah outlet baru ditambahkan, data yang berkaitan dengan kunci query ['outlets'] akan dihapus dari cache.
// export const useAddoutletMutation = () => {
//   const queryClient = useQueryClient()
//   return useMutation(
//     (regak: Outlet) => apiClient.post<Outlet>(`/api/outlets`, regak),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['outlets'])
//       },
//     }
//   )
// }
