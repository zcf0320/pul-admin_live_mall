import React, {
  Ref,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { Form, Input, InputNumber, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { ColumnProps, TableProps } from 'antd/es/table';
import FormItem from 'antd/es/form/FormItem';
import { normImage, UploadPhotos } from '@/pages/components/UploadPhotos/UploadPhotos';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  price: boolean;
  number?: boolean;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: string;
  record: any;
  handleSave: (record: Item) => void;
  getForm?: (form: FormInstance) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  title,
  price,
  number,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  getForm,
  ...restProps
}) => {
  const form = useContext(EditableContext);
  if (form && getForm) {
    getForm(form);
  }

  useEffect(() => {
    form?.setFieldsValue(record);
  }, [record]);

  const save = async () => {
    try {
      const values = await form?.getFieldsValue();

      // toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  const renderEditable = () => {
    if (price) {
      return (
        <FormItem
          style={{ marginBottom: 0 }}
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
          initialValue={record[dataIndex]}
          name={dataIndex}
          rules={[
            { required: dataIndex === 'price' ? true : false },
            {
              validator(rule, value, callback) {
                if (dataIndex === 'marketPrice') {
                  console.log('record', record, value);
                  if (value < record.salePrice) {
                    callback('划线价不能小于销售价');
                  } else {
                    callback();
                  }
                } else {
                  callback();
                }
              },
            },
          ]}
        >
          <InputNumber onChange={save} prefix={'¥'} />
        </FormItem>
      );
    } else if (number) {
      return (
        <FormItem
          style={{ marginBottom: 0 }}
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
          initialValue={record[dataIndex] ?? 0}
          name={dataIndex}
        >
          <InputNumber onChange={save} />
        </FormItem>
      );
    } else if (dataIndex === 'name') {
      return (
        <FormItem
          style={{ marginBottom: 0 }}
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
          initialValue={record[dataIndex]}
          name={dataIndex}
          rules={[{ required: true, message: '请输入规格名称' }]}
        >
          <Input onChange={save} />
        </FormItem>
      );
    } else if (dataIndex === 'specsPic') {
      console.log('rowData', record);

      return (
        <FormItem
          style={{ marginBottom: 0 }}
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
          initialValue={record[dataIndex]}
          name={dataIndex}
          valuePropName="imageUrl"
          getValueFromEvent={normImage}
          rules={[{ required: true, message: '请上传规格图片' }]}
        >
          <UploadPhotos onChange={save} amount={1}></UploadPhotos>
        </FormItem>
      );
    } else {
      return (
        <FormItem
          style={{ marginBottom: 0 }}
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
          initialValue={record[dataIndex]}
          name={dataIndex}
        >
          <Input onChange={save} />
        </FormItem>
      );
    }
  };

  if (editable) {
    childNode = renderEditable();
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

type ColumnType = (ColumnProps<any> & {
  price?: boolean;
  number?: boolean;
  editable?: boolean;
  dataIndex: string;
})[];

interface IProps extends TableProps<any> {
  columns: ColumnType;
  data: any[];
  changeData: (value: any[]) => void;
}

export interface EditAbleTableInstance {
  validate: any;
}

const EditAbleTable = (props: IProps, ref: Ref<EditAbleTableInstance>) => {
  const { changeData, data } = props;

  console.log('data', data);

  // const form = useContext(EditableContext);

  const [form, setForm] = useState<FormInstance>();

  useImperativeHandle(
    ref,
    () => {
      console.log('form');
      return {
        validate: form && form?.validateFields,
      };
    },
    [form],
  );

  const getForm = (form: FormInstance) => {
    setForm(form);
  };

  const handleSave = useCallback(
    (row: any) => {
      const newData = [...data];
      const index = newData.findIndex((item) => {
        return row.key === item.key;
      });
      newData.splice(index, 1, { ...newData[index], ...row });
      console.log('newData', newData);

      changeData(newData);
    },
    [changeData, data],
  );

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = props.columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        price: col.price,
        number: col.number,
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
        getForm,
      }),
    };
  });

  return (
    <div>
      <Table
        {...props}
        pagination={false}
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        size="small"
        dataSource={data}
        columns={columns as ColumnTypes}
      />
    </div>
  );
};

export default React.forwardRef(EditAbleTable);
