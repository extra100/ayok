const { data: pindahs } = useGetPindahDetailQuery(id_pindah as string)
const { data: stokku } = useGetStoksQuery()
const stoks = useUpdateStokMutations()
const handleSimpan = async () => {
  if (pindahs && pindahs.length > 0 && stokku) {
    // Salin array stokku untuk menghindari mutasi langsung
    const updatedStokku = [...stokku]

    // Loop melalui semua elemen pindahs
    pindahs.forEach((pindah) => {
      // Temukan stok yang sesuai berdasarkan id_data_barang dan id_outlet
      const matchingStokIndex = updatedStokku.findIndex(
        (stok) =>
          stok.id_data_barang === pindah.id_data_barang &&
          stok.id_outlet === idOutletLoggedIn
      )

      if (matchingStokIndex !== -1) {
        // Perbarui jumlah stok di dalam array yang disalin
        updatedStokku[matchingStokIndex].jumlah_stok += parseInt(
          pindah.qty_beri,
          10
        )
      }
    })

    // Lakukan pembaruan stok dengan memanggil fungsi useUpdateStokMutation
    try {
      await stoks.mutateAsync(updatedStokku)

      // Lanjutkan dengan operasi lain yang diperlukan setelah pembaruan stok berhasil
      mutation.mutateAsync(editedData).then(() => {
        setIsEditing(false)
      })
    } catch (error) {
      console.error('Gagal mengupdate stok:', error)
    }
  }
}

export const useUpdateStokMutations = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (updatedStokku: Stok[]) => {
      // Membuat promise untuk setiap pembaruan stok
      const updatePromises = updatedStokku.map(async (stok) => {
        const response = await apiClient.put<Stok>(
          `/api/stoks/${stok._id}`,
          stok
        )
        return response.data // Mengembalikan data stok yang diperbarui
      })

      // Menjalankan semua promise pembaruan stok secara paralel
      const updatedStokkuResult = await Promise.all(updatePromises)

      return updatedStokkuResult
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['stoks'])
        queryClient.refetchQueries(['stoks'])
      },
    }
  )
}
