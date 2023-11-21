import React, { useContext, useEffect, useRef, useState } from 'react'
import { Form, Input, InputRef } from 'antd'
import { Satuan } from '../types/Satuan'
import type { FormInstance } from 'antd/es/form'

export const EditableContext = React.createContext<FormInstance<any> | null>(
  null
)

interface EditableRowProps {
  index: number
}

export const EditableRow: React.FC<EditableRowProps> = ({
  index,
  ...props
}) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} key={index} />
      </EditableContext.Provider>
    </Form>
  )
}

interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  children: React.ReactNode
  dataIndex: keyof Satuan
  record: Satuan
  handleSave: (record: Satuan) => void
  handleEdit: () => void
}

export const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  handleEdit,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<InputRef>(null)
  const form = useContext(EditableContext)!
  const [tempData, setTempData] = useState<Satuan>({ ...record })

  useEffect(() => {
    if (editing) {
      form.setFieldsValue({ [dataIndex]: tempData[dataIndex] })
      inputRef.current?.focus()
    }
  }, [editing, tempData])

  const toggleEdit = () => {
    if (!editing) {
      setTempData({ ...record })
    }
    setEditing(!editing)
    if (!editing) {
      handleEdit()
    }
  }

  const save = async () => {
    try {
      const values = await form.validateFields()
      toggleEdit()
      const updatedRow: Satuan = { ...tempData, ...values }
      handleSave(updatedRow)
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {editing ? '' : children}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}
