import React, { useContext, useEffect, useState } from 'react'
import {
  Form,
  Input,
  Card,
  Button,
  Select,
  Table,
  Dropdown,
  Divider,
  Collapse,
  Menu,
  Tag,
} from 'antd'

import UserContext from '../../contexts/UserContext'
import { Outlet } from '../../types/Outlet'
import { useGetoutletsQuery } from '../../hooks/outletHooks'
import {
  AiOutlineArrowLeft,
  AiOutlineDown,
  AiOutlineMore,
  AiOutlinePlus,
  AiOutlinePrinter,
  AiOutlineShareAlt,
} from 'react-icons/ai'

import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { Dayjs } from 'dayjs'

import DateCicil from '../DateCicilan'
import TagPage from '../pos/TagPage'

import TextArea from 'antd/es/input/TextArea'
import PosPrintKomponent from '../printcoba/PosPrintKomponent'
import { useGetCoasQuery } from '../../hooks/coaHooks'
import { useGetTypeKontaksQuery } from '../../hooks/typeKontakHooks'
import { Akuna } from '../../types/AKuna'
import {
  useAddAkunaMutation,
  useGetAkunaDetailQuery,
  useGetAkunasQuery,
} from '../../hooks/akunaHooks'
import { v4 as uuidv4 } from 'uuid'
import DateRange from '../DateRange'
import { useGetPelanggansQuery } from '../../hooks/pelangganHooks'
import { TweenOneGroup } from 'rc-tween-one'
import { PlusOutlined } from '@ant-design/icons'
import { useGetTagsQuery } from '../../hooks/tagHooks'

