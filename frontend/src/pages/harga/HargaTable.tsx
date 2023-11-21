import React from 'react'
import { Form, Popconfirm, Select, Table, Typography } from 'antd'
import { Harga } from '../../types/Harga'
import EditableCell from './CellHarga'
import {
  AiOutlineArrowLeft,
  AiOutlineLike,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineUp,
  AiOutlineDown,
} from 'react-icons/ai'

interface HargaTableProps {
  form2hereOneAtPage: any
  asal: Harga[]
  penyuplay: any[]
  isLoading: boolean
  editingKey: string
  isEditing: (record: Harga) => boolean
  save: (kunci: string) => void
  cancel: () => void
  edit: (record: Harga) => void
  handleDelete: (kunci: string) => void
  dapatkanSupById: (onlyOneHere: string) => string
  showIdH: boolean
  showA: boolean
  showTiga: boolean
}

const HargaTable: React.FC<HargaTableProps> = ({
  form2hereOneAtPage,
  asal,
  penyuplay,
  isLoading,
  editingKey,
  isEditing,
  save,
  cancel,
  edit,
  handleDelete,
  dapatkanSupById,
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
            dataIndex: 'id_harga',
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
      title: 'Jenis Harga',
      dataIndex: 'jenis_harga',
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

      render: (_: any, record: Harga) => {
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
      onCell: (record: Harga) => ({
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
        penyuplay,
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
            <p style={{ margin: 0 }}>
              {/* Supplier: {dapatkanSupById(record.id_supplier)} */}
            </p>
            {/* <p style={{ margin: 0 }}>Id Supplier: {record.id_supplier} </p> */}
            {/* <p style={{ margin: 0 }}>Id Usaha: {record.id_usaha} </p>
            <p style={{ margin: 0 }}>Ket: {record.ket}</p> */}
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
export default HargaTable
