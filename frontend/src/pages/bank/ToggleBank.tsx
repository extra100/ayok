import React from 'react'
import { Switch, Button, Dropdown } from 'antd'
import { AiOutlineBars } from 'react-icons/ai'

interface ToggleBankProps {
  showIdH: boolean
  showA: boolean
  showTiga: boolean
  toggleshowIdH: () => void
  toggleshowA: () => void
  toggleShowTiga: () => void
  onClick: () => void
  buttonText: string
}

const ToggleBank: React.FC<ToggleBankProps> = ({
  showIdH,
  showA,
  showTiga,
  toggleshowIdH,
  toggleshowA,
  toggleShowTiga,
  onClick,
  buttonText,
}) => {
  const menuItems = [
    {
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Switch checked={showIdH} onChange={toggleshowIdH} />
          <span>{showIdH ? 'Hide Id Bank' : 'Show Id Bank'}</span>
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
    {
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Switch checked={showTiga} onChange={toggleShowTiga} />
          <span>{showA ? 'Hide Alamat' : 'Show Alamat'}</span>
        </div>
      ),
      key: '3',
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

export default ToggleBank
