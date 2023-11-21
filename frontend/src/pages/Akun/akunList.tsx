import React, { useContext, useEffect, useState } from 'react'
import { Table, message, Menu } from 'antd'
import { Link, useNavigate, useParams } from 'react-router-dom'
import UserContext from '../../contexts/UserContext'
import { useGetoutletsQuery } from '../../hooks/outletHooks'
import {
  AiOutlineDown,
  AiOutlinePlus,
  AiOutlinePrinter,
  AiOutlineShareAlt,
} from 'react-icons/ai'
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap'

import MutasiPrintKomponen from '../pindah/mutasiPrintKomponen'

import { useGetAkunasQuery } from '../../hooks/akunaHooks'
import { Akuna } from '../../types/AKuna'

const AkunaList = () => {
  const { data, isLoading } = useGetAkunasQuery()

  const userContext = useContext(UserContext)
  const { user } = userContext || {}

  let idOutletLoggedIn = ''

  if (user) {
    idOutletLoggedIn = user.id_outlet
  }

  const calculateSumByAkunaId = (data: any) => {
    const sumByAkunaId: Record<string, Akuna> = {}

    data.forEach((item: any) => {
      const { id_akuna, jumlah } = item

      if (!sumByAkunaId[id_akuna]) {
        sumByAkunaId[id_akuna] = { ...item, totalJumlah: 0 }
      }

      sumByAkunaId[id_akuna].totalJumlah += jumlah
    })

    return Object.values(sumByAkunaId)
  }
  const [filteredData, setFilteredData] = useState<Akuna[]>([])
  const { data: outlets } = useGetoutletsQuery()

  const { id_akuna } = useParams<{ id_akuna?: string }>()
  const [isBelumDibayarActive, setIsBelumDibayarActive] = useState(false)

  const AmbilData = !!id_akuna
  const navigate = useNavigate()

  useEffect(() => {
    if (user && data) {
      let hasilFilterOutlet

      if (user.isAdmin) {
        hasilFilterOutlet = data
      } else {
        hasilFilterOutlet = data.filter((d) => d.id_outlet === user.id_outlet)
      }

      let hasilFilterTotal = hasilFilterOutlet.filter((d) => d.total !== '0')

      if (isBelumDibayarActive) {
        hasilFilterTotal = hasilFilterTotal.filter((d) => d.jumlah === 0)
      }

      const aggregatedData = calculateSumByAkunaId(hasilFilterTotal)
      setFilteredData(aggregatedData)
    }
  }, [data, user, isBelumDibayarActive])

  const [lun, setLun] = useState(false)

  useEffect(() => {
    if (user && data) {
      let hasilFilterOutlet

      if (user.isAdmin) {
        hasilFilterOutlet = data
      } else {
        hasilFilterOutlet = data.filter((d) => d.id_outlet === user.id_outlet)
      }

      let hasilFilterTotal = hasilFilterOutlet.filter((d) => d.total !== '0')

      if (isBelumDibayarActive) {
        hasilFilterTotal = hasilFilterTotal.filter((d) => d.jumlah === 0)
      }

      const aggregatedData = calculateSumByAkunaId(hasilFilterTotal)
      setFilteredData(aggregatedData)
    }
  }, [data, user, isBelumDibayarActive])

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

    navigate('/akuna', { state: { strange } })
  }
  const columns = [
    {
      title: 'Nomor',
      dataIndex: 'id_akuna',
      key: 'id_akuna',
      render: (text: any, ini: any) => (
        <Link to={`/pesoDetail/${ini.id_peso}`}>{text}</Link>
      ),
    },
    {
      title: 'Dibayar dari',
      dataIndex: 'kategori',
      key: 'kategori',
    },
    {
      title: 'Jumlah',
      dataIndex: 'totalJumlah',
      key: 'totalJumlah',
    },
    {
      title: 'Penerima',
      dataIndex: 'penerima',
      key: 'penerima',
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

    {
      title: 'Tanggal',
      dataIndex: 'tanggal',
      key: 'tanggal',
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
    },
    {
      title: 'Catatan',
      dataIndex: 'pesan',
      key: 'pesan',
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
              <h1 style={{ fontSize: '2.5rem' }}>List Biaya</h1>
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
              Tambah Beban
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
                <Dropdown overlay={menu} placement="bottomRight">
                  <a
                    style={{ textDecoration: 'none' }}
                    className="ant-dropdown-link"
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

                      <AiOutlineDown />
                    </div>
                  </a>
                </Dropdown>
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
                <Dropdown overlay={menu} placement="bottomRight">
                  <a
                    style={{ textDecoration: 'none' }}
                    className="ant-dropdown-link"
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
                      <div style={{ marginRight: '5px', marginLeft: '5px' }}>
                        Print
                      </div>

                      <AiOutlineDown />
                    </div>
                  </a>
                </Dropdown>
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
        pagination={true}
      />
    </div>
  )
}

export default AkunaList
