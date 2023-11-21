import React from 'react'
import { useGetPelanggansQuery } from '../../hooks/pelangganHooks'

const ComponentToPrint = React.forwardRef((props, ref) => {
  const { data: satuans } = useGetPelanggansQuery()

  if (!satuans) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h2 style={{ color: 'green' }}>Nama Pelanggan</h2>
      <table>
        <thead>
          <tr>
            <th>S/N</th>
            <th>id pelanggan</th>
            <th>Nama pelanggan</th>
          </tr>
        </thead>
        <tbody>
          {satuans.map((satuan, index) => (
            <tr key={satuan._id}>
              <td>{index + 1}</td>
              <td>{satuan.id_pelanggan}</td>
              <td>{satuan.nama}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})

export default ComponentToPrint
