import { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap'
import {
  useGetKindsQuery,
  useAddKindMutation,
  useUpdateKindMutation,
  useDeleteKindMutation,
} from '../hooks/kindHooks'
import { ApiError } from '../types/ApiError'
import { getError } from '../utils'
import { Kind } from '../types/Kind'
import { useQueryClient } from '@tanstack/react-query'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import Pagination from '../components/Pagination'
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'

export default function KindPage() {
  const { data: kinds = [], isLoading, error } = useGetKindsQuery()
  const addKindMutation = useAddKindMutation()
  const updateKindMutation = useUpdateKindMutation()
  const deleteKindMutation = useDeleteKindMutation()
  const queryClient = useQueryClient()

  const [searchName, setSearchName] = useState('')
  const [searchPrice, setSearchPrice] = useState('')
  const [showOverlay, setShowOverlay] = useState(false)

  const [newKind, setNewKind] = useState<Kind>({
    _id: '',
    id_kategori: '',
    jenis_kategori: '',
  })

  const [editKind, setEditKind] = useState<Kind | null>(null)
  const [isAddingKind, setIsAddingKind] = useState(true)
  const [deleteSuccess, setDeleteSuccess] = useState(false)

  const handleCancel = () => {
    setShowOverlay(false)
    setNewKind({
      _id: '',
      id_kategori: '',
      jenis_kategori: '',
    })

    setEditKind(null)
    setIsAddingKind(true)
  }

  const [currentPage, setCurrentPage] = useState(1)
  const kindsPerPage = 10

  useEffect(() => {
    if (editKind) {
      setNewKind(editKind)
    }
  }, [editKind])

  useEffect(() => {
    if (deleteKindMutation.isSuccess) {
      setDeleteSuccess(true)

      queryClient.invalidateQueries(['kinds'])
    }
  }, [deleteKindMutation.isSuccess, queryClient])

  if (isLoading) {
    return <LoadingBox />
  }

  if (error) {
    return (
      <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
    )
  }

  const filteredKinds = kinds.filter((kind) => {
    const nameMatch = kind.jenis_kategori
      .toLowerCase()
      .includes(searchName.toLowerCase())
    const priceMatch =
      kind.jenis_kategori &&
      kind.jenis_kategori.toString().includes(searchPrice)
    return nameMatch && priceMatch
  })

  const indexOfLastKind = currentPage * kindsPerPage
  const indexofFirstKind = indexOfLastKind - kindsPerPage
  const currentKinds = filteredKinds.slice(indexofFirstKind, indexOfLastKind)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleTambahBarang = (kind: Kind | null = null) => {
    if (kind) {
      setIsAddingKind(false)
      setEditKind(kind)
    } else {
      setIsAddingKind(true)
      setEditKind(null)

      const lastKind = kinds[kinds.length - 1]
      const lastId = lastKind ? parseInt(lastKind.id_kategori.substr(4)) : 0
      const newId = lastId + 1

      setNewKind((prevKind: Kind) => ({
        ...prevKind,
        id_kategori: `Kat-${newId.toString().padStart(4, '0')}`,
      }))
    }
    setShowOverlay(true)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewKind((prevKind) => ({
      ...prevKind,
      [name]: value,
    }))
  }

  const handleSubmitForm = () => {
    setShowOverlay(false)
    if (isAddingKind) {
      addKindMutation.mutate(newKind)
    } else {
      const updatedKind = {
        ...newKind,
        _id: editKind && editKind._id ? editKind._id : '',
      }
      updateKindMutation.mutate(updatedKind)
    }
    setNewKind({
      _id: '',
      id_kategori: '',
      jenis_kategori: '',
    })
    setEditKind(null)
    setIsAddingKind(true)
  }

  const handleDeleteBarang = (kindId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus Kind ini?')) {
      deleteKindMutation.mutate(kindId)
    }
  }

  return (
    <div>
      <Row>
        <Col md={6} className="mb-2">
          <div className="search-container">
            <input
              type="text"
              placeholder="Cari nama kind..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="search-input"
            />
          </div>
        </Col>
        <Col md={6} className="mb-2">
          <div className="text-md-end">
            <Button variant="primary" onClick={() => handleTambahBarang()}>
              Tambah Kind
            </Button>
          </div>
        </Col>
      </Row>
      <Table className="table">
        <thead>
          <tr className="text-center">
            <th>No</th>
            <th>Id Katogori</th>
            <th>Jenis Kateori</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentKinds.map((kind, index) => (
            <tr key={kind._id}>
              <td className="text-center">{indexofFirstKind + index + 1}</td>
              <td className="text-left">{kind.id_kategori}</td>
              <td className="text-left">{kind.jenis_kategori}</td>
              <td className="text-center">
                <Button
                  variant="primary"
                  onClick={() => handleTambahBarang(kind)}
                >
                  <AiOutlineEdit />
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteBarang(kind._id || '')}
                >
                  <AiOutlineDelete />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {showOverlay && (
        <div className="overlay">
          <div className="overlay-content" style={{ width: '800px' }}>
            <div className="d-flex align-items-center mb-3">
              <h2 className="me-auto">{isAddingKind ? 'Tambah' : 'Edit'}</h2>
              <div className="form-inline">
                <input
                  type="text"
                  id="idKategori"
                  name="id_kategori"
                  value={newKind.id_kategori}
                  onChange={handleFormChange}
                  readOnly
                  style={{
                    border: 'none',
                    borderBottom: '1px',
                    marginBottom: '1px',
                    textAlign: 'right',
                  }}
                />
              </div>
            </div>
            <Form className="add-form">
              <Row className="form-row">
                <Col md={6} className="mb-3 form-column">
                  <label
                    htmlFor="jenisKAtegori"
                    style={{ marginRight: '10px', marginBottom: '25px' }}
                  >
                    Jenis
                  </label>
                  <input
                    type="text"
                    id="jenisKAtegori"
                    name="jenis_kategori"
                    value={newKind.jenis_kategori}
                    onChange={handleFormChange}
                    style={{ border: 'none', borderBottom: '1px solid black' }}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6} className="d-flex justify-content-start">
                  <Button variant="primary" onClick={handleSubmitForm}>
                    {isAddingKind ? 'Tambah' : 'Simpan'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                    className="ms-2"
                  >
                    Batal
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredKinds.length / kindsPerPage)}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
