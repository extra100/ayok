// import React, { useState, useEffect } from 'react'
// import { Input } from 'antd'

// const TanggalOdak: React.FC = () => {
//   const [startDate, setStartDate] = useState<string | null>(null)
//   const [endDate, setEndDate] = useState<string | null>(null)
//   const [dateDifference, setDateDifference] = useState<number | null>(null)

//   useEffect(() => {
//     if (startDate && endDate) {
//       const start = new Date(startDate)
//       const end = new Date(endDate)
//       const diff = Math.round(
//         (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
//       )
//       setDateDifference(diff)
//     } else {
//       setDateDifference(null)
//     }
//   }, [startDate, endDate])

//   return (
//     <div
//       style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         flexWrap: 'wrap',
//         gap: '1rem',
//       }}
//     >
//       <div style={{ flex: 1 }}>
//         Tanggal Awal:
//         <Input
//           type="date"
//           value={startDate || ''}
//           onChange={(e) => setStartDate(e.target.value)}
//         />
//       </div>

//       <div style={{ flex: 1 }}></div>
//       <div style={{ flex: 1 }}>
//         Tanggal Jatuh Kempo:
//         <Input
//           type="date"
//           value={endDate || ''}
//           onChange={(e) => setEndDate(e.target.value)}
//         />
//       </div>
//       <div style={{ flex: 1 }}></div>
//       <div style={{ flex: 1 }}>
//         <Input
//           value={dateDifference !== null ? dateDifference.toString() : ''}
//           addonBefore="Termin"
//           style={{ width: '130px', marginTop: 22 }}
//         />
//       </div>
//     </div>
//   )
// }

import React, { useState, useEffect } from 'react'
import { Input } from 'antd'

const TanggalOdak: React.FC = () => {
  const initialStartDate = new Date().toISOString().split('T')[0]

  const [startDate, setStartDate] = useState<string | null>(initialStartDate)
  const [endDate, setEndDate] = useState<string | null>(initialStartDate)
  const [termin, setTermin] = useState<number | null>(30)

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const diff = Math.round(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      )
      setTermin(diff)
    }
  }, [startDate, endDate])

  useEffect(() => {
    if (startDate && termin !== null) {
      const newEndDate = new Date(startDate)
      newEndDate.setDate(newEndDate.getDate() + termin)
      setEndDate(newEndDate.toISOString().split('T')[0])
    }
  }, [startDate, termin])

  const handleStartDateChange = (value: string) => {
    setStartDate(value)
    if (termin !== null) {
      const newEndDate = new Date(value)
      newEndDate.setDate(newEndDate.getDate() + termin)
      setEndDate(newEndDate.toISOString().split('T')[0])
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
    >
      <div style={{ flex: 1 }}>
        Tanggal Awal:
        <Input
          type="date"
          value={startDate || ''}
          onChange={(e) => handleStartDateChange(e.target.value)}
        />
      </div>

      <div style={{ flex: 1 }}>
        Tanggal Jatuh Kempo:
        <Input
          type="date"
          value={endDate || ''}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div style={{ flex: 1 }}>
        <Input
          type="number"
          value={termin !== null ? termin.toString() : ''}
          onChange={(e) => setTermin(parseInt(e.target.value))}
          addonBefore="Termin"
          style={{ width: '130px', marginTop: 22 }}
        />
      </div>
    </div>
  )
}

export default TanggalOdak
