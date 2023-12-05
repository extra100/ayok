import React, { useContext, useEffect, useState } from 'react'
import { Table, message, Menu, Tooltip } from 'antd'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  useGetPenjualanByIdQuery,
  useGetPenjualansQuery,
  useGetsPenjualansQuery,
} from '../../hooks/penjualanHooks'
import UserContext from '../../contexts/UserContext'
import { Penjualan } from '../../types/Penjualan'
import { useGetoutletsQuery } from '../../hooks/outletHooks'
import { useGetHargasQuery } from '../../hooks/hargaHooks'
import { useGetPelanggansQuery } from '../../hooks/pelangganHooks'
import {
  AiFillPlusCircle,
  AiOutlineArrowLeft,
  AiOutlineDown,
  AiOutlinePlus,
  AiOutlinePrinter,
  AiOutlineShareAlt,
} from 'react-icons/ai'
import { Button, ButtonGroup, Dropdown, Popover } from 'react-bootstrap'
import { partialRight } from 'lodash'
import PosPrintKomponent from '../printcoba/PosPrintKomponent'
import MutasiPrintKomponen from '../pindah/mutasiPrintKomponen'
import PosPageDetail from '../pos/PosPageDetail'
import { useGetPossQuery } from '../../hooks/posHooks'
import { useGetProductsQuery } from '../../hooks/productHooks'

