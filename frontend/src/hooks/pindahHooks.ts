import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Pindah } from '../types/Pindah'

export const useGetPindahsQuery = () =>
  useQuery({
    queryKey: ['pindahs'],
    queryFn: async () => (await apiClient.get<Pindah[]>(`/api/pindahs`)).data,
  })

export const useGetPindahByIdQuery = (id_pindah: string) =>
  useQuery({
    queryKey: ['pindahs', id_pindah],
    queryFn: async () =>
      (await apiClient.get<Pindah[]>(`/api/pindahs/${id_pindah}`)).data,
  })

export const useGetPindahDetailQuery = (id_pindah: string) => {
  return useQuery({
    queryKey: ['getPindahDetail', id_pindah],
    queryFn: async () =>
      (await apiClient.get<Pindah[]>(`/api/pindahs/${id_pindah}`)).data,
  })
}

// export const useAddPindahMutation = () => {
//   const queryClient = useQueryClient()
//   return useMutation(
//     (regak: Pindah) => {
//       console.log('Data yang dikirim ke server:', regak) // Tambahkan baris ini
//       return apiClient.post<Pindah>(`/api/pindahs`, regak)
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['pindahs'])
//       },
//     }
//   )
// }
export const useAddPindahMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: Pindah) => apiClient.post<Pindah>(`/api/pindahs`, regak),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pindahs'])
      },
    }
  )
}

export const useUpdatePindahMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murahnye: Pindah[]) => {
      return apiClient
        .put<Pindah[]>(`/api/pindahs`, murahnye) // Mengirim seluruh editedData sebagai payload
        .then((response) => {
          // console.log(
          //   'Respon dari server setelah pembaruan pindahs:',
          //   response.data
          // )
          return response
        })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pindahs'])
      },
    }
  )
}

// export const useUpdatePindahMutation = () => {
//   const queryClient = useQueryClient()

//   return useMutation(
//     (murahnye: Pindah) => {
//       return apiClient
//         .put<Pindah>(`/api/pindahs/${murahnye.id_pindah}`, murahnye)
//         .then((response) => {
//           console.log('Respon dari server setelah pembaruan:', response.data)
//           return response
//         })
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['pindahs'])
//       },
//     }
//   )
// }

export const useDeletePindahMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahelnye: string) => {
      console.log('ID yang akan dihapus:', mahelnye)
      const result = apiClient.delete(`/api/pindahs/${mahelnye}`)
      result.catch((error) => {
        console.error('Error saat menghapus:', error.response.data)
      })

      return result
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pindahs'])
      },
    }
  )
}

// export const useDeletePindahMutation = () => {
//   const queryClient = useQueryClient()

//   return useMutation(
//     (mahelnye: string) => apiClient.delete(`/api/pindahs/${mahelnye}`),
//     {
//       onSuccess: (response) => {
//         console.log('Hasil dari delete mutation:', response)
//         queryClient.invalidateQueries(['pindahs'])
//       },
//     }
//   )
// }
