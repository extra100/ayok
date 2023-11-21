import React from 'react'
import { Switch, Button, Dropdown } from 'antd'
import { AiOutlineBars } from 'react-icons/ai'

interface ToggleMultiProps {
  showIdMulti: boolean
  showA: boolean
  toggleShowIdMulti: () => void
  toggleshowA: () => void
  onClick: () => void
  buttonText: string
}

const ToggleMulti: React.FC<ToggleMultiProps> = ({
  showIdMulti,
  showA,
  toggleShowIdMulti,
  toggleshowA,
  onClick,
  buttonText,
}) => {
  const menuItems = [
    {
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Switch checked={showIdMulti} onChange={toggleShowIdMulti} />
          <span>{showIdMulti ? 'Hide Id Multi' : 'Show Id Multi'}</span>
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

export default ToggleMulti
