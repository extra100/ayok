import React from 'react'
import { Form, Popconfirm, Select, Table, Typography } from 'antd'
import { Bank } from '../../types/Bank'
import EditableCell from './CellBank'
import {
  AiOutlineArrowLeft,
  AiOutlineLike,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineUp,
  AiOutlineDown,
  AiOutlinePlusSquare,
  AiOutlinePlus,
} from 'react-icons/ai'

interface BankTableProps {
  form2hereOneAtPage: any
  asal: Bank[]

  isLoading: boolean
  editingKey: string
  isEditing: (record: Bank) => boolean
  save: (kunci: string) => void
  cancel: () => void
  edit: (record: Bank) => void
  handleDelete: (kunci: string) => void

  showIdH: boolean
  showA: boolean
  showTiga: boolean
}

const BankTable: React.FC<BankTableProps> = ({
  form2hereOneAtPage,
  asal,

  isLoading,
  editingKey,
  isEditing,
  save,
  cancel,
  edit,
  handleDelete,

  showIdH,
  showA,
  showTiga,
}) => {
  const columns = [
    {
      title: 'No',
      kunci: 'index',
      align: 'center' as 'center',
      fixed: true,
      width: '5%',
      render: (_: any, __: any, index: number) => index + 1,
    },

    ...(showIdH
      ? [
          {
            title: 'ID',
            dataIndex: 'id_bank',
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
      title: 'Nama Bank',
      dataIndex: 'nama_bank',
      fixed: true,
      align: 'center' as 'center',
      render: (naskah: string) => (
        <div style={{ textAlign: 'center' }}>{naskah}</div>
      ),
      editable: true,
    },
    {
      title: 'No Rekenening',
      dataIndex: 'no_rekening',
      fixed: true,
      align: 'center' as 'center',
      render: (naskah: string) => (
        <div style={{ textAlign: 'center' }}>{naskah}</div>
      ),
      editable: true,
    },
    {
      title: 'Ket',
      dataIndex: 'ket',
      fixed: true,
      align: 'center' as 'center',
      render: (naskah: string) => (
        <div style={{ textAlign: 'center' }}>{naskah}</div>
      ),
      editable: true,
    },

    {
      title: 'Aksi',
      dataIndex: 'operation',
      editable: false,
      fixed: true,
      align: 'center' as 'center',

      render: (_: any, record: Bank) => {
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
      onCell: (record: Bank) => ({
        record,
        inputType:
          col.dataIndex === 'id_bank'
            ? 'number'
            : col.dataIndex === 'id_bank'
            ? 'select'
            : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
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
      dataSource={asal}
      columns={columns}
      rowClassName="editable-row"
      loading={isLoading}
      rowKey={(record) => record._id}
      expandable={{
        expandedRowRender: (record) => (
          <div>
            <p style={{ margin: 0 }}></p>
            {/* <p style={{ margin: 0 }}>Id Supplier: {record.id_supplier} </p> */}
            <p style={{ margin: 0 }}>Id Bank: {record.id_bank} </p>
            <p style={{ margin: 0 }}>Ket: {record.ket}</p>
          </div>
        ),
        expandIcon: ({ expanded, onExpand, record }) =>
          expanded ? (
            <AiOutlinePlus onClick={(e) => onExpand(record, e as any)} />
          ) : (
            <AiOutlinePlus onClick={(e) => onExpand(record, e as any)} />
          ),
      }}
    />
  )
}
export default BankTable
