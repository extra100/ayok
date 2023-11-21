import React from 'react'
import { Switch, Button, Dropdown } from 'antd'
import { AiOutlineBars } from 'react-icons/ai'

interface TogglePenjualanProps {
  showIdH: boolean
  showA: boolean
  toggleshowIdH: () => void
  toggleshowA: () => void
  onClick: () => void
  buttonText: string
}

const TogglePenjualan: React.FC<TogglePenjualanProps> = ({
  showIdH,
  showA,
  toggleshowIdH,
  toggleshowA,
  onClick,
  buttonText,
}) => {
  const menuItems = [
    {
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Switch checked={showIdH} onChange={toggleshowIdH} />
          <span>{showIdH ? 'Hide Id Penjualan' : 'Show Id Penjualan'}</span>
        </div>
      ),
      key: '1',
    },
    {
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Switch checked={showA} onChange={toggleshowA} />
          <span>{showA ? 'Hide Alamat' : 'Show Alamat'}</span>
        </div>
      ),
      key: '2',
    },
  ]

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 16,
      }}
    >
      <Button type="primary" onClick={onClick}>
        {buttonText}
      </Button>
      <Dropdown menu={{ items: menuItems }} placement="bottomRight">
        <Button icon={<AiOutlineBars />} />
      </Dropdown>
    </div>
  )
}

export default TogglePenjualan
