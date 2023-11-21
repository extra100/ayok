import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { KopiPindah } from '../types/KopiPindah'

export const useGetKopiPindahsQuery = () =>
  useQuery({
    queryKey: ['kopipindahs'],
    queryFn: async () =>
      (await apiClient.get<KopiPindah[]>(`/api/kopipindahs`)).data,
  })

// export const useGetKopiPindahByIdQuery = (id_pindah: string) =>
//   useQuery({
//     queryKey: ['kopipindahs', id_pindah],
//     queryFn: async () =>
//       (await apiClient.get<KopiPindah>(`/api/kopipindahs/${id_pindah}`)).data,
//   })

export const useGetKopiPindahDetailQuery = (id_pindah: string) => {
  return useQuery({
    queryKey: ['getKopiPindahDetail', id_pindah],
    queryFn: async () =>
      (await apiClient.get<KopiPindah[]>(`/api/kopipindahs/${id_pindah}`)).data,
  })
}

// export const useAddKopiPindahMutation = () => {
//   const queryClient = useQueryClient()
//   return useMutation(
//     (regak: KopiPindah) => {
//       console.log('Data yang dikirim ke server:', regak) // Tambahkan baris ini
//       return apiClient.post<KopiPindah>(`/api/kopipindahs`, regak)
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['kopipindahs'])
//       },
//     }
//   )
// }
export const useAddKopiPindahMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: KopiPindah) =>
      apiClient.post<KopiPindah>(`/api/kopipindahs`, regak),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['kopipindahs'])
      },
    }
  )
}

export const useUpdateKopiPindahMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murahnye: KopiPindah[]) => {
      return apiClient
        .put<KopiPindah[]>(`/api/kopipindahs`, murahnye) // Mengirim seluruh editedData sebagai payload
        .then((response) => {
          console.log(
            'Respon dari server setelah pembaruan kopian:',
            response.data
          )
          return response
        })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['kopipindahs'])
      },
    }
  )
}

// export const useUpdateKopiPindahMutation = () => {
//   const queryClient = useQueryClient()

//   return useMutation(
//     (murahnye: KopiPindah) => {
//       return apiClient
//         .put<KopiPindah>(`/api/kopipindahs/${murahnye.id_pindah}`, murahnye)
//         .then((response) => {
//           console.log('Respon dari server setelah pembaruan:', response.data)
//           return response
//         })
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['kopipindahs'])
//       },
//     }
//   )
// }

export const useDeleteKopiPindahMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahelnye: string) => {
      console.log('ID yang akan dihapus:', mahelnye)
      const result = apiClient.delete(`/api/kopipindahs/${mahelnye}`)
      result.catch((error) => {
        console.error('Error saat menghapus:', error.response.data)
      })

      return result
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['kopipindahs'])
      },
    }
  )
}

// export const useDeleteKopiPindahMutation = () => {
//   const queryClient = useQueryClient()

//   return useMutation(
//     (mahelnye: string) => apiClient.delete(`/api/kopipindahs/${mahelnye}`),
//     {
//       onSuccess: (response) => {
//         console.log('Hasil dari delete mutation:', response)
//         queryClient.invalidateQueries(['kopipindahs'])
//       },
//     }
//   )
// }
