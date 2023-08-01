import { useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { addGroup, delGroup, delTags, editGroup, labelGroupsList } from './services';
import { DataType, GroupDataType, GroupListType } from './data';
import { CloseOutlined } from '@ant-design/icons';
import './index.less';

const CustomerLabelGrouping = () => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [groupList, setGroupList] = useState<GroupDataType[]>([]);
  const [tagsEditId, setTagsEditId] = useState<string>('');
  const [showLoading, setShowoading] = useState(false); // 加载loading
  const [total, setTotal] = useState<number>(0); //数据总数
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [title, setTitle] = useState<string>('');
  const [form] = Form.useForm();

  const domFrom = (row: { type: string; record?: DataType }) => {
    const { type, record } = row;
    if (type === 'edit') {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  };
  // 新增
  const showFromModal = () => {
    form.resetFields();
    domFrom({ type: 'add' });
    setTitle('新增标签组');
    setOpen(true);
  };

  // 获取数据
  const getLabelGroupsList = () => {
    setShowoading(true);
    labelGroupsList({
      pageNo,
      pageSize,
    })
      .then((res) => {
        setTotal(res.data.total);
        setGroupList(res.data.records);
      })
      .finally(() => {
        setShowoading(false);
      });
  };
  // 表单确认
  const handleFromOk = () => {
    if (title === '编辑标签组') {
      editGroup({
        id: tagsEditId,
        name: form.getFieldsValue().groupName,
      }).then((res) => {
        if (res.message === 'SUCCESS') {
          message.success('编辑成功');
          getLabelGroupsList();
          setOpen(false);
        }
      });
    } else if (title === '新增标签组') {
      if (form.getFieldsValue().groupName === undefined) {
        message.error('请输入标签组名称');
      } else {
        addGroup({ name: form.getFieldsValue().groupName }).then((res) => {
          if (res.message === 'SUCCESS') {
            message.success('新增成功');
            getLabelGroupsList();
            setConfirmLoading(true);
            setOpen(false);
            // setTimeout(() => {
            // setOpenEdit(false);
            setConfirmLoading(false);
            // }, 2000);
          }
        });
      }
    }
  };
  const handleFromCancel = () => {
    setOpen(false);
  };
  const onFinish = () => {
    setOpen(false);
    handleFromOk();
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  // 删除数据
  const delDroupTagList = (id: string) => {
    delTags({ ids: [id] }).then((res) => {
      if (res.message === 'SUCCESS') {
        message.success('删除成功');
        getLabelGroupsList();
      }
    });
  };
  // 编辑
  const onEditCustomerLabel = (record: DataType) => {
    setTitle('编辑标签组');
    setTagsEditId(record.id);
    domFrom({ type: 'edit', record });
    setOpen(true);
  };
  // 删除
  const onDeleteCustomerLabel = (record: DataType) => {
    delGroup({ ids: [record.id] }).then((res) => {
      if (res.message === 'SUCCESS') {
        message.success('删除成功');
        getLabelGroupsList();
      }
    });
  };
  const columns: ColumnsType<any> = [
    {
      title: '标签组名称',
      dataIndex: 'groupName',
      width: 200,
    },
    {
      title: '标签',
      dataIndex: 'name',
      render: (text, record) => {
        return (
          <div>
            {groupList.length &&
              groupList.map((v: any) => {
                let data: any;
                if (record.id === v.id) {
                  data = v.labelList.map((val: GroupListType, ind: number) => {
                    return (
                      <div key={ind} className="labelGrouping-text">
                        {val.name}
                        <span
                          style={{ display: 'inline-block', marginLeft: '4px' }}
                          onClick={() => {
                            delDroupTagList(val.id);
                          }}
                        >
                          <CloseOutlined className="close-icon" />
                        </span>
                      </div>
                    );
                  });
                }
                return data;
              })}
          </div>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'Operate',
      fixed: 'right',
      width: 100,
      render: (text, record) => (
        <div>
          <div className="table-operate">
            <span onClick={() => onEditCustomerLabel(record)}>编辑</span>
            <span onClick={() => onDeleteCustomerLabel(record)}>删除</span>
          </div>
        </div>
      ),
    },
  ];

  // 分页
  const handClickPageion = (pageNo: number, pageSize: number) => {
    setPageNo(pageNo);
    setPageSize(pageSize);
  };

  useEffect(() => {
    getLabelGroupsList();
  }, [pageNo, pageSize]);

  return (
    <div className="CustomerLabelGrouping" style={{ padding: '0 20px' }}>
      <Button style={{ margin: '20px 0' }} onClick={showFromModal} type="primary">
        添加标签组
      </Button>
      <Modal
        title={title}
        open={open}
        onOk={handleFromOk}
        confirmLoading={confirmLoading}
        onCancel={handleFromCancel}
        destroyOnClose={true}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true, LabelType: '1' }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="标签组名称"
            name="groupName"
            rules={[{ required: true, message: '请输入标签组名称!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Table
        pagination={{
          defaultCurrent: pageNo,
          defaultPageSize: pageSize,
          onChange: handClickPageion,
          total,
          showTotal: () => `共 ${total || 0} 条记录`,
          showSizeChanger: true,
        }}
        rowKey={(record: { id: string }) => record.id}
        columns={columns}
        dataSource={groupList}
        loading={showLoading}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default CustomerLabelGrouping;
