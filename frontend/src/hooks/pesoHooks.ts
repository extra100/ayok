import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Peso } from '../types/Peso'

export const useGetPesosQuery = () =>
  useQuery({
    queryKey: ['pesos'],
    queryFn: async () => (await apiClient.get<Peso[]>(`/api/pesos`)).data,
  })

export const useGetPesoByIdQuery = (id_peso: string) =>
  useQuery({
    queryKey: ['pesos', id_peso],
    queryFn: async () =>
      (await apiClient.get<Peso[]>(`/api/pesos/${id_peso}`)).data,
  })

export const useGetPesoDetailQuery = (id_peso: string) => {
  return useQuery({
    queryKey: ['getPesoDetail', id_peso],
    queryFn: async () =>
      (await apiClient.get<Peso[]>(`/api/pesos/${id_peso}`)).data,
  })
}

export const useAddPesoMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: Peso) => {
      // console.log('Data yang dikirim ke server:', regak) // Tambahkan baris ini
      return apiClient.post<Peso>(`/api/pesos`, regak)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pesos'])
      },
    }
  )
}

// export const useUpdatePesoMutation = () => {
//   const queryClient = useQueryClient()

//   return useMutation(
//     (murahnye: Peso) => {
//       return apiClient
//         .put<Peso>(`/api/pesos/${murahnye.id_peso}`, murahnye)
//         .then((response) => {
//           // console.log('Respon dari server setelah pembaruan:', response.data)
//           return response
//         })
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['pesos'])
//       },
//     }
//   )
// }
export const useUpdatePesoMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murahnye: Peso) => {
      const result = apiClient.put<Peso>(
        `/api/pesos/${murahnye.id_peso}`,
        murahnye
      )

      return result
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pesos'])
      },
    }
  )
}

export const useDeletePesoMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahelnye: string) => {
      console.log('ID yang akan dihapus:', mahelnye)
      const result = apiClient.delete(`/api/pesos/${mahelnye}`)
      result.catch((error) => {
        console.error('Error saat menghapus:', error.response.data)
      })

      return result
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pesos'])
      },
    }
  )
}

// export const useDeletePesoMutation = () => {
//   const queryClient = useQueryClient()

//   return useMutation(
//     (mahelnye: string) => apiClient.delete(`/api/pesos/${mahelnye}`),
//     {
//       onSuccess: (response) => {
//         console.log('Hasil dari delete mutation:', response)
//         queryClient.invalidateQueries(['pesos'])
//       },
//     }
//   )
// }