const PenjualanPageKledo = () => {
  const { data, isLoading } = useGetPenjualansQuery()

  const userContext = useContext(UserContext)
  const { user } = userContext || {}

  let idOutletLoggedIn = ''

  if (user) {
    idOutletLoggedIn = user.id_outlet
  }
  const tessy =
    'Ini adalah detail data yang akan ditampilkan tanpa diklik. Gantilah ini dengan data sesuai kebutuhan Anda.'

  const [filteredData, setFilteredData] = useState<Penjualan[]>([])
  const { data: outlets } = useGetoutletsQuery()
  const { data: pelanggans } = useGetPelanggansQuery()
  const { data: hargas } = useGetHargasQuery()
  const { id_pos } = useParams<{ id_pos?: string }>()
  const [isBelumDibayarActive, setIsBelumDibayarActive] = useState(false)

  const AmbilData = !!id_pos
  const navigate = useNavigate()

  useEffect(() => {
    if (user && data) {
      let hasilFilterOutlet

      if (user.isAdmin) {
        hasilFilterOutlet = data
      } else {
        hasilFilterOutlet = data.filter((d) => d.id_outlet === user.id_outlet)
      }

      let hasilFilterTotal = hasilFilterOutlet.filter(
        (d) => d.total_semua !== '0'
      )
      console.log(filteredData)

      if (isBelumDibayarActive) {
        hasilFilterTotal = hasilFilterTotal.filter(
          (d) => parseFloat(d.bayar) === 0
        )
      }

      setFilteredData(hasilFilterTotal)
    }
  }, [data, user, isBelumDibayarActive])

  const toggleBelumDibayar = () => {
    setIsBelumDibayarActive((prev) => !prev)
  }

  const [partially, setPartially] = useState(false)
  useEffect(() => {
    if (user && data) {
      let hasilFilterOutlet

      if (user.isAdmin) {
        hasilFilterOutlet = data
      } else {
        hasilFilterOutlet = data.filter((d) => d.id_outlet === user.id_outlet)
      }

      let hasilFilterTotal = hasilFilterOutlet.filter(
        (d) => d.total_semua !== '0'
      )

      if (partially) {
        hasilFilterTotal = hasilFilterTotal.filter(
          (d) => parseFloat(d.bayar) > 0 && parseFloat(d.piutang) > 0
        )
      }

      setFilteredData(hasilFilterTotal)
    }
  }, [data, user, partially])

  const toggleSebagian = () => {
    setPartially((prev) => !prev)
  }

  const [lun, setLun] = useState(false)
  useEffect(() => {
    if (user && data) {
      let hasilFilterOutlet

      if (user.isAdmin) {
        hasilFilterOutlet = data
      } else {
        hasilFilterOutlet = data.filter((d) => d.id_outlet === user.id_outlet)
      }

      let hasilFilterTotal = hasilFilterOutlet.filter(
        (d) => d.total_semua !== '0'
      )

      if (lun) {
        hasilFilterTotal = hasilFilterTotal.filter(
          (d) => parseFloat(d.piutang) === 0
        )
      }

      setFilteredData(hasilFilterTotal)
    }
  }, [data, user, lun])

  const toggleLun = () => {
    setLun((prev) => !prev)
  }

  const menu = (
    <Menu key="1">
      <Menu.Item>
        <MutasiPrintKomponen />
      </Menu.Item>
      <Menu.Item key="2">pdf</Menu.Item>
    </Menu>
  )

  const klikPindah = () => {
    const awalan = 'MOVE'
    const acakNomor = Math.floor(Math.random() * 10000)
    const strange = `${awalan}${acakNomor}`

    navigate('/posdua', { state: { strange } })
  }
  const { data: posData } = useGetPossQuery()
  const { data: products } = useGetProductsQuery()

  const columns = [
    // {
    //   title: 'Nomor',
    //   dataIndex: 'inv',
    //   key: 'inv',
    //   render: (text: any, ini: any) => (
    //     <Link to={`/posdetail/${ini.id_pos}`}>{text}</Link>
    //   ),
    // },
    {
      title: 'Nomor',
      dataIndex: 'inv',
      key: 'inv',
      render: (text: any, ini: any) => {
        const matchingDataBarang = posData?.filter(
          (dataBarang) => dataBarang.id_pos === ini.id_pos
        )

        const tooltipText = `
        <table style="border-collapse: collapse;">
          <tr>
            <td style="width: 4%; border: 1px solid black;">No</td>
            <td style="width: 80%; border: 1px solid black;">Nama Barang</td>
          </tr>
          ${matchingDataBarang
            ?.map((dataBarang, index) => {
              const product = products?.find(
                (product) =>
                  product.id_data_barang === dataBarang.id_data_barang
              )
              return `
                <tr>
                  <td style="border: 1px solid black;">${index + 1}</td>
                  <td style="border: 1px solid black;">${
                    product?.nama_barang
                  }</td>
                </tr>
              `
            })
            .join('')}
        </table>
      `

        return (
          <Tooltip
            style={{ width: 800 }}
            title={
              <div dangerouslySetInnerHTML={{ __html: tooltipText as any }} />
            }
          >
            <Link to={`/posdetail/${ini.id_pos}`}>{text}</Link>
          </Tooltip>
        )
      },
    },
    {
      title: 'Nama Outlet',
      dataIndex: 'id_outlet',
      key: 'nama_outlet',
      render: (id_outlet: string) => {
        const outlet = outlets?.find((outlet: any) => outlet._id === id_outlet)
        return outlet ? outlet.nama_outlet : '-'
      },
    },
    // {
    //   title: 'Nama Pelanggan',
    //   dataIndex: 'nama',
    //   key: 'nama',
    //   render: (nama: string) => {
    //     const pelanggan = pelanggans?.find(
    //       (pelanggan) => pelanggan._id === nama
    //     )
    //     return pelanggan ? pelanggan.nama : '-'
    //   },
    // },
    {
      title: 'Nama Pelanggan',
      dataIndex: 'nama',
      key: 'nama',
    },
    {
      title: 'Jenis Harga',
      dataIndex: 'id_harga',
      key: 'id_harga',
    },
    {
      title: 'Piutang',
      dataIndex: 'piutang',
      key: 'piutang',
    },
    {
      title: 'Total Semua',
      dataIndex: 'total_semua',
      key: 'total_semua',
    },
    {
      title: 'Tanggal',
      dataIndex: 'tanggal_mulai',
      key: 'tanggal_mulai',
    },

    {
      title: 'Status',
      dataIndex: 'piutang',
      fixed: true,
      align: 'center' as 'center',
      render: (piutang: string, ini: Penjualan) => {
        let statusText
        let textColor = 'inherit'

        if (parseFloat(piutang) === 0) {
          statusText = 'Lunas'
          textColor = '#11a428'
        } else if (
          parseFloat(ini.bayar) > 0 &&
          parseFloat(ini.bayar) < parseFloat(ini.total_semua)
        ) {
          statusText = 'Bayar Sebagian'
          textColor = 'orange'
        } else if (parseFloat(ini.bayar) === 0) {
          statusText = 'Belum dibayar'
          textColor = '#cf2a2b'
        }

        return (
          <div
            style={{
              textAlign: 'left',
              color: textColor,
            }}
          >
            {statusText}
          </div>
        )
      },
      editable: true,
    },
  ]
  return (
    <div
      className="radius"
      style={{
        border: '1px #f0f0f0 solid',
        padding: '15px',
        background: 'white',
        height: '1000px',
      }}
    >
      <div style={{ border: '1px' }}>
        <div style={{ display: 'flex', marginBottom: 20 }}>
          <div
            style={{
              flex: '1',
              border: '1px solid white',
              flexBasis: '40%',
              textAlign: 'right',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <h1 style={{ fontSize: '2.5rem' }}>Penjualan</h1>
            </div>
          </div>

          <div
            style={{
              flex: '1',
              border: '1px solid white',
              flexBasis: '5%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              style={{
                display: 'flex',
                height: 30,
                justifyContent: 'center',
                alignItems: 'center',
                background: '#138D75',
                width: '50%',
                borderRadius: 0,
                border: 0,
              }}
              onClick={klikPindah}
            >
              <AiOutlinePlus
                style={{
                  marginRight: '10px',
                }}
              />
              Tambah Tagihan
            </Button>
            <div
              style={{
                flex: '1',
                border: '1px solid white',
                flexBasis: '2%',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  flex: '1',
                  border: '1px solid #e9ecef',
                  flexBasis: '2%',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  height: '30px',
                }}
              >
                <div
                  style={{
                    flex: '1',
                    border: '1px solid white',
                    flexBasis: '5%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    style={{
                      display: 'flex',
                      height: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                      background: '#138D75',
                      width: '50%',
                      borderRadius: 0,
                      border: 0,
                    }}
                    onClick={klikPindah}
                  >
                    <AiOutlinePlus
                      style={{
                        marginRight: '10px',
                      }}
                    />
                    Tambah Tagihan
                  </Button>
                  <div
                    style={{
                      flex: '1',
                      border: '1px solid white',
                      flexBasis: '2%',
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}
                  >
                    <a
                      style={{
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      onClick={(e) => e.preventDefault()}
                    >
                      <div
                        style={{
                          flex: '1',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '100px',
                          color: 'black',
                        }}
                      >
                        <AiOutlineShareAlt />
                        <div style={{ marginRight: '5px', marginLeft: '5px' }}>
                          Bagikan
                        </div>
                      </div>
                    </a>
                  </div>

                  <div
                    style={{
                      flex: '1',
                      border: '1px solid white',
                      flexBasis: '2%',
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        flex: '1',
                        border: '1px solid #e9ecef',
                        flexBasis: '2%',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        height: '30px',
                      }}
                    >
                      <a
                        style={{
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        onClick={(e) => e.preventDefault()}
                      >
                        <div
                          style={{
                            flex: '1',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100px',
                            color: 'black',
                          }}
                        >
                          <AiOutlinePrinter />
                          <div
                            style={{ marginRight: '5px', marginLeft: '5px' }}
                          >
                            Print
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            borderTop: '1px #f0f0f0 solid',
            padding: '15px',
          }}
        >
          <div
            style={{
              flex: '1',
              border: '1px solid white',
              flexBasis: '40%',
              display: 'flex',
              justifyContent: 'right',
              alignItems: 'center',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <h1 style={{ fontSize: '1.5rem' }}></h1>
            </div>
          </div>

          <div
            style={{
              flex: '1',
              border: '1px solid white',
              flexBasis: '2%',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          ></div>
        </div>
      </div>

      <div style={{ textAlign: 'left' }}>
        <ButtonGroup aria-label="Basic example">
          <Button
            variant="outline-primary"
            style={{ border: '1px solid #f0f0f0', borderRadius: '0px' }}
          >
            Semua
          </Button>
          <Button
            variant="outline-primary"
            style={{
              border: '1px solid #f0f0f0',
              borderRadius: '0px',
              backgroundColor: isBelumDibayarActive ? 'blue' : 'white',
            }}
            onClick={toggleBelumDibayar}
          >
            Belum dibayar
          </Button>
          <Button
            variant="outline-primary"
            style={{
              border: '1px solid #f0f0f0',
              borderRadius: '0px',
              backgroundColor: partially ? 'blue' : 'white',
            }}
            onClick={toggleSebagian}
          >
            Bayar Sebagian
          </Button>
          <Button
            variant="outline-primary"
            style={{
              border: '1px solid #f0f0f0',
              borderRadius: '0px',
              backgroundColor: lun ? 'blue' : 'white',
            }}
            onClick={toggleLun}
          >
            Lunas
          </Button>
        </ButtonGroup>
      </div>

      <br />
      <div
        style={{
          flex: '1',
          flexBasis: '40%',
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
        }}
      ></div>

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="_id"
        pagination={false}
      />
    </div>
  )
}

export default PenjualanPageKledo
