import React, { useContext } from 'react'
import { Form, Popconfirm, Select, Table, Typography } from 'antd'
import { Supplier } from '../../types/Supplier'
import EditableCell from './CellSupplier'
import {
  AiOutlineArrowLeft,
  AiOutlineLike,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineUp,
  AiOutlineDown,
} from 'react-icons/ai'
import UserContext from '../../contexts/UserContext'

interface SupplierTableProps {
  form: any
  data: Supplier[]
  suppliers: any[]
  isLoading: boolean
  editingKey: string
  isEditing: (record: Supplier) => boolean
  save: (key: string) => void
  cancel: () => void
  edit: (record: Supplier) => void
  handleDelete: (key: string) => void
  getSupplierNameById: (supplierId: string) => string
  showIdSupplier: boolean
  showA: boolean
}

const SupplierTable: React.FC<SupplierTableProps> = ({
  form,
  data,
  suppliers,
  isLoading,
  editingKey,
  isEditing,
  save,
  cancel,
  edit,
  handleDelete,
  getSupplierNameById,
  showIdSupplier,
  showA,
}) => {
  const userContext = useContext(UserContext)
  const { user } = userContext || {}

  const columns = [
    {
      title: 'No',
      key: 'index',
      align: 'center' as 'center',
      fixed: true,
      width: '5%',
      render: (_: any, __: any, index: number) => index + 1,
    },

    ...(showIdSupplier
      ? [
          {
            title: 'ID',
            dataIndex: 'id_supplier',

            fixed: true,
            editable: false,
            align: 'center' as 'center',
            render: (text: string) => (
              <div style={{ textAlign: 'center' }}>{text}</div>
            ),
            onCell: (record: Supplier) => ({
              record,
              inputType: 'text',
              dataIndex: 'id_supplier',
              title: 'ID',
              editing: isEditing(record),
              suppliers,
            }),
          },
        ]
      : []),
    {
      title: 'Nama Supplier',
      dataIndex: 'nama_supplier',

      fixed: true,
      align: 'center' as 'center',

      render: (text: string) => (
        <div style={{ textAlign: 'center' }}>{text}</div>
      ),
      editable: true,
    },
    {
      title: 'Kontak',
      dataIndex: 'kontak_supplier',

      fixed: true,
      align: 'center' as 'center',

      render: (text: string) => (
        <div style={{ textAlign: 'center' }}>{text}</div>
      ),
      editable: true,
    },
    ...(showA
      ? [
          {
            title: 'Alamat',
            dataIndex: 'alamat_supplier',
            align: 'center' as 'center',
            fixed: true,

            render: (text: string) => (
              <div style={{ textAlign: 'center' }}>{text}</div>
            ),
            editable: true,
          },
        ]
      : []),

    {
      title: 'Aksi',
      dataIndex: 'operation',
      editable: false,
      fixed: true,
      align: 'center' as 'center',

      render: (_: any, record: Supplier) => {
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
            {user && user.id_outlet === '64fe44c6925b526c7e431f18' ? (
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
            ) : null}
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
      onCell: (record: Supplier) => ({
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
        suppliers,
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
              Supplier: {getSupplierNameById(record.id_supplier)}
            </p>
            <p style={{ margin: 0 }}>Alamat: {record.alamat_supplier} </p>
            <p style={{ margin: 0 }}>kontak: {record.kontak_supplier}</p>
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
export default SupplierTable
