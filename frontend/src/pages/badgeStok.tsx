import { useParams } from 'react-router-dom'
import { Badge, Button, Select, Table } from 'antd'
import {
  useAddPosMutation,
  useGetPosDetailQuery,
  useUpdatePosMutation,
} from '../hooks/posHooks'
import { useGetPenjualanByIdQuery } from '../hooks/penjualanHooks'
import { useState } from 'react'
import { useGetProductsQuery } from '../hooks/productHooks'
import { Option } from 'antd/es/mentions'
import { useGetHargasQuery } from '../hooks/hargaHooks'
import { useGetStoksQuery, useUpdateStokMutation } from '../hooks/stokHooks'
import { Stok } from '../types/Stok'
import { Pos } from '../types/Pos'

const DetailPosPage: React.FC = () => {
  const { id_pos } = useParams<{ id_pos?: string }>()
  const { data: getPosDetail } = useGetPosDetailQuery(id_pos as string)

  const { data: penjualanData } = useGetPenjualanByIdQuery(id_pos as string)
  const penjualan = penjualanData?.[0]
  const inv = penjualanData?.[0]?.inv || '0'

  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState<any[]>([])

  const updatePos = useUpdatePosMutation()
  const handleInputChange = (recordId: string, key: string, value: any) => {
    const originalData = getPosDetail?.find(
      (freeeeee) => freeeeee._id === recordId
    )
    const updatedData = [...editedData]
    const index = updatedData.findIndex((freeeeee) => freeeeee._id === recordId)
    const newData = {
      ...originalData,
      [key]: value,
    }
    if (index >= 0) {
      updatedData[index] = newData
    } else {
      updatedData.push(newData)
    }
    setEditedData(updatedData)
  }

  const updateStokSetelahEdit = useUpdateStokMutation()
  const handleSave = () => {
    editedData.forEach((item) => {
      updatePos.mutate(item)

      const correspondingStok: Stok | undefined = stoksData!.find(
        (stok: Stok) => stok.id_data_barang === item.id_data_barang
      )

      if (correspondingStok) {
        const existingQty: number =
          getPosDetail?.find((detail: Pos) => detail._id === item._id)
            ?.qty_sold || 0

        const newStokQty =
          correspondingStok.jumlah_stok - (Number(item.qty_sold) - existingQty)

        updateStokSetelahEdit.mutate({
          ...correspondingStok,
          jumlah_stok: newStokQty,
        })
      }
    })
  }

  const toggleEditing = () => {
    setIsEditing((prev) => !prev)
  }
  const { data: products } = useGetProductsQuery()
  const getProductNameById = (id: string) => {
    const product = products?.find((product: any) => product._id === id)
    return product?.nama_barang || id
  }

  const { data: hargas } = useGetHargasQuery()
  const dapatkanNamaHarga = (id: string) => {
    const harga = hargas?.find((harga: any) => harga._id === id)
    return harga?.jenis_harga || id
  }

  const { data: stoksData } = useGetStoksQuery()

  const isQtyExceedingStok = (record: any) => {
    if (!stoksData) return false

    const correspondingStok: Stok | undefined = stoksData.find(
      (stok: Stok) => stok.id_data_barang === record.id_data_barang
    )

    const existingQty: number =
      getPosDetail?.find((detail: Pos) => detail._id === record._id)
        ?.qty_sold || 0

    if (correspondingStok) {
      if (correspondingStok.jumlah_stok <= 0) return true

      if (
        existingQty + correspondingStok.jumlah_stok <
        Number(record.qty_sold)
      ) {
        console.log('Stok is exceeding for item:', record.id_data_barang)
        return true
      }

      console.log(
        'correspondingStok.jumlah_stok:',
        correspondingStok?.jumlah_stok
      )
      console.log('existingQty:', existingQty)
      console.log('record.qty_sold:', record.qty_sold)
    }
    return false
  }
  const anyQtyExceedingStok = (): boolean => {
    if (!editedData || !stoksData) return false

    for (let item of editedData) {
      if (isQtyExceedingStok(item)) {
        return true
      }
    }

    return false
  }

  // const isStockDepleted = (itemId: string): boolean => {
  //   const stokKoosong: Stok | undefined = stoksData?.find(
  //     (stok: Stok) => stok.id_data_barang === itemId
  //   )
  //   if (stokKoosong && stokKoosong.jumlah_stok <= 0) return true
  //   return false
  // }

  const isStockDepleted = (itemId: string): boolean => {
    const stokKoosong: Stok | undefined = stoksData?.find(
      (stok: Stok) => stok.id_data_barang === itemId
    )

    const correspondingPos: Pos | undefined = getPosDetail?.find(
      (detail: Pos) => detail.id_data_barang === itemId
    )

    if (stokKoosong && stokKoosong.jumlah_stok <= 0) return true
    if (correspondingPos && parseInt(correspondingPos.total) === 0) return true

    return false
  }

  const shouldBlockInput = (itemId: string): boolean => {
    if (isStockDepleted(itemId)) return true

    const diDalamTbale: Pos | undefined = getPosDetail?.find(
      (detail: Pos) => detail.id_data_barang === itemId
    )

    if (diDalamTbale && parseInt(diDalamTbale.total) === 0) return false

    return true
  }

  const badgeStok = (productId: string): number => {
    const stokItem: Stok | undefined = stoksData?.find(
      (stok: Stok) => stok.id_data_barang === productId
    )
    return stokItem?.jumlah_stok || 0
  }

  const columns = [
    {
      title: 'Harga Jual',
      dataIndex: 'harga_jual',
      key: 'harga_jual',
      render: (text: string, record: any) =>
        isEditing ? (
          <input
            defaultValue={text}
            onChange={(e) =>
              handleInputChange(record._id, 'harga_jual', e.target.value)
            }
          />
        ) : (
          `Rp. ${text}`
        ),
    },

    // {
    //   title: 'Nama Barang',
    //   dataIndex: 'id_data_barang',
    //   key: 'nama_barang',
    //   render: (id_data_barang: string, record: any) => {
    //     if (isEditing) {
    //       return (
    //         <Select
    //           defaultValue={id_data_barang}
    //           style={{ width: 200 }}
    //           onChange={(value) =>
    //             handleInputChange(record._id, 'id_data_barang', value)
    //           }
    //         >
    //           {products?.map((product) => (
    //             <Option key={product._id} value={product._id}>
    //               {product.nama_barang}
    //             </Option>
    //           ))}
    //         </Select>
    //       )
    //     } else {
    //       return getProductNameById(id_data_barang)
    //     }
    //   },
    // },
    {
      title: 'Nama Barang',
      dataIndex: 'id_data_barang',
      key: 'nama_barang',
      render: (id_data_barang: string, record: any) => {
        console.log(
          'Initial record.qty_sold for',
          record.id_data_barang,
          record.qty_sold
        )

        const blockInputForThisItem = shouldBlockInput(id_data_barang)

        if (isEditing) {
          return (
            <Select
              defaultValue={id_data_barang}
              style={{ width: 300 }}
              onChange={(value) => {
                console.log('Input value terakhir:', value)
                handleInputChange(record._id, 'id_data_barang', value)
              }}
              disabled={blockInputForThisItem} // Blokir input berdasarkan kondisi
            >
              {products?.map((product) => (
                <Option key={product._id} value={product._id}>
                  {product.nama_barang}
                  <Badge
                    count={badgeStok(product._id)}
                    overflowCount={999999}
                    style={{ marginLeft: '10px' }}
                  />
                </Option>
              ))}
            </Select>
          )
        } else {
          return getProductNameById(id_data_barang)
        }
      },
    },

    {
      title: 'Qty',
      dataIndex: 'qty_sold',
      key: 'qty_sold',
      render: (text: string, record: any) => {
        const stockIsDepleted = isStockDepleted(record.id_data_barang)
        const qtyExceedsStock = isQtyExceedingStok(record)
        const blockInput = stockIsDepleted || qtyExceedsStock

        let warningText = ''
        if (stockIsDepleted) warningText = 'Stok Kosong'
        else if (qtyExceedsStock) warningText = 'Stok Tidak Mencukupi'

        return isEditing ? (
          <div style={{ position: 'relative' }}>
            <input
              defaultValue={text}
              onChange={(e) =>
                handleInputChange(record._id, 'qty_sold', e.target.value)
              }
              readOnly={blockInput}
              style={blockInput ? { backgroundColor: '#FAFAFA' } : {}}
            />
            {blockInput && (
              <span
                style={{
                  color: 'red',
                  position: 'absolute',
                  bottom: '-20px',
                  left: '0',
                  fontSize: '9px',
                }}
              >
                {warningText}
              </span>
            )}
          </div>
        ) : (
          `Rp. ${text}`
        )
      },
    },

    {
      title: 'Diskon',
      dataIndex: 'diskon',
      key: 'diskon',
      render: (text: string) => `${text}%`,
    },
    {
      title: 'Jenis Harga',
      dataIndex: 'id_harga',
      key: 'jenis_harga',
      render: (id_harga: string, record: any) => {
        if (isEditing) {
          return (
            <Select
              defaultValue={id_harga}
              style={{ width: 200 }}
              onChange={(value) =>
                handleInputChange(record._id, 'id_harga', value)
              }
            >
              {hargas?.map((product) => (
                <Option key={product._id} value={product._id}>
                  {product.jenis_harga}
                </Option>
              ))}
            </Select>
          )
        } else {
          return dapatkanNamaHarga(id_harga)
        }
      },
    },

    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (text: string) => `Rp. ${text}`,
    },
  ]

  return (
    <div>
      <Button onClick={toggleEditing}>
        {isEditing ? 'Selesai Editing' : 'Edit Table'}{' '}
      </Button>
      <div>
        <span>{`${inv}`}</span>
      </div>
      <Table
        dataSource={getPosDetail}
        columns={columns}
        rowKey={(record) => record._id}
        pagination={false}
        style={{ marginBottom: 20 }}
      />
      {isEditing && (
        <>
          <Button
            onClick={handleSave}
            style={{ marginLeft: '10px' }}
            disabled={anyQtyExceedingStok()}
          >
            Save
          </Button>
        </>
      )}
    </div>
  )
}

export default DetailPosPage
