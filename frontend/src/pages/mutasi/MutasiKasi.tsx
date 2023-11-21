import React, { useContext, useState } from 'react'
import { Form, Select, Table } from 'antd'
import { useGetMutasisQuery } from '../../hooks/mutasiHooks'
import { Mutasi } from '../../types/Mutasi'
import { useGetoutletsQuery } from '../../hooks/outletHooks'
import { Outlet } from '../../types/Outlet'
import UserContext from '../../contexts/UserContext'

const MutasiKasi = () => {
  const userContext = useContext(UserContext)
  const { user } = userContext || {}

  let idOutletLoggedIn = ''

  if (user) {
    idOutletLoggedIn = user.id_outlet
  }
  const { data: ambilDataMutasi } = useGetMutasisQuery()
  const { data: outletsData } = useGetoutletsQuery()

  const [selectedMutasiId, setSelectedMutasiId] = useState<string | null>(null)

  const renderDetailMutasi = () => {
    if (!selectedMutasiId) return null

    const selectedMutasi = ambilDataMutasi?.find(
      (mutasi: Mutasi) => mutasi.id_mutasi === selectedMutasiId
    )

    if (!selectedMutasi) return null
  }

  const columns = [
    {
      title: 'ID Data Barang',
      dataIndex: 'id_data_barang',
      key: 'id_data_barang',
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
    },
    {
      title: 'Keterangan',
      dataIndex: 'ket',
      key: 'ket',
    },
  ]

  return (
    <div>
      <div>
        <Form>
          <Form.Item
            name="id_outlet"
            label="Dari Outlet"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 16 }}
            rules={[
              {
                required: true,
                message: 'Please select the Nama Outlet!',
              },
            ]}
          >
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children
                  ? option.children
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  : false
              }
              style={{ marginRight: '10px', width: '320px' }}
              defaultValue={user?.id_outlet}
            >
              {outletsData?.map((Itsonyou: Outlet) => (
                <Select.Option key={Itsonyou._id} value={Itsonyou._id}>
                  {Itsonyou.nama_outlet}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </div>
      <Table
        dataSource={ambilDataMutasi || []}
        columns={columns}
        onRow={(record: Mutasi) => ({
          onClick: () => setSelectedMutasiId(record.id_mutasi),
        })}
      />
      {renderDetailMutasi()}
    </div>
  )
}

export default MutasiKasi
