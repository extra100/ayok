import React, { useState } from 'react'
import { Table, Button, Modal } from 'antd'

import {
  useDeleteKategoriAkunMutation,
  useGetKategoriAkunsQuery,
} from '../../hooks/kategoriAkunHooks'
import { KategoriAkun } from '../../types/KategoriAkun'
import AddKategoriAkun from './KategoriAkun'

const KategoriAkunList: React.FC = () => {
  const { data: coasData } = useGetKategoriAkunsQuery()
  const hapusKategoriAkun = useDeleteKategoriAkunMutation()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record: KategoriAkun) => ({}),
  }

  const hasSelected = selectedRowKeys.length > 0

  const start = async () => {
    const deleteKategoriAkun = selectedRowKeys.map((e) =>
      hapusKategoriAkun.mutate(e as any)
    )

    await Promise.all(deleteKategoriAkun)

    setSelectedRowKeys([])
    setLoading(false)
  }

  const showModal = () => {
    setModalVisible(true)
  }

  const handleCancel = () => {
    setModalVisible(false)
  }
  const handleAddKategoriAkunModalClose = () => {
    setModalVisible(false)
  }
  const columns = [
    {
      title: 'Kode',
      dataIndex: 'kode_kategori_akun',
      key: 'kode_kategori_akun',
    },

    {
      title: 'Kategori',
      dataIndex: 'kategori',
      key: 'kategori',
    },
  ]

  return (
    <div>
      <Button
        type="primary"
        onClick={start}
        disabled={!hasSelected}
        loading={loading}
      >
        Hapus
      </Button>
      <span style={{ marginLeft: 8 }}>
        {hasSelected ? `Terpilih ${selectedRowKeys.length} items` : ''}
      </span>
      <Button type="primary" style={{ marginLeft: 8 }} onClick={showModal}>
        Tambah
      </Button>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={coasData}
        rowKey={(record) => record._id.toString()}
      />

      <Modal visible={modalVisible} onCancel={handleCancel} footer={null}>
        <AddKategoriAkun onCloseModal={handleAddKategoriAkunModalClose} />
      </Modal>
    </div>
  )
}

export default KategoriAkunList
