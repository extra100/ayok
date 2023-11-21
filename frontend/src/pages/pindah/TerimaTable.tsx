import React, { useContext, useMemo } from 'react'
import { Form, Popconfirm, Select, Table, Typography } from 'antd'
import { Pindah } from '../../types/Pindah'
import EditableCell from './CellPindah'
import {
  AiOutlineArrowLeft,
  AiOutlineLike,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineUp,
  AiOutlineDown,
} from 'react-icons/ai'
import { Outlet } from '../../types/Outlet'
import { Link } from 'react-router-dom'
import UserContext from '../../contexts/UserContext'

interface TerimaTableProps {
  outlets: Outlet[]
  form2hereOneAtPage: any
  asal: Pindah[]
  stockist: any[]
  outletist: any[]
  isLoading: boolean
  editingKey: string
  isEditing: (record: Pindah) => boolean
  save: (key: string) => void
  cancel: () => void
  edit: (record: Pindah) => void
  handleDelete: (key: string) => void
  dapatkanBAarById: (onlyOneHere: string) => string
  dapatkanOutlet: (onlyOneHere: string) => string
  showIdH: boolean
  showA: boolean
}

const TerimaTable: React.FC<TerimaTableProps> = ({
  form2hereOneAtPage,
  asal,
  outlets,
  stockist,
  outletist,
  isLoading,
  editingKey,
  isEditing,
  save,
  cancel,
  edit,
  handleDelete,
  dapatkanBAarById,
  // dapatkanOutlet,
  showIdH,
  showA,
}) => {
  const userContext = useContext(UserContext)
  const { user } = userContext || {}

  let idOutletLoggedIn = ''

  if (user) {
    idOutletLoggedIn = user.id_outlet
  }
  const dapatkanOutlet = (freeHere: string) => {
    const toki = outletist?.find((toki) => toki._id === freeHere)
    return toki ? toki.nama_outlet : 'Tidak Ditemukan'
  }

  const uniqueAsal = useMemo(() => {
    const uniqueIds = new Set<string>()
    return asal
      .filter((row) => {
        if (!uniqueIds.has(row.id_pindah)) {
          uniqueIds.add(row.id_pindah)
          return true
        }
        return false
      })
      .filter((row) => row.id_outlet_dari === idOutletLoggedIn)
  }, [asal, idOutletLoggedIn])
  // const hasPartial = uniqueAsal.some((record) => {
  //   const sisaMinta = parseFloat(record.sisa_minta)
  //   return !isNaN(sisaMinta) && sisaMinta > 0
  // })

  // const isAllZero = uniqueAsal.every((record) => {
  //   const sisaMinta = parseFloat(record.sisa_minta)
  //   return !isNaN(sisaMinta) && sisaMinta === 0
  // })
  // const isAllCompleted = uniqueAsal.every((record) => {
  //   const qtyBeri = parseFloat(record.qty_beri)
  //   const sisaMinta = parseFloat(record.sisa_minta)
  //   console.log('qtyBeri:', qtyBeri)
  //   console.log('sisaMinta:', sisaMinta)

  //   return (
  //     !isNaN(qtyBeri) && !isNaN(sisaMinta) && sisaMinta === 0 && qtyBeri > 0
  //   )
  // })

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
            title: 'IDealis',
            dataIndex: 'id_pindah',
            fixed: true,
            editable: false,
            align: 'center' as 'center',
            render: (huruf: string, record: any) => (
              <div style={{ textAlign: 'center' }}>
                <Link to={`/kasiTerima/${record.id_pindah}`}>{huruf}</Link>
              </div>
            ),
          },
        ]
      : []),

    ...(showIdH
      ? [
          {
            title: 'tanggal',
            dataIndex: 'tanggal',
            align: 'center' as 'center',
            fixed: true,
            render: (abjad: string) => (
              <div style={{ textAlign: 'center' }}>{abjad}</div>
            ),
            editable: true,
          },
        ]
      : []),

    {
      title: 'Nama Outlet Dari',
      dataIndex: 'id_outlet_dari',
      align: 'center' as 'center',

      fixed: true,
      editable: true,
      render: (text: any, record: Pindah) => {
        const editable = isEditing(record)
        return (
          <div style={{ textAlign: 'center' }}>
            {editable ? (
              <Form.Item
                name="id_outlet_dari"
                rules={[
                  {
                    required: true,
                    message: 'Please select a supplier!',
                  },
                ]}
              >
                <Select>
                  {outlets.map((toko) => (
                    <Select.Option key={toko._id} value={toko._id}>
                      {toko.nama_outlet}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            ) : (
              dapatkanOutlet(text)
            )}
          </div>
        )
      },
    },
    {
      title: 'Nama Outlet Tujuan',
      dataIndex: 'id_outlet_tujuan',
      align: 'center' as 'center',

      fixed: true,
      editable: true,
      render: (text: any, record: Pindah) => {
        const editable = isEditing(record)
        return (
          <div style={{ textAlign: 'center' }}>
            {editable ? (
              <Form.Item
                name="id_outlet_tujuan"
                rules={[
                  {
                    required: true,
                    message: 'Please select a supplier!',
                  },
                ]}
              >
                <Select>
                  {outlets.map((toko) => (
                    <Select.Option key={toko._id} value={toko._id}>
                      {toko.nama_outlet}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            ) : (
              dapatkanOutlet(text)
            )}
          </div>
        )
      },
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'sisa_minta',
    //   align: 'center' as 'center',
    //   render: () => {
    //     let statusText = ''
    //     let statusColor = ''

    //     if (isAllCompleted) {
    //       statusText = 'Completed'
    //       statusColor = 'green' // Set the color to green for "Completed"
    //     } else if (hasPartial) {
    //       statusText = 'Partial'
    //       statusColor = 'blue' // Set the color to blue for "Partial"
    //     } else if (isAllZero) {
    //       statusText = 'Processing'
    //       statusColor = 'green' // Set the color to green for "Processing"
    //     } else {
    //       statusText = 'Checking...'
    //       statusColor = 'red' // Set the color to red for other cases
    //     }

    //     return <span style={{ color: statusColor }}>{statusText}</span>
    //   },
    // },
  ].map((col) => {
    if (!col.editable) {
      return col
    }

    return {
      ...col,
      onCell: (record: Pindah) => ({
        record,
        inputType:
          col.dataIndex === 'id_usaha'
            ? 'number'
            : col.dataIndex === 'id_data_barang'
            ? 'select'
            : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        stockist,
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
      dataSource={uniqueAsal}
      // dataSource={asal}
      columns={columns}
      rowClassName="editable-row"
      loading={isLoading}
      rowKey={(record) => record._id}
      expandable={{
        expandedRowRender: (record) => (
          <div>
            <p style={{ margin: 0 }}>
              Supplier: {dapatkanBAarById(record._id)}
            </p>
            {/* <p style={{ margin: 0 }}>Id Supplier: {record.id_supplier} </p> */}
            <p style={{ margin: 0 }}>Id Usaha: {record.tanggal} </p>
            <p style={{ margin: 0 }}>Id Usaha: {record.ket} </p>
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
export default TerimaTable
