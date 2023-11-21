import React, { useState } from 'react'
import { useGetMultisQuery } from '../hooks/multiHooks'
import {
  useAddProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
} from '../hooks/productHooks'
import { Table, Button, Input, Select } from 'antd'
import { useGetStoksQuery } from '../hooks/stokHooks'
import { Option } from 'antd/es/mentions'
import { useGetCicilansQuery } from '../hooks/cicilanHooks'
import { useGetPossQuery } from '../hooks/posHooks'
import { Product } from '../types/Product'

const SatuanPage = () => {
  const { data: products } = useGetProductsQuery()
  const { data: multis } = useGetMultisQuery()
  const { data: stoks } = useGetStoksQuery()
  const addProductMutation = useAddProductMutation()
  const deleteProductMutation = useDeleteProductMutation()
  const { data: cicilans } = useGetCicilansQuery()
  const { data: poss } = useGetPossQuery()

  const [newProduct, setNewProduct] = useState({
    _id: '',
    nama_barang: '',
    jumlah_stok: 0,
    id_data_barang: '',
    harga_jual: 0,
  })

  const handleAddProduct = () => {
    addProductMutation.mutate(newProduct)
    setNewProduct({
      _id: '',
      nama_barang: '',
      jumlah_stok: 0,
      id_data_barang: '',
      harga_jual: 0,
    })
  }
  const [showForm, setShowForm] = useState(false)
  const [showCiciclan, setShowCicilan] = useState(true)
  const [selectedProducts, setSelectedProducts] = useState<{
    [key: string]: Product
  }>({})

  const handleDinamisTable = (productId: string, record: any) => {
    const product = products!.find((p) => p.id_data_barang === productId)
    if (product) {
      setSelectedProducts((prev) => ({
        ...prev,
        [record.id_data_barang]: product,
      }))
    }
  }

  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  )
  const [hargaJual, setHargaJual] = useState<number | null>(null)
  const [jumlahStok, setJumlahStok] = useState<number | null>(null)

  const handleDinamisOutTable = (productId: string) => {
    const product = products!.find((p) => p.id_data_barang === productId)
    if (product) {
      setSelectedProductId(productId)
      setHargaJual(product.harga_jual)
      setJumlahStok(product.jumlah_stok)
    }
  }

  const handleFocus = (type: 'hargaJual' | 'jumlahStok') => {
    if (type === 'hargaJual') {
      setHargaJual(null)
    } else if (type === 'jumlahStok') {
      setJumlahStok(null)
    }
  }

  const columns = [
    {
      title: 'Harga sumber lain',
      dataIndex: 'harga_jual',
      key: 'ztjztdejtdejtjtjztfddvsedvbhsfhbsfhbsrfrhbr',
      render: (text: any, record: any) => {
        const product = selectedProducts[record.id_data_barang]
        if (product) {
          const justHere = multis?.find(
            (stok) => stok.id_data_barang === product.id_data_barang
          )
          return justHere ? justHere.harga_terendah : 'Tidak diketahui'
        }
        return 'Pilih produk'
      },
    },

    {
      title: 'Dinamis barang',
      dataIndex: 'nama_barang',
      key: 'dhtjtjatjt',
      render: (text: any, record: any) => (
        <Select
          defaultValue={text}
          onChange={(value) => handleDinamisTable(value, record)}
        >
          {products!.map((product) => (
            <Option key={product.id_data_barang} value={product.id_data_barang}>
              {product.nama_barang}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Jumlah Stok dinamis goods native',
      dataIndex: 'jumlah_stok',
      key: 'dfnzgjzhEJheTJhtrjtzrjztrjztrrtjt',
      render: (text: any, record: any) => {
        const product = selectedProducts[record.id_data_barang]
        return product ? product.jumlah_stok : 'Pilih produk'
      },
    },
    {
      title: 'Harga native dinamis good',
      dataIndex: 'harga_jual',
      key: 'dshtjtzjztedjztedjtedzjztdejtygdshzejthseghrthsH',
      render: (text: any, record: any) => {
        const product = selectedProducts[record.id_data_barang]
        return product ? product.harga_jual : 'Pilih produk'
      },
    },
    {
      title: 'Harga guest',
      dataIndex: 'harga_jual',
      key: 'ztjztdejtdejtjtjztfddvsedvbhsfhbsfhbsrfrhbr',
      render: (text: any, record: any) => {
        const angenm = selectedProducts[record.id_data_barang]
        if (angenm) {
          const justHere = multis?.find(
            (itam) => itam.id_data_barang === angenm.id_data_barang
          )
          return justHere ? justHere.harga_terendah : 'Tidak diketahui'
        }
        return 'Pilih produk'
      },
    },
    {
      title: 'Jumlah Stok sumber lain',
      dataIndex: 'jumlah_stok',
      key: 'ztjztdejtdejtjtjztfddvsedvbhsfhbsfhbsrfrhbr_otherSource',

      render: (text: any, record: any) => {
        const product = selectedProducts[record.id_data_barang]
        if (product) {
          const matchedStok = stoks?.find(
            (stok) => stok.id_data_barang === product.id_data_barang
          )
          return matchedStok ? matchedStok.jumlah_stok : 'Tidak diketahui'
        }
        return 'Pilih produk'
      },
    },

    {
      title: 'barang bukan drop down native',
      dataIndex: 'nama_barang',
      key: 'dfnzgjzhEJheTJhtrjtdsegewgwrgrwgzrjztrjztrrtjt',
    },
    {
      title: 'Harga native',
      dataIndex: 'harga_jual',
      key: 'dshtjtzjztedjztedjtedzjztdejtygdshzejthseghrthsH',
    },

    {
      title: 'Aksi',
      key: 'aksi',
      render: (record: any) => (
        <Button
          onClick={() => deleteProductMutation.mutate(record.id_data_barang)}
        >
          Hapus
        </Button>
      ),
    },
  ]

  return (
    <div>
      <Button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Hide Form' : 'Show + Barang'}
      </Button>
      <Button onClick={() => setShowCicilan(!showCiciclan)}>
        {showCiciclan ? 'Hide Cicilan' : 'Show Cicilan'}
      </Button>
      {showForm && (
        <div>
          <Select
            defaultValue="Pilih Baarang native dinamis source"
            onChange={handleDinamisOutTable}
          >
            {products!.map((product) => (
              <Option
                key={product.id_data_barang}
                value={product.id_data_barang}
              >
                {product.nama_barang}
              </Option>
            ))}
          </Select>

          <Input
            placeholder="harga jual"
            value={hargaJual?.toString() || ''}
            onChange={(e) => setHargaJual(parseFloat(e.target.value))}
            onFocus={() => handleFocus('hargaJual')}
          />

          <Input
            placeholder="Jumlah Stok"
            value={jumlahStok?.toString() || ''}
            onChange={(e) => setJumlahStok(parseFloat(e.target.value))}
            onFocus={() => handleFocus('jumlahStok')}
          />

          <Button onClick={handleAddProduct}>Tambah Produk</Button>
        </div>
      )}
      {showCiciclan && (
        <>
          {cicilans?.map((cicilan) => (
            <div
              key={cicilan._id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px',
                fontSize: '12px',
              }}
            >
              <div style={{ flex: 1, marginRight: '10px' }}>
                <span>{cicilan.id_bank}</span>
              </div>
              <div style={{ flex: 1 }}>
                <p>{cicilan.tanggal}</p>
              </div>
              <div style={{ flex: 1 }}></div>
            </div>
          ))}
        </>
      )}
      <Table dataSource={products} columns={columns} rowKey="dsbgfshfh" />
    </div>
  )
}

export default SatuanPage
