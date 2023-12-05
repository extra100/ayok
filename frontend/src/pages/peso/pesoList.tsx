import React, { useContext, useEffect, useState } from 'react'
import { Table, message, Menu } from 'antd'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  useGetPenjualanByIdQuery,
  useGetPenjualansQuery,
  useGetsPenjualansQuery,
} from '../../hooks/penjualanHooks'
import UserContext from '../../contexts/UserContext'
import { Pembelian } from '../../types/Pembelian'
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
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap'
import { partialRight } from 'lodash'
import PosPrintKomponent from '../printcoba/PosPrintKomponent'
import MutasiPrintKomponen from '../pindah/mutasiPrintKomponen'
import { useGetPembeliansQuery } from '../../hooks/pembelianHooks'
import { useGetSuppliersQuery } from '../../hooks/supplierHooks'
import { Peso } from '../../types/Peso'
import { useGetPesosQuery } from '../../hooks/pesoHooks'

const PesoList = () => {
  const { data, isLoading } = useGetPesosQuery()

  const userContext = useContext(UserContext)
  const { user } = userContext || {}

  let idOutletLoggedIn = ''

  if (user) {
    idOutletLoggedIn = user.id_outlet
  }

  const [filteredData, setFilteredData] = useState<Peso[]>([])
  const { data: outlets } = useGetoutletsQuery()
  const { data: suppliers } = useGetSuppliersQuery()
  const { data: hargas } = useGetHargasQuery()
  const { id_beli } = useParams<{ id_beli?: string }>()
  const [isBelumDibayarActive, setIsBelumDibayarActive] = useState(false)

  const AmbilData = !!id_beli
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
          (d) => parseFloat(d.total_semua) === 0
        )
      }

      setFilteredData(hasilFilterTotal)
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

      let hasilFilterTotal = hasilFilterOutlet.filter(
        (d) => d.total_semua !== '0'
      )

      if (lun) {
        hasilFilterTotal = hasilFilterTotal.filter(
          (d) => parseFloat(d.total_semua) === 0
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

    navigate('/peso', { state: { strange } })
  }

  const columns = [
    {
      title: 'Nomor',
      dataIndex: 'inv',
      key: 'inv',
      render: (text: any, ini: any) => (
        <Link to={`/pesoDetail/${ini.id_peso}`}>{text}</Link>
      ),
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
              <h1 style={{ fontSize: '2.5rem' }}>List Penyesuaian Stok</h1>
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
              Tambah Penyesuaian
            </Button>
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
        pagination={false}
      />
    </div>
  )
}

export default PesoList
