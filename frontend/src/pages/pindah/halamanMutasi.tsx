import React, { useEffect, useState } from 'react'
import { Input, Table } from 'antd'
import { useGetPindahsQuery } from '../../hooks/pindahHooks'
import { Pindah } from '../../types/Pindah'

const HalamanMuntasi: React.FC = () => {
  const { data: pindahs } = useGetPindahsQuery()
  const [dataMutasi, setDatamutasi] = useState<Pindah[]>([])
  const [showBiaya, setShowBiaya] = useState(false)

  const updateQtyBeri = (id: string, newValue: number) => {
    if (!isNaN(newValue)) {
      const updatedData = dataMutasi.map((item) => {
        if (item._id === id) {
          return { ...item, qty_beri: newValue.toString() }
        }
        return item
      })
      setDatamutasi(updatedData as any)
    }
  }

  useEffect(() => {
    if (pindahs) {
      setDatamutasi(pindahs)
    }
  }, [pindahs])

  const columns = [
    {
      title: 'Qty Minta',
      dataIndex: 'qty_minta',
      key: 'qty_minta',
    },
    {
      title: 'Qty Beri',
      dataIndex: 'qty_beri',
      key: 'qty_beri',
      render: (text: any, record: any) => (
        <Input
          type="number"
          value={text}
          onChange={(e) => updateQtyBeri(record._id, parseInt(e.target.value))}
        />
      ),
    },
  ]

  return (
    <>
      <Table dataSource={dataMutasi} columns={columns} rowKey="_id" />
      {/* <div
        style={{
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'row',
          width: '70vw',
          height: '300px',
        }}
      >
        <div
          style={{
            width: '50%',
            height: '100%',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
          }}
        >
          <h5>Pesan:</h5>
        </div>
        <div
          style={{
            width: '50%',
            height: '100%',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'end',
          }}
        >
          <h5>Harga</h5>
          <h5>Diskon</h5>
          <h5>Total</h5>
          <Input
            style={
              showBiaya
                ? {
                    visibility: 'visible',
                  }
                : {
                    visibility: 'hidden',
                  }
            }
          ></Input>
          <h5>lainnya</h5>
        </div>
        <div
          style={{
            width: '50%',
            height: '100%',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'end',
          }}
        >
          <h5>10.000</h5>
          <h5>10%</h5>
          <h5>100</h5>
          <h5 onClick={() => setShowBiaya(!showBiaya)}>Biaya lain</h5>
          <h5>00000 </h5>
        </div>
      </div> */}
    </>
  )
}

export default HalamanMuntasi
