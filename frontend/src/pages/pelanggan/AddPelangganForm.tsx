import {
  Form,
  Input,
  Card,
  Button,
  Select,
  Row,
  Col,
  theme,
  DatePicker,
  Tag,
} from 'antd'
import {
  useAddPelangganMutation,
  useGetPelanggansQuery,
} from '../../hooks/pelangganHooks'
import { Pelanggan } from '../../types/Pelanggan'
import { Harga } from '../../types/Harga'
import { Outlet } from '../../types/Outlet'
import { Usaha } from '../../types/Usaha'
import { useGetHargasQuery } from '../../hooks/hargaHooks'
import { useGetUsahasQuery } from '../../hooks/usahaHooks'

import { Link, useNavigate } from 'react-router-dom'
import { AiOutlinePlus } from 'react-icons/ai'
import { useGetoutletsQuery } from '../../hooks/outletHooks'

import React, { useContext, useEffect, useRef, useState } from 'react'
import UserContext from '../../contexts/UserContext'
import { Option } from 'antd/es/mentions'
import TextArea from 'antd/es/input/TextArea'
import dayjs from 'dayjs'
import { Dayjs } from 'dayjs'
import DateCicil from '../DateCicilan'

import { PlusOutlined } from '@ant-design/icons'
import { TweenOneGroup } from 'rc-tween-one'
import type { InputRef } from 'antd'

import { useAddTagMutation, useGetTagsQuery } from '../../hooks/tagHooks'
import { useGetTypeKontaksQuery } from '../../hooks/typeKontakHooks'

export type TagTypo = {
  _id: string
  nama_tag: string
  disabled: boolean | undefined
  value: string | undefined
}