const Akunai: React.FC = () => {
  const { id_akuna } = useParams<{ id_akuna?: string }>()

  const userContext = useContext(UserContext)

  const { user } = userContext || {}

  let native = ''

  if (user) {
    native = user.id_outlet
  }
  const AmbilData = !!id_akuna
  const { data: getAkunaDetail } = useGetAkunaDetailQuery(id_akuna as string)
  const onChange = (key: string | string[]) => {}
  const text = ''
  const [ket, setKet] = useState('')
  const menu = (
    <Menu key="1">
      <Menu.Item>
        <PosPrintKomponent />
      </Menu.Item>
      <Menu.Item key="2">pdf</Menu.Item>
    </Menu>
  )
  const { Panel } = Collapse
  const generateShortInvoiceId = (): string => {
    if (AmbilData) {
      return id_akuna
    }
    const uuid = uuidv4()
    const last4OfUUID = uuid.substr(uuid.length - 4)
    const shortNumber = parseInt(last4OfUUID, 16) % 10000
    return `AKUN${String(shortNumber).padStart(4, '0')}`
  }

  const [currentIdAkun, setcurrentIdAkun] = useState(generateShortInvoiceId())

  const { data: akunasData } = useGetAkunasQuery()
  const { data: pelanggans } = useGetPelanggansQuery()
  const { data: gorets } = useGetTagsQuery()

  const [adding, setAdding] = useState(false)
  const [dataRows, setDataRows] = useState<Akuna[]>([])

  const { data: outlets } = useGetoutletsQuery()

  const [selectGuess, setSelectGuess] = useState<string | undefined>(undefined)
  const [selectOut, seteSelectOut] = useState<string | undefined>(undefined)
  const [hasError, setHasError] = useState(false)
  const { data: coas } = useGetCoasQuery()
  const { data: tipeKontak } = useGetTypeKontaksQuery()

  const [selectGoods, setSelectGoods] = useState<{
    [key: string]: string | undefined
  }>({})

  const [currentDate, setCurrentDate] = useState<string>('')
  useEffect(() => {
    dayjs.locale('id')

    const today = dayjs()
    const formattedDate = today.format('DD MMMM YYYY')

    setCurrentDate(formattedDate)
  }, [])
  const [dateCicilan, setDateCicilan] = useState<string>('')
  const handleDateCicilan = () => {
    dayjs.locale('id')
    const today = dayjs()
    const formattedDate = today.format('DD MMMM YYYY')

    setDateCicilan(formattedDate)
  }
  const handleAddRow = () => {
    const newRow: Akuna = {
      _id: Date.now().toString(),
      id_akuna: '',
      id_outlet: '',
      kategori: '',
      akun: '',
      jumlah: 0,
      ket: '',
      tag: selectedTags.join(','),

      pesan: '',
      tanggal: dateCicilan || currentDate,
      penerima: '',
    }

    setDataRows([...dataRows, newRow])
  }

  const totalSemua = akunasData?.reduce((acc, akuna) => acc + akuna.jumlah, 0)

  const addAkunaMutation = useAddAkunaMutation()
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedPenerima, setSelectedPenerima] = useState('')
  const [selectedPesan, setSelectedPesan] = useState('')
  const navigate = useNavigate()

  const handleSave = async () => {
    try {
      const newDataRows = [...dataRows]
      for (const row of newDataRows) {
        const newAkuna: Akuna = {
          _id: row._id,
          id_akuna: currentIdAkun,
          id_outlet: native || '',
          kategori: selectedCategory,
          akun: row.akun,
          jumlah: row.jumlah,
          ket: row.ket || '-',
          tag: selectedTags.join(','),

          pesan: selectedPesan || '-',
          tanggal: dateCicilan || currentDate,
          penerima: selectedPenerima,
        }
        await addAkunaMutation.mutateAsync(newAkuna)
      }
      navigate('/akunalist')

      setAdding(false)
    } catch (errInfo) {}
  }

  const handleRemoveRow = (index: number) => {
    const newData = [...dataRows]
    newData.splice(index, 1)
    setDataRows(newData)
  }

  const handleProductNameChange = (index: number, value: string) => {
    const newDataRows = [...dataRows]
    newDataRows[index].akun = value
    setDataRows(newDataRows)
    setSelectGoods((prevSelectGoodsMap) => ({
      ...prevSelectGoodsMap,
      [dataRows[index]._id]: value,
    }))
  }

  const handleInputChange = (index: number, key: string, value: any) => {
    const newDataRows = [...dataRows]
    newDataRows[index][key] = value
    setDataRows(newDataRows)
  }
  const handleInputTag = (value: string) => {
    setInputValue(value)
  }

  const [selectedDates, setSelectedDates] = useState<[string, string]>(['', ''])
  const [selectedDifference, setSelectedDifference] = useState<number>(0)

  const handleDateRangeSave = (
    startDate: string,
    endDate: string,
    difference: number
  ) => {
    setSelectedDates([startDate, endDate])
    setSelectedDifference(difference)
  }
  const [showAddForm, setShowAddForm] = useState(false)

  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [inputVisible, setInputVisible] = useState(false)

  const [tags, setTags] = useState<string[]>([])
  useEffect(() => {
    if (gorets) {
      const namaTag = gorets.map((colek) => colek.nama_tag).flat()
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

  const handleAddTagClick = () => {
    setShowAddForm(true)
  }
  const tagOptions = tags.map((tag) => (
    <Select.Option key={tag} value={tag}>
      {tag}
    </Select.Option>
  ))
  const handleSaveTag = () => {
    if (inputValue) {
      setSelectedTags([...selectedTags, inputValue])
      setInputValue('')

      setShowAddForm(false)
    }
  }

  const columns = [
    {
      title: 'No',
      key: 'index',
      align: 'center' as 'center',
      fixed: true,
      width: '5%',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Akun',
      dataIndex: 'akun',
      key: 'akun',
      render: (text: string, record: Akuna, index: number) => (
        <>
          <Select
            showSearch
            style={{ width: '320px' }}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children?.toString()
                ? option.children
                    .toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                : false
            }
            onChange={(value) => handleProductNameChange(index, value)}
            value={record.akun}
          >
            {coas
              ?.filter((e) => e.kategori === 'Beban')
              .map((e) => (
                <Select.Option key={e._id} value={e.nama_akun}>
                  {e.nama_akun}
                </Select.Option>
              ))}
          </Select>
        </>
      ),
    },
    {
      title: 'Jumlah',
      dataIndex: 'jumlah',
      key: 'jumlah',
      render: (text: any, record: Akuna, index: number) => (
        <Input
          value={text}
          onChange={(e) => handleInputChange(index, 'jumlah', e.target.value)}
          style={{ width: 150 }}
        />
      ),
    },
    {
      title: 'Ket',
      dataIndex: 'ket',
      key: 'ket',
      render: (text: string, record: Akuna, index: number) => (
        <Input
          value={text}
          onChange={(e) => handleInputChange(index, 'ket', e.target.value)}
          style={{ width: 150 }}
        />
      ),
    },

    {
      title: 'Aksi',
      key: 'actions',
      render: (text: string, record: Akuna, index: number) => (
        <Button type="link" onClick={() => handleRemoveRow(index)}>
          Batal
        </Button>
      ),
    },
  ]

  return (
    <div
      style={{
        border: '0 #f0f0f0 solid',

        padding: '30px',
        background: 'white',
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
              <h1 style={{ fontSize: '2.5rem' }}>Biaya</h1>
            </div>
          </div>
          {/* <div>{totalSemua}</div> */}

          <div
            style={{
              flex: '1',
              flexBasis: '40%',
              display: 'flex',
              justifyContent: 'right',
              alignItems: 'center',
            }}
          >
            <Form.Item
              className="ant-select-selector"
              style={{
                textAlign: 'right',
                flexBasis: '80%',
                alignItems: 'center',
                marginBottom: 0,
              }}
              name="id_outlet"
              rules={[
                {
                  required: true,
                  message: 'Please select the Nama Outlet!',
                },
              ]}
            >
              <div className="ant-select-show-searchr">
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
                  style={{ marginRight: '10px', width: '320px' }}
                  onChange={(value) => setSelectGuess(value)}
                  value={selectGuess}
                  defaultValue={user?.id_outlet}
                >
                  {outlets?.map((Itsonyou: Outlet) => (
                    <Select.Option key={Itsonyou._id} value={Itsonyou._id}>
                      {Itsonyou.nama_outlet}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </Form.Item>
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
            <span
              style={{
                display: 'flex',

                background: '#eb9234',
                height: 30,
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                width: '80%',
              }}
            >
              <AiOutlineArrowLeft />
              Kembali
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            borderTop: '1px #f0f0f0 solid',
            borderRight: '1px #f0f0f0 solid',
            borderLeft: '1px #f0f0f0 solid',
            padding: '15px',
          }}
        >
          <div
            style={{
              flex: '1',
              border: '1px solid white',
              flexBasis: '30%',
              display: 'flex',
              justifyContent: 'left',
              alignItems: 'center',
            }}
          ></div>

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
          >
            <div
              style={{
                flex: '1',
                border: '1px solid #e9ecef',
                flexBasis: '2%',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                height: '30px',
              }}
            >
              <Dropdown overlay={menu} placement="bottomRight">
                <a
                  style={{ textDecoration: 'none' }}
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                >
                  <div
                    style={{
                      flex: '1',

                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100px',
                      color: 'black',
                    }}
                  >
                    <AiOutlineShareAlt />
                    <div style={{ marginRight: '5px', marginLeft: '5px' }}>
                      Bagikan
                    </div>

                    <AiOutlineDown />
                  </div>
                </a>
              </Dropdown>
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
          >
            <div
              style={{
                flex: '1',
                border: '1px solid #e9ecef',
                flexBasis: '2%',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                height: '30px',
              }}
            >
              <Dropdown overlay={menu} placement="bottomRight">
                <a
                  style={{ textDecoration: 'none' }}
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                >
                  <div
                    style={{
                      flex: '1',

                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100px',
                      color: 'black',
                    }}
                  >
                    <AiOutlinePrinter />
                    <div style={{ marginRight: '5px', marginLeft: '5px' }}>
                      Print
                    </div>

                    <AiOutlineDown />
                  </div>
                </a>
              </Dropdown>
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
          >
            <div
              style={{
                flex: '1',
                border: '1px solid white',
                flexBasis: '2%',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <Dropdown overlay={menu} placement="bottomRight">
                <AiOutlineMore />
              </Dropdown>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px #f0f0f0 solid',
            borderBottom: '1px #f0f0f0 solid',
            borderLeft: '1px #f0f0f0 solid',
            borderRight: '1px #f0f0f0 solid',
            padding: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
            }}
          >
            <div
              style={{
                flex: '1',
                flexBasis: '40%',
                textAlign: 'left',
              }}
            >
              <div style={{ marginBottom: '8px' }}>Dibayar Dari</div>

              <Select
                showSearch
                style={{ marginRight: '10px', width: '84%' }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option?.children?.toString()
                    ? option.children
                        .toString()
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    : false
                }
                onChange={(value) => setSelectedCategory(value)}
              >
                {coas
                  ?.filter((e) => e.kategori === 'Kas & Bank')
                  .map((e) => (
                    <Select.Option key={e._id} value={e.nama_akun}>
                      {e.nama_akun}
                    </Select.Option>
                  ))}
              </Select>
            </div>

            <div
              style={{
                flex: '1',
                flexBasis: '20%',
                textAlign: 'left',
                marginLeft: '20px',
              }}
            >
              <div style={{ marginBottom: '8px' }}>Nomor</div>
              <Input
                value={currentIdAkun}
                style={{ width: '100%' }}
                disabled={!user?.isAdmin}
              />
            </div>
          </div>
          <br />
          <div
            style={{
              display: 'flex',
            }}
          >
            <div
              style={{
                flex: '1',
                flexBasis: '40%',
                textAlign: 'left',
              }}
            >
              <div style={{ marginBottom: '8px' }}>Penerima</div>
              <Select
                showSearch
                style={{ marginRight: '10px', width: '84%' }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option?.children?.toString()
                    ? option.children
                        .toString()
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    : false
                }
                onChange={(value) => setSelectedPenerima(value)}
              >
                {pelanggans?.map((e) => (
                  <Select.Option key={e._id} value={e.nama}>
                    {e.nama}
                  </Select.Option>
                ))}
              </Select>
            </div>

            <div
              style={{
                flex: '1',
                flexBasis: '20%',
                textAlign: 'left',
                marginLeft: '20px',
              }}
            ></div>
          </div>

          <div
            style={{
              display: 'flex',
            }}
          >
            <div
              style={{
                flex: '1',
                flexBasis: '20%',
                textAlign: 'right',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <br />
                <Form.Item>
                  <DateRange
                    defaultValue={
                      AmbilData && getAkunaDetail && getAkunaDetail.length > 0
                        ? [
                            getAkunaDetail[0]?.tanggal_mulai || '',
                            getAkunaDetail[0]?.tanggal_akhir || '',
                          ]
                        : undefined
                    }
                    difference={
                      AmbilData && getAkunaDetail && getAkunaDetail.length > 0
                        ? getAkunaDetail[0]?.selisih
                        : undefined
                    }
                    onChange={(dates) => {
                      setSelectedDates(dates)
                    }}
                    onDifferenceChange={(diff) => {
                      setSelectedDifference(diff)
                    }}
                    onSave={handleDateRangeSave}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
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
                    <Form
                      style={{
                        backgroundColor: 'white',
                        padding: '16px',
                        boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <h5 style={{ marginBottom: '16px' }}>Tambah Tag Baru</h5>
                      <Form.Item>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Input
                            placeholder="Nama Tag"
                            type="text"
                            id="nama_tag"
                            name="nama_tag"
                            value={inputValue}
                            onChange={(e) => handleInputTag(e.target.value)}
                            style={{
                              flex: 1,
                              maxWidth: '200px',
                              height: '36px',
                              marginRight: '1rem',
                              borderRadius: 0,
                            }}
                          />

                          <Button
                            onClick={handleSaveTag}
                            type="primary"
                            style={{ height: '36px', borderRadius: 0 }}
                          >
                            Simpan
                          </Button>
                          <Button
                            onClick={() => setShowAddForm(false)}
                            className="ms-2"
                            style={{ height: '36px', borderRadius: 0 }}
                          >
                            Batal
                          </Button>
                        </div>
                      </Form.Item>
                    </Form>
                  </div>
                </div>
              ) : null}
            </div>
            Tag
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

          <Table
            dataSource={dataRows}
            columns={columns}
            rowKey={(record) => record._id}
            pagination={false}
            rowClassName={() => 'testos'}
            style={{ width: '100%' }}
          />

          <div style={{ display: 'flex' }}>
            <div
              style={{
                flex: '1',

                border: '1px solid white',
                height: 30,
                textAlign: 'left',
                marginTop: 10,
              }}
            >
              <Button
                size="small"
                onClick={handleAddRow}
                style={{
                  width: 350,
                  height: 30,
                }}
              >
                + Tambah Baris
              </Button>
            </div>
          </div>

          <div style={{ display: 'flex', marginTop: 30 }}>
            <div>
              <Collapse
                onChange={onChange}
                style={{
                  width: '500px',
                  textAlign: 'left',
                  backgroundColor: '#f2f4f8',
                }}
              >
                <Panel header="Pesan" key="1">
                  <TextArea
                    style={{
                      width: '100%',
                      minHeight: '50px',
                      border: '0px solid #cfcdcd',
                      backgroundColor: 'white',
                    }}
                    placeholder="Tambahkan pesan di sini..."
                    onChange={(e) => setSelectedPesan(e.target.value)}
                  />
                </Panel>
              </Collapse>
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div
              style={{
                flex: '1',

                border: '0px solid white',
                height: 40,
                textAlign: 'right',
                marginTop: 0,
              }}
            >
              <Button
                type="primary"
                disabled={hasError}
                onClick={handleSave}
                style={{
                  background: '#0190fe',
                  width: '50%',
                  height: '2rem',
                  color: 'white',
                  borderRadius: '0px 0px 0px',

                  marginTop: '10px',
                  justifyContent: 'right',
                }}
              >
                Simpan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Akunai
