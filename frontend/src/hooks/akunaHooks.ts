import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Akuna } from '../types/AKuna'

export const useGetAkunasQuery = () =>
  useQuery({
    queryKey: ['akunas'],
    queryFn: async () => (await apiClient.get<Akuna[]>(`/api/akunas`)).data,
  })

export const useGetAkunaByIdQuery = (id_pos: string) =>
  useQuery({
    queryKey: ['akunas', id_pos],
    queryFn: async () =>
      (await apiClient.get<Akuna>(`/api/akunas/${id_pos}`)).data,
  })

export const useGetAkunaDetailQuery = (id_pos: string) => {
  return useQuery({
    queryKey: ['getAkunaDetail', id_pos],
    queryFn: async () =>
      (await apiClient.get<Akuna[]>(`/api/pos/${id_pos}`)).data,
  })
}

export const useAddAkunaMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: Akuna) => {
      // console.log('Data yang dikirim ke server:', regak) // Tambahkan baris ini
      return apiClient.post<Akuna>(`/api/akunas`, regak)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['akunas'])
      },
    }
  )
}

// export const useUpdateAkunaMutation = () => {
//   const queryClient = useQueryClient()

//   return useMutation(
//     (murahnye: Akuna) => {
//       return apiClient
//         .put<Akuna>(`/api/akunas/${murahnye.id_pos}`, murahnye)
//         .then((response) => {
//           // console.log('Respon dari server setelah pembaruan:', response.data)
//           return response
//         })
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['akunas'])
//       },
//     }
//   )
// }
export const useUpdateAkunaMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murahnye: Akuna) => {
      const result = apiClient.put<Akuna>(
        `/api/akunas/${murahnye.id_akuna}`,
        murahnye
      )

      return result
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['akunas'])
      },
    }
  )
}

export const useDeleteAkunaMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahelnye: string) => {
      console.log('ID yang akan dihapus:', mahelnye)
      const result = apiClient.delete(`/api/akunas/${mahelnye}`)
      result.catch((error) => {
        console.error('Error saat menghapus:', error.response.data)
      })

      return result
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['akunas'])
      },
    }
  )
}

// export const useDeleteAkunaMutation = () => {
//   const queryClient = useQueryClient()

//   return useMutation(
//     (mahelnye: string) => apiClient.delete(`/api/akunas/${mahelnye}`),
//     {
//       onSuccess: (response) => {
//         console.log('Hasil dari delete mutation:', response)
//         queryClient.invalidateQueries(['akunas'])
//       },
//     }
//   )
// }