const AddPelangganForm: React.FC = () => {
  const userContext = useContext(UserContext)
  const { user } = userContext || {}

  if (user) {
  }
  const [provinces, setProvinces] = useState<{ id: string; name: string }[]>([])
  const [selectedProvince, setSelectedProvince] = useState('')
  const [regencies, setRegencies] = useState<{ id: string; name: string }[]>([])
  const [selectedRegency, setSelectedRegency] = useState('')
  const [districts, setDistricts] = useState<{ id: string; name: string }[]>([])
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [villages, setVillages] = useState<{ id: string; name: string }[]>([])
  const [selectedVillage, setSelectedVillage] = useState('') // Add this line
  const [isiRt, setIsiRt] = useState('')
  console.log({ isiRt })

  const [selectedHp, setSelectedHp] = useState('')

  const [selectedNpwp, setNpwp] = useState('')
  const [pengenal, setPengenal] = useState('')
  console.log({ pengenal })

  const [noPengenal, setNoPengenal] = useState('')
  const [email, setEmail] = useState('')
  const [selectedKoordinat, setSelectedKoordinat] = useState('')
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
  const handleDusunChange: React.ChangeEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    const value = event.target.value
    setIsiRt(value)
  }
  const handleHp = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSelectedHp(value)
  }

  const handleNpwp = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setNpwp(value)
  }
  const handlePengenal = (value: string) => {
    setPengenal(value)
  }

  const handleNoPengenal = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setNoPengenal(value)
  }
  const handleKoordinat = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSelectedKoordinat(value)
  }
  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setEmail(value)
  }
  const handleTanggal = (value: Dayjs | null) => {
    setSelectedTanggal(value)
  }

  const [lekukan] = Form.useForm()
  const { data, isLoading } = useGetPelanggansQuery()
  const { data: hargasData, isLoading: isHargasLoading } = useGetHargasQuery()
  const { data: outletsData, isLoading: isOutletLoading } = useGetoutletsQuery()
  const { data: usahasData, isLoading: isUsahaLoading } = useGetUsahasQuery()
  const [adding, setAdding] = useState(false)
  const addPelangganMutation = useAddPelangganMutation()
  const navigate = useNavigate()

  const handleAddPelanggan = () => {
    lekukan.resetFields()
    setAdding(true)
    if (data && Array.isArray(data)) {
      const lastRecord = [...data]
        .sort((a, b) => a.id_pelanggan.localeCompare(b.id_pelanggan))
        .pop()

      if (lastRecord) {
        const lastIdNumber = Number(
          lastRecord.id_pelanggan.replace(/[^0-9]/g, '')
        )
        const nextId = lastIdNumber + 1
        const paddedId = nextId.toString().padStart(5, '0')
        lekukan.setFieldsValue({ id_pelanggan: `PLN-${paddedId}` })
      } else {
        lekukan.setFieldsValue({ id_pelanggan: `PLN-00001` })
      }
    }
  }

  React.useEffect(() => {
    if (!isLoading) {
      handleAddPelanggan()
    }
  }, [isLoading])
  const [selectedTanggal, setSelectedTanggal] = useState<Dayjs | null>()
  console.log({ selectedTanggal })

  const saveNewPelanggan = async () => {
    try {
      const row = (await lekukan.validateFields()) as Pelanggan
      const selectedHarga = hargasData?.find(
        (harga) => harga._id === row.id_harga
      )

      if (selectedHarga) {
        row.type_kontak = `${row.type_kontak}`
      }

      const newPelanggan: Pelanggan = {
        _id: row._id,
        id_pelanggan: row.id_pelanggan,
        type_kontak: selectedTags.join(', '),

        id_harga: row.id_harga || '-',
        id_outlet: row.id_outlet,
        nama: row.nama,
        pengenal: pengenal,
        no_pengenal: noPengenal,
        tanggal: selectedTanggal?.format('DD-MM-YYYY') ?? '0',

        email: email,
        npwp: selectedNpwp,
        perusahaan: row.perusahaan,

        provinsi: selectedProvince,
        kabupaten: selectedRegency,
        kecamatan: selectedDistrict,
        desa: selectedVillage,
        rt: isiRt,

        hp: selectedHp,
        koordinat: selectedKoordinat,
      }

      await addPelangganMutation.mutateAsync(newPelanggan)
      setAdding(false)
      navigate('/Pelanggan')
    } catch (errInfo) {}
  }

  const [selectedOutletId, setSelectedOutletId] = useState('')
  const [hargaTerpilih, setHargaTerpilih] = useState('')

  const [defaultOutletName, setDefaultOutletName] = useState('')
  React.useEffect(() => {
    if (outletsData && outletsData.length > 0) {
      setDefaultOutletName(outletsData[0].nama_outlet)
    }
  }, [outletsData])
  const { token } = theme.useToken()
  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<InputRef>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  console.log({ selectedTags })

  const [tags, setTags] = useState<string[]>([])
  const [showAddForm, setShowAddForm] = useState(false)

  const addTagMutation = useAddTagMutation()
  const [isEditing, setIsEditing] = useState(false)
  const handleEditClick = () => {
    setIsEditing(true)
  }

  const { data: gorets } = useGetTypeKontaksQuery()

  useEffect(() => {
    if (gorets) {
      console.log({ gorets })
      const namaTag = gorets.map((colek) => colek.type_kontak).flat()
      setTags(namaTag)
    }
  }, [gorets])

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag)
    setTags(newTags)

    if (selectedTags.includes(removedTag)) {
      const newSelectedTags = selectedTags.filter((tag) => tag !== removedTag)
      setSelectedTags(newSelectedTags)
    }
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
  }

  const handleAddTagClick = () => {
    setShowAddForm(true)
  }

  const handleSaveTag = () => {
    if (inputValue) {
      setSelectedTags([...selectedTags, inputValue])
      setInputValue('')

      setShowAddForm(false)
    }
  }

  const tagOptions = tags.map((tag) => (
    <Select.Option key={tag} value={tag}>
      {tag}
    </Select.Option>
  ))
  return (
    <Card
      style={{
        marginTop: '0px',
      }}
    >
      <Form form={lekukan} component={false}>
        <Form.Item
          name="id_pelanggan"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          rules={[
            {
              required: true,
              message: 'Please input the ID of the Pelanggan!',
            },
          ]}
          style={{ position: 'absolute', top: 0, right: -100 }}
        >
          <Input
            disabled
            style={{ border: 'none', backgroundColor: 'transparent' }}
          />
        </Form.Item>

        <Form.Item
          name="id_outlet"
          label="Nama Outlet"
          initialValue={user && user.id_outlet}
          rules={[
            {
              required: true,
              message: 'Please select the Nama Outlet!',
            },
          ]}
        >
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
            onChange={(value) => setSelectedOutletId(value)}
            defaultValue={user?.id_outlet}
            disabled={!user?.isAdmin}
          >
            {outletsData?.map((Itsonyou: Outlet) => (
              <Select.Option key={Itsonyou._id} value={Itsonyou._id}>
                {Itsonyou.nama_outlet}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* <Form.Item name="type_kontak" label="Type Kontak">
          <Select>
            <Select.Option value="pelanggan">Pelanggan</Select.Option>
            <Select.Option value="supplier">Supplier</Select.Option>
            <Select.Option value="vendor">Vendor</Select.Option>
            <Select.Option value="karyawan">Karyawan</Select.Option>
          </Select>
        </Form.Item> */}
        <div>
          <>
            <div
              style={{
                marginBottom: '8px',
                border: 'red',
              }}
            >
              {showAddForm ? (
                <div className="overlay">
                  <div>
                    <Form>
                      <Form.Item>
                        <div>
                          <Input
                            placeholder="Nama Tag"
                            type="text"
                            id="nama_tag"
                            name="nama_tag"
                            value={inputValue}
                            onChange={(e) => handleInputChange(e.target.value)}
                            style={{
                              border: 'white',
                              width: '100%',
                              height: 100,
                            }}
                          />
                        </div>

                        <Button onClick={handleSaveTag}>Simpan</Button>
                        <Button
                          onClick={() => setShowAddForm(false)}
                          className="ms-2"
                        >
                          Batal
                        </Button>
                      </Form.Item>
                    </Form>
                  </div>
                </div>
              ) : null}
            </div>
            <div style={{ marginBottom: 0, border: 'white' }}>
              <TweenOneGroup
                enter={{
                  scale: 0.8,
                  opacity: 0,
                  type: 'from',
                  duration: 100,
                }}
                onEnd={(e) => {
                  if (e.type === 'appear' || e.type === 'enter') {
                    ;(e.target as any).style = 'display: inline-block'
                  }
                }}
                leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                appear={false}
              >
                {selectedTags.map((tag) => (
                  <span key={tag} style={{ display: 'inline-block' }}>
                    <Tag
                      closable
                      onClose={(e) => {
                        e.preventDefault()
                        handleClose(tag)
                      }}
                    >
                      {tag}
                    </Tag>
                  </span>
                ))}
              </TweenOneGroup>
            </div>

            <Select
              mode="tags"
              style={{
                width: '50%',
                marginBottom: 20,
                borderRadius: '0px 0px 0px',
                textAlign: 'left',
              }}
              placeholder="Pilih Tags"
              open={inputVisible}
              onDropdownVisibleChange={(open) => setInputVisible(open)}
              value={selectedTags}
              onChange={(newTags) => {
                if (Array.isArray(newTags)) {
                  setSelectedTags(newTags)
                }
              }}
              onSearch={handleInputChange}
              onBlur={handleSaveTag}
              dropdownRender={(menu) => (
                <div>
                  {menu}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: 8,
                    }}
                  >
                    <Button type="default" onClick={handleAddTagClick}>
                      <PlusOutlined />
                    </Button>
                  </div>
                </div>
              )}
            >
              {tagOptions}
            </Select>
          </>
        </div>

        <Form.Item name="id_harga" label="Group">
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
            onChange={(value) => setHargaTerpilih(value)}
          >
            {hargasData?.map((bebassaja: Harga) => (
              <Select.Option key={bebassaja._id} value={bebassaja._id}>
                {bebassaja.jenis_harga}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="nama"
          label="Nama"
          rules={[
            {
              required: true,
              message: 'Please input the name of the Pelanggan!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="perusahaan"
          label="Perusahaan"
          rules={[
            {
              required: true,
              message: 'Please input the name of the Pelanggan!',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>

      <Form.Item
        name="rt"
        label="Alamat RT"
        rules={[
          {
            required: true,
            message: 'Please input the RT address!',
          },
        ]}
      >
        <TextArea onChange={handleDusunChange} value={isiRt} />
      </Form.Item>

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
      <Form.Item name="email" label="Email" initialValue={email}>
        <Input onChange={handleEmail} />
      </Form.Item>
      <Form.Item name="hp" label="No HP" initialValue={selectedHp}>
        <Input onChange={handleHp} />
      </Form.Item>

      <Form.Item
        name="pengenal"
        label="Jenis Identitas"
        initialValue={pengenal}
      >
        <Select
          onChange={handlePengenal}
          showSearch
          optionFilterProp="children"
        >
          <Select.Option value="KTP">KTP</Select.Option>
          <Select.Option value="SIM">SIM</Select.Option>
          <Select.Option value="Lainnya">Lainnya</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="no_pengenal" label="Nomor ID" initialValue={noPengenal}>
        <Input onChange={handleNoPengenal} />
      </Form.Item>
      <Form.Item name="npwp" label="npwp" initialValue={selectedNpwp}>
        <Input onChange={handleNpwp} />
      </Form.Item>
      <Form.Item
        name="koordinat"
        label="Garis Koordinat"
        initialValue={selectedKoordinat}
      >
        <Input onChange={handleKoordinat} />
      </Form.Item>
      <Form.Item name="tanggal" label="Tanggal">
        <DatePicker value={selectedTanggal} onChange={handleTanggal} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" onClick={saveNewPelanggan}>
          Save
        </Button>
        <Button
          onClick={() => {
            setAdding(false)
            navigate('/Pelanggan')
          }}
        >
          Cancel
        </Button>
      </Form.Item>
    </Card>
  )
}
export default AddPelangganForm
