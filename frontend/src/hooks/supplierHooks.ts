import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Supplier } from '../types/Supplier'

export const useGetSuppliersQuery = () =>
  useQuery({
    queryKey: ['suppliers'],
    queryFn: async () =>
      (await apiClient.get<Supplier[]>(`/api/suppliers`)).data,
  })

export const useAddSupplierMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (supplier: Supplier) =>
      apiClient.post<Supplier>(`/api/suppliers`, supplier),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['suppliers'])
      },
    }
  )
}

export const useUpdateSupplierMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (supplier: Supplier) =>
      apiClient.put<Supplier>(`/api/suppliers/${supplier._id}`, supplier),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['suppliers'])
      },
    }
  )
}

export const useDeleteSupplierMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (supplierId: string) => apiClient.delete(`/api/suppliers/${supplierId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['suppliers'])
      },
    }
  )
}
