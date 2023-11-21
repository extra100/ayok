import { Form, Select } from 'antd'
import React, { useState, useEffect } from 'react'

const { Option } = Select
function FormAlamat() {
  const [provinces, setProvinces] = useState<{ id: string; name: string }[]>([])
  const [selectedProvince, setSelectedProvince] = useState('')
  const [regencies, setRegencies] = useState<{ id: string; name: string }[]>([])
  const [selectedRegency, setSelectedRegency] = useState('')
  const [districts, setDistricts] = useState<{ id: string; name: string }[]>([])
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [villages, setVillages] = useState<{ id: string; name: string }[]>([])
  const [selectedVillage, setSelectedVillage] = useState('') // Add this line

  useEffect(() => {
    fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
      .then((response) => response.json())
      .then((data) => setProvinces(data))
      .catch((error) => console.error('Error fetching provinces:', error))
  }, [])

  useEffect(() => {
    if (selectedProvince) {
      fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince}.json`
      )
        .then((response) => response.json())
        .then((data) => setRegencies(data))
        .catch((error) => console.error('Error fetching regencies:', error))
    } else {
      setRegencies([])
      setSelectedRegency('')
    }
  }, [selectedProvince])

  useEffect(() => {
    if (selectedRegency) {
      fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedRegency}.json`
      )
        .then((response) => response.json())
        .then((data) => setDistricts(data))
        .catch((error) => console.error('Error fetching districts:', error))
    } else {
      setDistricts([])
      setSelectedDistrict('')
    }
  }, [selectedRegency])

  useEffect(() => {
    if (selectedDistrict) {
      fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${selectedDistrict}.json`
      )
        .then((response) => response.json())
        .then((data) => setVillages(data))
        .catch((error) => console.error('Error fetching villages:', error))
    } else {
      setVillages([])
    }
  }, [selectedDistrict])

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value)
    setSelectedRegency('')
    setSelectedDistrict('')
    setSelectedVillage('')
  }

  const handleRegencyChange = (value: string) => {
    setSelectedRegency(value)
    setSelectedDistrict('')
    setSelectedVillage('')
  }

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value)
    setSelectedVillage('')
  }

  const handleVillageChange = (value: string) => {
    setSelectedVillage(value)
  }

  return (
    <div className="FormAlamat">
      <Form>
        <Form.Item label="Pilih Prov">
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children
                ? option.children
                    .toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                : false
            }
            style={{ width: 200 }}
            onChange={handleProvinceChange}
            value={selectedProvince}
          >
            {provinces.map((province) => (
              <Option key={province.id} value={province.id}>
                {province.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Pilih Kab">
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children
                ? option.children
                    .toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                : false
            }
            style={{ width: 200 }}
            onChange={handleRegencyChange}
            value={selectedRegency}
            disabled={!selectedProvince}
          >
            {regencies.map((regency) => (
              <Option key={regency.id} value={regency.id}>
                {regency.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Pilih camat">
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children
                ? option.children
                    .toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                : false
            }
            style={{ width: 200 }}
            onChange={handleDistrictChange}
            value={selectedDistrict}
            disabled={!selectedRegency}
          >
            {districts.map((district) => (
              <Option key={district.id} value={district.id}>
                {district.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Pilih Desa">
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children
                ? option.children
                    .toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                : false
            }
            style={{ width: 200 }}
            onChange={handleVillageChange}
            value={selectedVillage}
            disabled={!selectedDistrict}
          >
            {villages.map((village) => (
              <Option key={village.id} value={village.id}>
                {village.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </div>
  )
}

export default FormAlamat
