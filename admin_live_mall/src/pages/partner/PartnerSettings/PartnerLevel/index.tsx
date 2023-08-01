import { useRef, useState } from 'react';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Form, Input, InputNumber, message, Modal, Popconfirm, Tooltip } from 'antd';
import { TableListItem } from './data';
import { addPartnerLevel, DisableLevel, editLevel, getLevelList } from './services';
import './index.less';

const tooltipText = '等级1 ~ 等级5，依次为从低到高，合伙人满足升级条件后，从低到高一次升一个等级';
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 12 },
  },
};
// type LayoutType = Parameters<typeof Form>[0]['layout'];

const PartnerLevel = () => {
  const [form] = Form.useForm();
  const tableRef = useRef<ActionType>();
  const [modalText, setModalText] = useState<string>('');
  const [rowData, setRowData] = useState<TableListItem>({
    id: '',
    name: '',
    level: -1,
    customerTotal: '',
    status: false,
    directCommissionRate: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false); //对话框开关

  //   确认禁用
  const confirm = () => {
    // message.info('Clicked on Yes.');
    DisableLevel({ id: rowData?.id })
      .then(() => {
        message.success(rowData?.status ? '禁用成功' : '启用成功');
        tableRef.current?.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //   禁用操作
  const onChangeDisable = (row: TableListItem) => {
    setRowData(row);
    // setModalTextType();
  };
  // 编辑按钮
  const onChangeEditModal = (record: TableListItem) => {
    setModalText('编辑等级');
    setRowData(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  //确认对话框
  const handleOk = async () => {
    try {
      await form.validateFields();
      const params = {
        ...form.getFieldsValue(),
        id: rowData?.id,
      };
      if (rowData?.id) {
        await editLevel(params);
      } else {
        delete params.id;
        await addPartnerLevel(params);
      }
      message.success(rowData?.id ? '编辑成功' : '新增成功');
      setIsModalOpen(false);
      tableRef.current?.reload();
    } catch (e) {
      console.error(e);
    }
  };
  //取消对话框
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      dataIndex: 'level',
      key: 'level',
      align: 'center',
      width: 300,
      render: (text, record, index) => <span>等级{record.level}</span>,
    },
    {
      title: '等级名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      order: 100,
    },
    {
      title: '当前人数',
      dataIndex: 'customerTotal',
      key: 'customerTotal',
      align: 'center',
      search: false,
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      search: false,
      render: (_, record): any => {
        return (
          <div className="table-status">
            {record.status ? (
              <span className="enable-status"></span>
            ) : (
              <span className="disable-status"></span>
            )}
            <div>{record.status ? '已启用' : '已禁用'}</div>
          </div>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      align: 'center',
      width: 300,
      search: false,
      render: (_, record) => {
        return (
          <div className="table-action">
            <span style={{ cursor: 'pointer' }} onClick={() => onChangeEditModal(record)}>
              编辑
            </span>
            {record?.level !== 1 ? (
              <Popconfirm
                placement="top"
                title={`确认${record?.status ? '禁' : '启'}用吗？`}
                onConfirm={confirm}
                okText={record?.status ? '禁用' : '启用'}
                cancelText="取消"
                className="popover"
              >
                <span
                  style={{ cursor: 'pointer' }}
                  className="border-lig"
                  onClick={() => onChangeDisable(record)}
                >
                  {record?.status ? '禁用' : '启用'}
                </span>
              </Popconfirm>
            ) : null}
          </div>
        );
      },
    },
  ];

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <div className="partnerManagement">
        <ProTable<TableListItem>
          style={{ margin: '20px 0 0 0' }}
          columns={columns}
          actionRef={tableRef}
          request={async (params) => {
            const res = await getLevelList({
              page: params.current || 1,
              pageSize: params.pageSize || 20,
            });
            return {
              data: res.data?.records,
              success: true,
              total: res.data.total,
            };
          }}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
          }}
          search={false}
          options={false}
          scroll={{ x: 1000 }}
          toolBarRender={() => [
            <Button
              key="addBtn"
              type="primary"
              onClick={() => {
                onChangeEditModal({
                  customerTotal: '',
                  directCommissionRate: '',
                  id: '',
                  level: 0,
                  name: '',
                  status: false,
                });
                setModalText('新建等级');
              }}
            >
              新建等级
            </Button>,
            <Tooltip
              overlayInnerStyle={{ color: '#000' }}
              color="#fff"
              key="tooltip"
              placement="top"
              title={tooltipText}
            >
              <Button key="title" type="link">
                合伙人等级说明
              </Button>
            </Tooltip>,
          ]}
        />
      </div>
      <Modal title={modalText} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} {...formItemLayout} initialValues={{ directCommissionRate: 12 }}>
          <Form.Item
            label="等级名称"
            name="name"
            rules={[
              { required: true, message: '请输入等级名称' },
              { min: 3, message: '等级名称至少3个字' },
            ]}
          >
            <Input placeholder="请输入等级名称" showCount maxLength={12} />
          </Form.Item>
          <Form.Item
            label="佣金比例"
            name="directCommissionRate"
            rules={[{ required: true, message: '请输入佣金比例' }]}
          >
            <InputNumber
              style={{
                width: '100%',
              }}
              min={0}
              max={100}
              placeholder="请输入佣金比例"
              addonAfter="%"
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default PartnerLevel;
