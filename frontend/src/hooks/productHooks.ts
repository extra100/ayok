import {
  QueryCache,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Product } from '../types/Product'

export const useGetProductsQuery = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: async () => (await apiClient.get<Product[]>(`/api/products`)).data,
  })

export const useGetProductDetailsById_data_barangQuery = (
  id_data_barang: string
) =>
  useQuery({
    queryKey: ['products', id_data_barang],
    queryFn: async () =>
      (
        await apiClient.get<Product>(
          `/api/products/id_data_barang/${id_data_barang}`
        )
      ).data,
  })

export const useAddProductMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (product: Product) => apiClient.post<Product>(`/api/products`, product),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['products'])
      },
    }
  )
}

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (product: Product) =>
      apiClient.put<Product>(`/api/products/${product._id}`, product),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['products'])
      },
    }
  )
}

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (productId: string) => apiClient.delete(`/api/products/${productId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['products'])
      },
    }
  )
}
export const useGetCategoriesQuery = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: async () =>
      (await apiClient.get<[]>(`/api/products/categories`)).data,
  })
