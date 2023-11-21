import React, { useEffect, useRef, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { TweenOneGroup } from 'rc-tween-one'
import type { InputRef } from 'antd'
import { Input, Tag, Select, Button, Form, Row, Col, theme } from 'antd'
import { useAddTagMutation, useGetTagsQuery } from '../../hooks/tagHooks'

export type TagTypo = {
  _id: string
  nama_tag: string
  disabled: boolean | undefined
  value: string | undefined
}
interface TagPageProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const TagPage: React.FC<TagPageProps> = ({ value, onChange }) => {
  const { token } = theme.useToken()
  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<InputRef>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [showAddForm, setShowAddForm] = useState(false)

  const addTagMutation = useAddTagMutation()
  const [isEditing, setIsEditing] = useState(false)
  const handleEditClick = () => {
    setIsEditing(true)
  }

  const { data: gorets } = useGetTagsQuery()

  useEffect(() => {
    if (gorets) {
      const namaTag = gorets.map((colek) => colek.nama_tag)
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
                      onChange={(e) => handleInputChange(e.target.value)}
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
        onChange={setSelectedTags}
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
  )
}

export default TagPage
