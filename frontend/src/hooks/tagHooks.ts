import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { TagTypo } from '../types/Tag'

export const useGetTagsQuery = () =>
  useQuery({
    queryKey: ['tages'],
    queryFn: async () => (await apiClient.get<TagTypo[]>(`/api/tages`)).data,
  })

export const useAddTagMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: TagTypo) => apiClient.post<TagTypo>(`/api/tages`, regak),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tages'])
      },
    }
  )
}

export const useUpdateTagMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murahnye: TagTypo) =>
      apiClient.put<TagTypo>(`/api/tages/${murahnye._id}`, murahnye),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tages'])
      },
    }
  )
}

export const useDeleteTagMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahelnye: string) => apiClient.delete(`/api/tages/${mahelnye}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tages'])
      },
    }
  )
}
