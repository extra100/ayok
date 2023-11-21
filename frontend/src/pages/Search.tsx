import React, { useState } from 'react'
import { Input } from 'antd'

interface FilterProps {
  onSearch: (filter: string) => void
}

const Search: React.FC<FilterProps> = ({ onSearch }) => {
  const [filter, setFilter] = useState<string>('')

  return (
    <Input
      placeholder="Pencarian . . . "
      onChange={(e) => {
        setFilter(e.target.value)
        onSearch(e.target.value)
      }}
      style={{
        width: 200,
        border: 'none',

        marginRight: 8,
      }}
    />
  )
}

export default Search
