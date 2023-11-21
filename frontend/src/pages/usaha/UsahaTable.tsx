import React from 'react'
import { Form, Popconfirm, Select, Table, Typography } from 'antd'
import { Usaha } from '../../types/Usaha'
import EditableCell from './CellUSaha'
import {
  AiOutlineArrowLeft,
  AiOutlineLike,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineUp,
  AiOutlineDown,
} from 'react-icons/ai'

interface UsahaTableProps {
  form2hereOneAtPage: any
  asal: Usaha[]

  isLoading: boolean
  editingKey: string
  isEditing: (record: Usaha) => boolean
  save: (kunci: string) => void
  cancel: () => void
  edit: (record: Usaha) => void
  handleDelete: (kunci: string) => void

  showIdH: boolean
  showA: boolean
}

const UsahaTable: React.FC<UsahaTableProps> = ({
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
            dataIndex: 'id_usaha',
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
      title: 'Jenis Usaha',
      dataIndex: 'nama_usaha',
      fixed: true,
      align: 'center' as 'center',
      render: (naskah: string) => (
        <div style={{ textAlign: 'center' }}>{naskah}</div>
      ),
      editable: true,
    },
    {
      title: 'alamat',
      dataIndex: 'alamat',
      fixed: true,
      align: 'center' as 'center',
      render: (naskah: string) => (
        <div style={{ textAlign: 'center' }}>{naskah}</div>
      ),
      editable: true,
    },
    {
      title: 'kontak',
      dataIndex: 'kontak',
      fixed: true,
      align: 'center' as 'center',
      render: (naskah: string) => (
        <div style={{ textAlign: 'center' }}>{naskah}</div>
      ),
      editable: true,
    },

    // ...(showA
    //   ? [
    //       {
    //         title: 'Nama Outlet',
    //         dataIndex: 'id_outlet',
    //         align: 'center' as 'center',
    //         fixed: true,

    //         render: (abjad: string) => (
    //           <div style={{ textAlign: 'center' }}>{abjad}</div>
    //         ),
    //         editable: true,
    //       },
    //     ]
    //   : []),

    {
      title: 'Aksi',
      dataIndex: 'operation',
      editable: false,
      fixed: true,
      align: 'center' as 'center',

      render: (_: any, record: Usaha) => {
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
      onCell: (record: Usaha) => ({
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
            <p style={{ margin: 0 }}>Kontak: {record.kontak} </p>
            <p style={{ margin: 0 }}>Alamat: {record.alamat}</p>
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
export default UsahaTable
