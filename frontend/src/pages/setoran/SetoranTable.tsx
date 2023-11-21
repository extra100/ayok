import React from 'react'
import { Form, Popconfirm, Select, Table, Typography } from 'antd'
import { Setoran } from '../../types/Setoran'
import EditableCell from './CellSetoran'
import {
  AiOutlineArrowLeft,
  AiOutlineLike,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineUp,
  AiOutlineDown,
} from 'react-icons/ai'
//just for expanable------------
import { useGetPelanggansQuery } from '../../hooks/pelangganHooks'

interface SetoranTableProps {
  form2hereOneAtPage: any
  asalan: Setoran[]
  penyuplay: any[]
  bankir: any[]
  product: any[]
  isLoading: boolean
  editingKey: string
  isEditing: (record: Setoran) => boolean
  save: (key: string) => void
  cancel: () => void
  edit: (record: Setoran) => void
  handleDelete: (key: string) => void
  dapatkanSupById: (onlyOneHere: string) => string
  dapatkanBankById: (onlyOneHere: string) => string
  dapatkanProductById: (onlyOneHere: string) => string
  showIdH: boolean
  showA: boolean
  showTiga: boolean
}

const SetoranTable: React.FC<SetoranTableProps> = ({
  form2hereOneAtPage,
  asalan,
  penyuplay,
  bankir,
  product,
  isLoading,
  editingKey,
  isEditing,
  save,
  cancel,
  edit,
  handleDelete,
  dapatkanSupById,
  dapatkanBankById,
  dapatkanProductById,
  showIdH,
  showA,
  showTiga,
}) => {
  //----------START EXPANDABLE showing source from other collection -------------
  const { data: price, isLoading: isLoadingHargas } = useGetPelanggansQuery()
  const dapatkanJenisHargaByIdOutlet = (id: string) => {
    const foundHargas = price?.filter((harga) => harga.id_outlet === id)
    if (!foundHargas || foundHargas.length === 0) {
      return ''
    }
    return foundHargas.map((harga) => harga.nama).join(', ')
  }
  //---------- end EXPANDABLE  showing source from other collection -------------

  const setoranColumns = [
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
            dataIndex: 'id_setoran',
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
      title: 'Nam Barang',
      dataIndex: 'id_data_barang',
      align: 'center' as 'center',

      fixed: true,
      editable: true,
      render: (text: any, record: Setoran) => {
        const editable = isEditing(record)
        return (
          <div style={{ textAlign: 'center' }}>
            {editable ? (
              <Form.Item
                name="id_data_barang"
                rules={[
                  {
                    required: true,
                    message: 'Please select a barang!',
                  },
                ]}
              >
                <Select>
                  {product.map((product) => (
                    <Select.Option key={product._id} value={product._id}>
                      {product.nama_barang}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            ) : (
              dapatkanProductById(text)
            )}
          </div>
        )
      },
    },
    {
      title: 'Nilai',
      dataIndex: 'nilai',
      fixed: true,
      align: 'center' as 'center',
      render: (naskah: string) => (
        <div style={{ textAlign: 'center' }}>{naskah}</div>
      ),
      editable: true,
    },
    {
      title: 'catatan',
      dataIndex: 'catatan',
      fixed: true,
      align: 'center' as 'center',
      render: (naskah: string) => (
        <div style={{ textAlign: 'center' }}>{naskah}</div>
      ),
      editable: true,
    },

    ...(showA
      ? [
          {
            title: 'status',
            dataIndex: 'status',
            align: 'center' as 'center',
            fixed: true,

            render: (abjad: string) => (
              <div style={{ textAlign: 'center' }}>{abjad}</div>
            ),
            editable: true,
          },
        ]
      : []),
    ...(showTiga
      ? [
          {
            title: 'Dari Outlet',
            dataIndex: 'id_outlet',
            align: 'center' as 'center',

            fixed: true,
            editable: true,
            render: (text: any, record: Setoran) => {
              const editable = isEditing(record)
              return (
                <div style={{ textAlign: 'center' }}>
                  {editable ? (
                    <Form.Item
                      name="id_outlet"
                      rules={[
                        {
                          required: true,
                          message: 'Please select a supplier!',
                        },
                      ]}
                    >
                      <Select>
                        {penyuplay.map((supplier) => (
                          <Select.Option
                            key={supplier._id}
                            value={supplier._id}
                          >
                            {supplier.nama_outlet}
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
        ]
      : []),

    {
      title: 'Ke Outlet',
      dataIndex: 'tujuan_outlet',
      align: 'center' as 'center',

      fixed: true,
      editable: true,
      render: (text: any, record: Setoran) => {
        const editable = isEditing(record)
        return (
          <div style={{ textAlign: 'center' }}>
            {editable ? (
              <Form.Item
                name="tujuan_outlet"
                rules={[
                  {
                    required: true,
                    message: 'Please select a supplier!',
                  },
                ]}
              >
                <Select>
                  {penyuplay.map((supplier) => (
                    <Select.Option key={supplier._id} value={supplier._id}>
                      {supplier.id_outlet}
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
    ...(showTiga
      ? [
          {
            title: 'dari bank',
            dataIndex: 'dari_akun',
            align: 'center' as 'center',

            fixed: true,
            editable: true,
            render: (text: any, record: Setoran) => {
              const editable = isEditing(record)
              return (
                <div style={{ textAlign: 'center' }}>
                  {editable ? (
                    <Form.Item
                      name="dari_akun"
                      rules={[
                        {
                          required: true,
                          message: 'Please select a supplier!',
                        },
                      ]}
                    >
                      <Select>
                        {bankir.map((bangkok) => (
                          <Select.Option key={bangkok._id} value={bangkok._id}>
                            {bangkok.nama_bank}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  ) : (
                    dapatkanBankById(text)
                  )}
                </div>
              )
            },
          },
        ]
      : []),
    {
      title: 'Ke bank',
      dataIndex: 'ke_akun',
      align: 'center' as 'center',

      fixed: true,
      editable: true,
      render: (text: any, record: Setoran) => {
        const editable = isEditing(record)
        return (
          <div style={{ textAlign: 'center' }}>
            {editable ? (
              <Form.Item
                name="ke_akun"
                rules={[
                  {
                    required: true,
                    message: 'Please select a supplier!',
                  },
                ]}
              >
                <Select>
                  {bankir.map((bungkuk) => (
                    <Select.Option key={bungkuk._id} value={bungkuk._id}>
                      {bungkuk.nama_bank}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            ) : (
              dapatkanBankById(text)
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

      render: (_: any, record: Setoran) => {
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
      onCell: (record: Setoran) => ({
        record,
        inputType:
          col.dataIndex === 'id_usaha'
            ? 'number'
            : col.dataIndex === 'id_outlet' ||
              col.dataIndex === 'tujuan_outlet' ||
              col.dataIndex === 'dari_akun' ||
              col.dataIndex === 'ke_akun' ||
              col.dataIndex === 'id_data_barang'
            ? 'select'
            : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        penyuplay,
        bankir,
        product,
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
      dataSource={asalan}
      columns={setoranColumns}
      rowClassName="editable-row"
      loading={isLoading}
      rowKey={(record) => record._id}
      expandable={{
        expandedRowRender: (record) => (
          <div>
            <p style={{ margin: 0 }}>
              Nama Outlet: {dapatkanSupById(record.id_outlet)}
            </p>
            <p style={{ margin: 0 }}>
              Dari Bank: {dapatkanBankById(record.dari_akun)}
            </p>
            <p style={{ margin: 0 }}>
              Ke Bank: {dapatkanBankById(record.ke_akun)}
            </p>
            <p style={{ margin: 0 }}>
              Jenis Harga: {dapatkanJenisHargaByIdOutlet(record.id_outlet)}
            </p>
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
export default SetoranTable
