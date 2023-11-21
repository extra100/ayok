import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Kind } from '../types/Kind'

export const useGetKindsQuery = () =>
  useQuery({
    queryKey: ['kinds'],
    queryFn: async () => (await apiClient.get<Kind[]>(`/api/kinds`)).data,
  })

// export const useGetSupplierDetailsById_kategoriQuery = (id_kategori: string) =>
//   useQuery({
//     queryKey: ['kinds', id_kategori],
//     queryFn: async () =>
//       (
//         await apiClient.get<Kind>(
//           `/api/kind/id_kategori/${id_kategori}`
//         )
//       ).data,
//   })

export const useAddKindMutation = () => {
  const queryClient = useQueryClient()
  return useMutation((kind: Kind) => apiClient.post<Kind>(`/api/kinds`, kind), {
    onSuccess: () => {
      queryClient.invalidateQueries(['kinds'])
    },
  })
}

export const useUpdateKindMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (kind: Kind) => apiClient.put<Kind>(`/api/kinds/${kind._id}`, kind),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['kinds'])
      },
    }
  )
}

export const useDeleteKindMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (kindId: string) => apiClient.delete(`/api/kinds/${kindId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['kinds'])
      },
    }
  )
}
