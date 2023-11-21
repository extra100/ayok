import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Pos } from '../types/Pos'

export const useGetPossQuery = () =>
  useQuery({
    queryKey: ['poss'],
    queryFn: async () => (await apiClient.get<Pos[]>(`/api/poss`)).data,
  })

export const useGetPosByIdQuery = (id_pos: string) =>
  useQuery({
    queryKey: ['poss', id_pos],
    queryFn: async () => (await apiClient.get<Pos>(`/api/poss/${id_pos}`)).data,
  })

export const useGetPosDetailQuery = (id_pos: string) => {
  return useQuery({
    queryKey: ['getPosDetail', id_pos],
    queryFn: async () =>
      (await apiClient.get<Pos[]>(`/api/pos/${id_pos}`)).data,
  })
}

export const useAddPosMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: Pos) => {
      // console.log('Data yang dikirim ke server:', regak) // Tambahkan baris ini
      return apiClient.post<Pos>(`/api/poss`, regak)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['poss'])
      },
    }
  )
}

// export const useUpdatePosMutation = () => {
//   const queryClient = useQueryClient()

//   return useMutation(
//     (murahnye: Pos) => {
//       return apiClient
//         .put<Pos>(`/api/poss/${murahnye.id_pos}`, murahnye)
//         .then((response) => {
//           // console.log('Respon dari server setelah pembaruan:', response.data)
//           return response
//         })
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['poss'])
//       },
//     }
//   )
// }
export const useUpdatePosMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murahnye: Pos) => {
      const result = apiClient.put<Pos>(
        `/api/poss/${murahnye.id_pos}`,
        murahnye
      )

      return result
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['poss'])
      },
    }
  )
}

export const useDeletePosMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahelnye: string) => {
      console.log('ID yang akan dihapus:', mahelnye)
      const result = apiClient.delete(`/api/poss/${mahelnye}`)
      result.catch((error) => {
        console.error('Error saat menghapus:', error.response.data)
      })

      return result
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['poss'])
      },
    }
  )
}

// export const useDeletePosMutation = () => {
//   const queryClient = useQueryClient()

//   return useMutation(
//     (mahelnye: string) => apiClient.delete(`/api/poss/${mahelnye}`),
//     {
//       onSuccess: (response) => {
//         console.log('Hasil dari delete mutation:', response)
//         queryClient.invalidateQueries(['poss'])
//       },
//     }
//   )
// }
