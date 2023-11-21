import React from 'react'
import { Form, Popconfirm, Select, Table, Typography } from 'antd'
import { Mutasi } from '../../types/Mutasi'
// import EditableCell from './CellMutasi'
import {
  AiOutlineArrowLeft,
  AiOutlineLike,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineUp,
  AiOutlineDown,
} from 'react-icons/ai'

interface MutasiTableProps {
  form2hereOneAtPage: any
  asal: Mutasi[]

  outlet: any[]

  isLoading: boolean
  editingKey: string
  isEditing: (record: Mutasi) => boolean
  save: (key: string) => void
  cancel: () => void
  edit: (record: Mutasi) => void
  handleDelete: (key: string) => void

  dapatkanOutById: (siniajak: string) => string

  showIdH: boolean
  showA: boolean
}

const MutasiTable: React.FC<MutasiTableProps> = ({
  form2hereOneAtPage,
  asal,
  outlet,
  isLoading,
  editingKey,
  isEditing,
  save,
  cancel,
  edit,
  handleDelete,
  dapatkanOutById,

  showIdH,
  showA,
}) => {
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
            dataIndex: 'id_mutasi',

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
      title: 'Nama Mutasi',
      dataIndex: 'id_mutasi',

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
      render: (text: any, record: Mutasi) => {
        const editable = isEditing(record)
        return (
          <div style={{ textAlign: 'center' }}>
            {editable ? (
              <Form.Item
                name="id_outlet"
                rules={[
                  {
                    required: true,
                    message: 'Please select a Nama Barang!',
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
      title: 'Aksi',
      dataIndex: 'operation',
      editable: false,
      fixed: true,
      align: 'center' as 'center',

      render: (_: any, record: Mutasi) => {
        const editable = isEditing(record)
        return editable ? (
          <span>
            <Popconfirm
              title="Apakah Anda yakin ingin menyimpan perubahan ini?"
              onConfirm={() => save(record.id_mutasi)}
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
              onConfirm={() => handleDelete(record.id_mutasi)}
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
      onCell: (record: Mutasi) => ({
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

        outlet,
      }),
    }
  })

  return (
    <Table
      className="table no-vertical-lines"
      components={{
        body: {
          // cell: EditableCell,
        },
      }}
      dataSource={asal}
      columns={columns}
      rowClassName="editable-row"
      loading={isLoading}
      rowKey={(record) => record.id_mutasi}
      expandable={{
        expandedRowRender: (record) => (
          <div>
            <p style={{ margin: 0 }}>: {record.dari} </p>
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
export default MutasiTable
