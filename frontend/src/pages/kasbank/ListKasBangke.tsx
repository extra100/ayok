import React, { useState } from 'react'
import { Table, Button, Modal } from 'antd'
import { useDeleteCoaMutation, useGetCoasQuery } from '../../hooks/coaHooks'
import { Coa } from '../../types/coa'
import KasBanke from './KasBanke'

const ListKasBangke: React.FC = () => {
  const { data: coasData } = useGetCoasQuery()
  const hapusCoa = useDeleteCoaMutation()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const aneh =
    coasData?.filter(
      (e) => e.kategori === 'Kas & Bank' || e.kategori === 'Cek & BG'
    ) || []

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record: Coa) => ({}),
  }

  const hasSelected = selectedRowKeys.length > 0

  const start = async () => {
    const deleteCoa = selectedRowKeys.map((e) => hapusCoa.mutate(e as any))

    await Promise.all(deleteCoa)

    setSelectedRowKeys([])
    setLoading(false)
  }

  const showModal = () => {
    setModalVisible(true)
  }

  const handleCancel = () => {
    setModalVisible(false)
  }
  const handleAddCoaModalClose = () => {
    setModalVisible(false)
  }
  const columns = [
    {
      title: 'Nama Akun',
      dataIndex: 'nama_akun',
      key: 'nama_akun',
    },
    {
      title: 'Kode',
      dataIndex: 'kode_akun',
      key: 'kode_akun',
    },

    {
      title: 'Kategori',
      dataIndex: 'kategori',
      key: 'kategori',
    },
    {
      title: 'Saldo',
      dataIndex: 'saldo',
      key: 'saldo',
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
        dataSource={aneh}
        rowKey={(record) => record._id.toString()}
      />

      <Modal
        visible={modalVisible}
        onCancel={handleCancel}
        footer={null}
        style={{ borderRadius: 0 }}
      >
        <KasBanke onCloseModal={handleAddCoaModalClose} />
      </Modal>
    </div>
  )
}

export default ListKasBangke
