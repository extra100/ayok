import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Beli } from '../types/Beli'

export const useGetBelisQuery = () =>
  useQuery({
    queryKey: ['belis'],
    queryFn: async () => (await apiClient.get<Beli[]>(`/api/belis`)).data,
  })

export const useGetBeliByIdQuery = (id_beli: string) =>
  useQuery({
    queryKey: ['belis', id_beli],
    queryFn: async () =>
      (await apiClient.get<Beli>(`/api/belis/${id_beli}`)).data,
  })

export const useGetBeliDetailQuery = (id_beli: string) => {
  return useQuery({
    queryKey: ['getBeliDetail', id_beli],
    queryFn: async () =>
      (await apiClient.get<Beli[]>(`/api/belis/${id_beli}`)).data,
  })
}

export const useAddBeliMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: Beli) => {
      return apiClient.post<Beli>(`/api/belis`, regak)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['belis'])
      },
    }
  )
}

export const useUpdateBeliMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murahnye: Beli) => {
      return apiClient
        .put<Beli>(`/api/belis/${murahnye.id_beli}`, murahnye)
        .then((response) => {
          console.log('Respon dari server setelah pembaruan:', response.data)
          return response
        })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['belis'])
      },
    }
  )
}

export const useDeleteBeliMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahelnye: string) => {
      console.log('ID yang akan dihapus:', mahelnye)
      const result = apiClient.delete(`/api/belis/${mahelnye}`)
      result.catch((error) => {
        console.error('Error saat menghapus:', error.response.data)
      })

      return result
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['belis'])
      },
    }
  )
}

// export const useDeleteBeliMutation = () => {
//   const queryClient = useQueryClient()

//   return useMutation(
//     (mahelnye: string) => apiClient.delete(`/api/belis/${mahelnye}`),
//     {
//       onSuccess: (response) => {
//         console.log('Hasil dari delete mutation:', response)
//         queryClient.invalidateQueries(['belis'])
//       },
//     }
//   )
// }
