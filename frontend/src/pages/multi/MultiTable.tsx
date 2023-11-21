import React, { useContext } from 'react'
import { Form, Popconfirm, Select, Table, Typography } from 'antd'
import { Multi } from '../../types/Multi'
import EditableCell from './CellMulti'
import {
  AiOutlineArrowLeft,
  AiOutlineLike,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineUp,
  AiOutlineDown,
} from 'react-icons/ai'
import UserContext from '../../contexts/UserContext'

interface MultiTableProps {
  form: any
  data: Multi[]
  promul: any[]
  harMul: any[]
  isLoading: boolean
  editingKey: string
  isEditing: (record: Multi) => boolean
  save: (key: string) => void
  cancel: () => void
  edit: (record: Multi) => void
  handleDelete: (key: string) => void
  getMultiNameById: (supplierId: string) => string
  getHarMultiNameById: (supplierId: string) => string
  showIdMulti: boolean
  showA: boolean
}

const MultiTable: React.FC<MultiTableProps> = ({
  form,
  data,
  promul,
  harMul,
  isLoading,
  editingKey,
  isEditing,
  save,
  cancel,
  edit,
  handleDelete,
  getMultiNameById,
  getHarMultiNameById,
  showIdMulti,
  showA,
}) => {
  const userContext = useContext(UserContext)

  const { user } = userContext || {}

  let idOutletLoggedIn = ''

  if (user) {
    idOutletLoggedIn = user.id_outlet
  }
  // Filter baris-baris berdasarkan id_outlet yang sedang login
  // const filteredData = data.filter(
  //   (record) => record.id_outlet === idOutletLoggedIn
  // )

  const columns = [
    {
      title: 'No',
      key: 'index',
      align: 'center' as 'center',
      fixed: true,
      width: '5%',
      render: (_: any, __: any, index: number) => index + 1,
    },

    ...(showA
      ? [
          {
            title: 'Jenis Harga',
            dataIndex: 'id_harga',
            align: 'center' as 'center',

            fixed: true,
            editable: true,
            render: (text: any, record: Multi) => {
              const editable = isEditing(record)
              return (
                <div style={{ textAlign: 'center' }}>
                  {editable ? (
                    <Form.Item
                      name="id_harga"
                      rules={[
                        {
                          required: true,
                          message: 'Please select a nama Harga!',
                        },
                      ]}
                    >
                      <Select>
                        {promul.map((supplier) => (
                          <Select.Option
                            key={supplier._id}
                            value={supplier._id}
                          >
                            {supplier.jenis_harga}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  ) : (
                    getHarMultiNameById(text)
                  )}
                </div>
              )
            },
          },
        ]
      : []),

    {
      title: 'Nama Barang',
      dataIndex: 'id_data_barang',
      align: 'center' as 'center',

      fixed: true,
      editable: true,
      render: (text: any, record: Multi) => {
        const editable = isEditing(record)
        return (
          <div style={{ textAlign: 'center' }}>
            {editable ? (
              <Form.Item
                name="id_data_barang"
                rules={[
                  {
                    required: true,
                    message: 'Please select a nama Barang!',
                  },
                ]}
              >
                <Select>
                  {promul.map((supplier) => (
                    <Select.Option key={supplier._id} value={supplier._id}>
                      {supplier.nama_barang}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            ) : (
              getMultiNameById(text)
            )}
          </div>
        )
      },
    },
    {
      title: 'Terendah',
      dataIndex: 'harga_terendah',

      fixed: true,
      align: 'center' as 'center',

      render: (fearly: string) => (
        <div style={{ textAlign: 'center' }}>{fearly}</div>
      ),
      editable: true,
    },
    {
      title: 'Tertinggi',
      dataIndex: 'harga_tertinggi',

      fixed: true,
      align: 'center' as 'center',

      render: (angene: string) => (
        <div style={{ textAlign: 'center' }}>{angene}</div>
      ),
      editable: true,
    },

    {
      title: 'Aksi',
      dataIndex: 'operation',
      editable: false,
      fixed: true,
      align: 'center' as 'center',

      render: (_: any, record: Multi) => {
        const editable = isEditing(record)
        return editable ? (
          <span>
            <Popconfirm
              title="Apakah Anda yakin ingin menyimpan perubahan ini?"
              onConfirm={() => save(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Typography.Link style={{ marginRight: 10 }}>
                <AiOutlineLike />
              </Typography.Link>
            </Popconfirm>

            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>
                <AiOutlineArrowLeft /> Batal
              </a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Typography.Link
              onClick={() => edit(record)}
              style={{
                background: 'none',
                color: 'black',
                border: 'none',
                paddingInline: 'none',
                margin: '15px',
              }}
            >
              <AiOutlineEdit />
            </Typography.Link>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <a style={{ marginLeft: 8 }}>
                <AiOutlineDelete />
              </a>
            </Popconfirm>
          </span>
        )
      },
    },
  ].map((col) => {
    if (!col.editable) {
      return col
    }

    return {
      ...col,
      onCell: (record: Multi) => ({
        record,
        inputType:
          col.dataIndex === 'id_usaha'
            ? 'number'
            : col.dataIndex === 'id_supplier'
            ? 'select'
            : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        promul,
      }),
    }
  })

  return (
    <Table
      className="table no-vertical-lines"
      components={{
        body: {
          cell: EditableCell,
        },
      }}
      dataSource={data}
      columns={columns}
      rowClassName="editable-row"
      loading={isLoading}
      rowKey={(record) => record._id}
      expandable={{
        expandedRowRender: (record) => (
          <div>
            <p style={{ margin: 0 }}>
              Multi: {getMultiNameById(record.id_data_barang)}
            </p>
            <p style={{ margin: 0 }}>Alamat: {record.id_data_barang} </p>
            <p style={{ margin: 0 }}>kontak: {record.id_data_barang}</p>
          </div>
        ),
        expandIcon: ({ expanded, onExpand, record }) =>
          expanded ? (
            <AiOutlineUp onClick={(e) => onExpand(record, e as any)} />
          ) : (
            <AiOutlineDown onClick={(e) => onExpand(record, e as any)} />
          ),
      }}
    />
  )
}
export default MultiTable
