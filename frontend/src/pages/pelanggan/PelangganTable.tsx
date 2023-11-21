import React from 'react'
import { Form, Popconfirm, Select, Table, Typography } from 'antd'
import { Pelanggan } from '../../types/Pelanggan'
import EditableCell from './CellPelanggan'
import {
  AiOutlineArrowLeft,
  AiOutlineLike,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineUp,
  AiOutlineDown,
} from 'react-icons/ai'

interface PelangganTableProps {
  form2hereOneAtPage: any
  asal: Pelanggan[]
  price: any[]
  outlet: any[]
  struggle: any[]
  isLoading: boolean
  editingKey: string
  isEditing: (record: Pelanggan) => boolean
  save: (key: string) => void
  cancel: () => void
  edit: (record: Pelanggan) => void
  handleDelete: (key: string) => void
  dapatkanSupById: (onlyOneHere: string) => string
  dapatkanOutById: (siniajak: string) => string
  dapatkanUsaById: (hereOnly: string) => string
  showIdH: boolean
  showA: boolean
}

const PelangganTable: React.FC<PelangganTableProps> = ({
  form2hereOneAtPage,
  asal,
  price,
  outlet,
  struggle,
  isLoading,
  editingKey,
  isEditing,
  save,
  cancel,
  edit,
  handleDelete,
  dapatkanSupById,
  dapatkanOutById,
  dapatkanUsaById,
  showIdH,
  showA,
}) => {
  const filteredData = asal.filter((item) =>
    item.type_kontak.includes('Pelanggan')
  )
  console.log({ filteredData })

  const columns = [
    {
      title: 'No',
      key: 'index',
      align: 'center' as 'center',
      fixed: true,
      width: '5%',
      render: (_: any, __: any, index: number) => index + 1,
    },

    ...(showIdH
      ? [
          {
            title: 'ID',
            dataIndex: 'id_pelanggan',

            fixed: true,
            editable: false,
            align: 'center' as 'center',
            render: (huruf: string) => (
              <div style={{ textAlign: 'center' }}>{huruf}</div>
            ),
          },
        ]
      : []),
    {
      title: 'Nama Kontak',
      dataIndex: 'type_kontak',

      fixed: true,
      align: 'center' as 'center',

      render: (naskah: string) => (
        <div style={{ textAlign: 'center' }}>{naskah}</div>
      ),
      editable: true,
    },
    {
      title: 'Perusahaan',
      dataIndex: 'perusahaan',

      fixed: true,
      align: 'center' as 'center',

      render: (naskah: string) => (
        <div style={{ textAlign: 'center' }}>{naskah}</div>
      ),
      editable: true,
    },
    {
      title: 'Nama',
      dataIndex: 'nama',

      fixed: true,
      align: 'center' as 'center',

      render: (naskah: string) => (
        <div style={{ textAlign: 'center' }}>{naskah}</div>
      ),
      editable: true,
    },
    {
      title: 'tanggal',
      dataIndex: 'tanggal',

      fixed: true,
      align: 'center' as 'center',

      render: (naskah: string) => (
        <div style={{ textAlign: 'center' }}>{naskah}</div>
      ),
      editable: true,
    },

    {
      title: 'Nama Outlet',
      dataIndex: 'id_outlet',
      align: 'center' as 'center',

      fixed: true,
      editable: true,
      render: (text: any, record: Pelanggan) => {
        const editable = isEditing(record)
        return (
          <div style={{ textAlign: 'center' }}>
            {editable ? (
              <Form.Item
                name="id_outlet"
                rules={[
                  {
                    required: true,
                    message: 'Please select a Jenis Outlet!',
                  },
                ]}
              >
                <Select>
                  {outlet.map((bebas) => (
                    <Select.Option key={bebas._id} value={bebas._id}>
                      {bebas.nama_outlet}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            ) : (
              dapatkanOutById(text)
            )}
          </div>
        )
      },
    },

    {
      title: 'Nama Harag',
      dataIndex: 'id_harga',
      align: 'center' as 'center',

      fixed: true,
      editable: true,
      render: (text: any, record: Pelanggan) => {
        const editable = isEditing(record)
        return (
          <div style={{ textAlign: 'center' }}>
            {editable ? (
              <Form.Item
                name="id_harga"
                rules={[
                  {
                    required: true,
                    message: 'Please select a Jenis Harga!',
                  },
                ]}
              >
                <Select>
                  {price.map((bebas) => (
                    <Select.Option key={bebas._id} value={bebas._id}>
                      {bebas.nama_jenis_harga}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            ) : (
              dapatkanSupById(text)
            )}
          </div>
        )
      },
    },

    {
      title: 'Aksi',
      dataIndex: 'operation',
      editable: false,
      fixed: true,
      align: 'center' as 'center',

      render: (_: any, record: Pelanggan) => {
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
      onCell: (record: Pelanggan) => ({
        record,
        inputType:
          col.dataIndex === 'id_outltet'
            ? 'number'
            : col.dataIndex === 'id_harga' ||
              col.dataIndex === 'id_outlet' ||
              col.dataIndex === 'id_usaha'
            ? 'select'
            : 'text',

        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        price,
        outlet,
        struggle,
      }),
    }
  })
  // const filteredColumns = columns.filter(
  //   (col) => col.dataIndex === 'type_kontak'
  // )

  return (
    <Table
      className="table no-vertical-lines"
      components={{
        body: {
          cell: EditableCell,
        },
      }}
      dataSource={asal}
      columns={columns}
      rowClassName="editable-row"
      loading={isLoading}
      rowKey={(record) => record._id}
      expandable={{
        expandedRowRender: (record) => (
          <div>
            <p style={{ margin: 0 }}>: {record.id_outlet} </p>
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
export default PelangganTable
