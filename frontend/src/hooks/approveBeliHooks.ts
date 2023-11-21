import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { ApproveBeli } from '../types/ApproveBeli'

export const useGetApprovebelisQuery = () =>
  useQuery({
    queryKey: ['approvebelis'],
    queryFn: async () =>
      (await apiClient.get<ApproveBeli[]>(`/api/approvebelis`)).data,
  })

export const useGetApproveBeliByIdQuery = (id_beli: string) =>
  useQuery({
    queryKey: ['approvebelis', id_beli],
    queryFn: async () =>
      (await apiClient.get<ApproveBeli[]>(`/api/approvebelis/${id_beli}`)).data,
  })

// export const useGetApproveBeliDetailQuery = (id_beli: string) => {
//   return useQuery({
//     queryKey: ['getReturBeliDetail', id_beli],
//     queryFn: async () =>
//       (await apiClient.get<ApproveBeli[]>(`/api/beli/${id_beli}`)).data,
//   })
// }
export const useGetApproveBeliDetailQuery = (id_beli: string) => {
  return useQuery({
    queryKey: ['getApproveBeliDetail', id_beli],
    queryFn: async () =>
      (await apiClient.get<ApproveBeli[]>(`/api/approvebelis/${id_beli}`)).data,
  })
}

export const useAddApproveBeliMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: ApproveBeli) => {
      return apiClient.post<ApproveBeli>(`/api/approvebelis`, regak)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['approvebelis'])
      },
    }
  )
}
// export const useUpdateApproveBeliMutation = () => {
//   const queryClient = useQueryClient()

//   return useMutation(
//     (murahnye: ApproveBeli) => {
//       const result = apiClient.put<ApproveBeli>(
//         `/api/approvebelis/${murahnye.id_beli}`,
//         murahnye
//       )

//       return result
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['approvebelis'])
//       },
//     }
//   )
// }
export const useUpdateApproveBeliMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murahnye: ApproveBeli) => {
      const result = apiClient.put<ApproveBeli>(
        `/api/approvebelis/${murahnye.id_beli}`,
        murahnye
      )

      return result
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['approvebelis'])
      },
    }
  )
}

export const useDeleteApproveBeliMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahelnye: string) => {
      console.log('ID yang akan dihapus:', mahelnye)
      const result = apiClient.delete(`/api/approvebelis/${mahelnye}`)
      result.catch((error) => {
        console.error('Error saat menghapus:', error.response.data)
      })

      return result
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['approvebelis'])
      },
    }
  )
}
