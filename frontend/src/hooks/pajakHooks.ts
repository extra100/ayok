import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Pajak } from '../types/Pajak'

export const useGetPajaksQuery = () =>
  useQuery({
    queryKey: ['pajaks'],
    queryFn: async () => (await apiClient.get<Pajak[]>(`/api/pajaks`)).data,
  })

export const useGetPajakByIdQuery = (id_pajak: string) =>
  useQuery({
    queryKey: ['pajaks', id_pajak],
    queryFn: async () =>
      (await apiClient.get<Pajak>(`/api/pajaks/${id_pajak}`)).data,
  })

export const useGetPajakDetailQuery = (id_pajak: string) => {
  return useQuery({
    queryKey: ['getdPajakDetail', id_pajak],
    queryFn: async () =>
      (await apiClient.get<Pajak[]>(`/api/Pajak/${id_pajak}`)).data,
  })
}

export const useAdddPajakMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: Pajak) => {
      // console.log('Data yang dikirim ke server:', regak) // Tambahkan baris ini
      return apiClient.post<Pajak>(`/api/pajaks`, regak)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pajaks'])
      },
    }
  )
}

export const useUpdatedPajakMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murahnye: Pajak) => {
      const result = apiClient.put<Pajak>(
        `/api/pajaks/${murahnye.id_pajak}`,
        murahnye
      )

      return result
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pajaks'])
      },
    }
  )
}

export const useDeletedPajakMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahelnye: string) => {
      console.log('ID yang akan dihapus:', mahelnye)
      const result = apiClient.delete(`/api/pajaks/${mahelnye}`)
      result.catch((error) => {
        console.error('Error saat menghapus:', error.response.data)
      })

      return result
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pajaks'])
      },
    }
  )
}

// export const useDeletedPajakMutation = () => {
//   const queryClient = useQueryClient()

//   return useMutation(
//     (mahelnye: string) => apiClient.delete(`/api/pajaks/${mahelnye}`),
//     {
//       onSuccess: (response) => {
//         console.log('Hasil dari delete mutation:', response)
//         queryClient.invalidateQueries(['pajaks'])
//       },
//     }
//   )
// }
