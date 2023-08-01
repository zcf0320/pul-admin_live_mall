import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Pagination, Select, Space, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { LABELTYPE } from './enum';
import {
  customerAddLabel,
  customerPageList,
  delTags,
  editGroup,
  exportLabels,
  groupsList,
} from './services';
import dayjs from 'dayjs';
import { DataType, FormDataType, FormEditType, GroupDataType } from './data';
import { exportExcelBlob } from '@/pages/utils/export';
import ExportFieldsModel from '@/pages/components/ExportFieldsModel';
import { ExportTypeClassName } from '@/pages/components/ExportFieldsModel/exportType';
import './index.less';

// const { Option } = Select;
const selectionType = 'checkbox';

const labelArr = Object.entries(LABELTYPE).map((item) => ({ key: item[0], value: item[1] }));

const CustomerLabel = () => {
  const [tagNameVal, setTagNameVal] = useState(''); //搜索标签名称
  const [isModalOpen, setIsModalOpen] = useState(false); //批量删除对话框
  const [rowKeys, setRowKeys] = useState<string[] | any>([]); //批量删除ID
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [fromEditData, setFromEditData] = useState<FormEditType>({ id: '' }); //编辑数据
  const [groupData, setGroupData] = useState<GroupDataType[]>([]); //标签组列表
  const [labelList, setLabelList] = useState<FormEditType[]>([]); //标签列表
  const [total, setTotal] = useState();
  const [pageCurrent, setPageCurrent] = useState<number>();
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [labelGroupPid, setLabelGroupPid] = useState<string>(); //选择标签分组
  const [showLoading, setShowoading] = useState(false); // 加载loading
  const [title, setTitle] = useState('');
  const [formId, setFormId] = useState('');
  const [showExportModel, setShowExportModel] = useState(false);
  const [labelForm] = Form.useForm();

  const getCustomerPageList = () => {
    setShowoading(true);
    customerPageList({
      name: tagNameVal,
      pageNo,
      pageSize,
    })
      .then((res) => {
        setLabelList(res.data?.records);
        setTotal(res.data.total);
        setPageCurrent(res.data.current);
      })
      .finally(() => {
        setShowoading(false);
      });
  };
  const domFrom = (row: { type: string; record?: DataType }) => {
    const { type, record } = row;
    if (type === 'edit') {
      labelForm.setFieldsValue(record);
    } else {
      labelForm.resetFields();
    }
  };
  //    编辑
  const onEditCustomerLabel = (record: DataType) => {
    setTitle('编辑标签');
    setFormId(record.id);
    setFromEditData(record);
    domFrom({ type: 'edit', record });
    setOpen(true);
  };

  //   删除
  const onDeleteCustomerLabel = (record: DataType) => {
    delTags({ ids: [record.id] }).then(() => {
      message.success('删除成功');
      getCustomerPageList();
    });
  };
  const columns: ColumnsType<any> = [
    {
      title: '标签名称',
      dataIndex: 'name',
    },
    {
      title: '用户数量',
      dataIndex: 'userCount',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (text: string, record: DataType) => {
        return <div>{record.createTime ? record.createTime : '-'}</div>;
      },
    },
    {
      title: '标签类型',
      dataIndex: 'type',
      render: (text: string) => {
        return (
          <div>
            {labelArr?.find((label: { key: string; value: string }) => label.key === text)?.value}
          </div>
        );
      },
    },
    {
      title: '标签分组',
      dataIndex: 'groupName',
    },
    {
      title: '操作',
      dataIndex: 'Operate',
      fixed: 'right',
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

  const rowSelection = (selectedRowKeys?: React.Key[]) => {
    setRowKeys(selectedRowKeys);
  };

  //   输入框
  const onInpTagName = (e: any) => {
    setTagNameVal(e.target.value);
  };
  const onBlurTagName = (e: any) => {
    setTagNameVal(e.target.value);
    getCustomerPageList();
  };
  const onClickSeach = () => {
    getCustomerPageList();
  };
  const onSearchEnter = () => {
    getCustomerPageList();
  };
  //   分页
  const onPageion = (pageCurrent: number, pageNum: number) => {
    setPageNo(pageCurrent);
    setPageSize(pageNum);
    setPageCurrent(pageCurrent);
  };

  const showModalDelAll = () => {
    if (rowKeys.length === 0) {
      message.error('请至少选择一条标签名称');
    } else {
      setIsModalOpen(true);
    }
  };

  const handleOk = () => {
    delTags({ ids: rowKeys }).then(() => {
      message.success('删除成功');
      getCustomerPageList();
      setRowKeys([]);
      setIsModalOpen(false);
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // 新增
  const showFromModal = () => {
    labelForm.resetFields();
    setTitle('新增标签');
    domFrom({ type: 'add' });
    setFormId('');
    setOpen(true);
  };

  // 确定回调
  const handleFromOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };
  // 关闭弹框
  const handleFromCancel = () => {
    setOpen(false);
  };
  const onFinish = (values: FormDataType) => {
    if (formId) {
      // 编辑
      editGroup({
        name: values.name,
        pid: labelGroupPid,
        id: fromEditData.id,
      }).then((res) => {
        if (res.message === 'SUCCESS') {
          message.success('编辑成功');
          getCustomerPageList();
          setOpen(false);
        }
      });
    } else {
      // 新增;
      customerAddLabel({ id: values.groupName, name: values.name }).then((res) => {
        if (res.message === 'SUCCESS') {
          message.success('新增标签成功');
          getCustomerPageList();
          labelForm.resetFields();
          setOpen(false);
        }
      });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  // 编辑标签分组
  const handleEditChange = (value: string) => {
    setLabelGroupPid(value);
  };
  // 导出列表
  const onExportList = async (excludeColumnFieldNames: string[]) => {
    // if (rowKeys.length === 0) {
    //   message.error('请至少选择一条标签名称');
    // } else {
    exportLabels({ name: tagNameVal, excludeColumnFieldNames }).then((res: any) => {
      exportExcelBlob(`客户标签-${dayjs().format('YYYY-MM-DD HH_mm')}`, res);
    });
    // }
  };
  useEffect(() => {
    groupsList().then((res) => {
      setGroupData(res.data?.map(({ id, name }: GroupDataType) => ({ value: id, label: name })));
    });
    getCustomerPageList();
    // if (tagNameVal === '') {
    //   getCustomerPageList();
    // }
  }, [pageNo, pageCurrent, rowKeys]);
  return (
    <div className="CustomerLabel" style={{ padding: '0 20px' }}>
      <Button style={{ marginTop: '20px' }} onClick={showFromModal} type="primary">
        新增标签
      </Button>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '20px',
        }}
      >
        <div className="CustomerLabel-header">
          <div>
            <Button style={{ margin: '0 20px 0 0' }} onClick={() => setShowExportModel(true)}>
              导出标签
            </Button>
            <Button
              onClick={() => {
                showModalDelAll();
              }}
            >
              批量删除
            </Button>
          </div>
          <div>
            <Space.Compact>
              <div className="CustomerLabel-seach">
                <Input
                  type="text"
                  className="input"
                  onBlur={(e) => onBlurTagName(e)}
                  onChange={(e) => onInpTagName(e)}
                  value={tagNameVal}
                  onPressEnter={() => onSearchEnter()}
                  bordered={false}
                  placeholder="请输入标签名称"
                />
                <SearchOutlined onClick={() => onClickSeach()} />
              </div>
            </Space.Compact>
          </div>
        </div>
      </div>
      <Table
        pagination={false}
        rowSelection={{
          type: selectionType,
          // ...rowSelection,
          onChange: rowSelection,
        }}
        loading={showLoading}
        rowKey="id"
        columns={columns}
        dataSource={labelList}
        scroll={{ x: 1000 }}
      />
      <div className="foot-pagination">
        <div></div>

        <Pagination
          defaultCurrent={pageNo}
          defaultPageSize={pageSize}
          current={Number(pageCurrent)}
          onChange={onPageion}
          showTotal={() => `共 ${total || 0} 条记录`}
          total={total}
          style={{ marginBottom: '20px' }}
          showSizeChanger
        />
      </div>
      <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>确认要批量删除吗？</p>
      </Modal>

      <Modal
        title={title}
        open={open}
        onOk={handleFromOk}
        confirmLoading={confirmLoading}
        onCancel={handleFromCancel}
        footer={null}
        destroyOnClose={true}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true, LabelType: '1' }}
          onFinish={onFinish}
          form={labelForm}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="标签名称"
            name="name"
            rules={[{ required: true, message: '请输入标签名称!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="选择分组"
            name="groupName"
            rules={[{ required: true, message: '请输入分组名称!' }]}
          >
            <Select
              placeholder="请选择标签分组"
              allowClear
              onChange={handleEditChange}
              options={groupData}
            ></Select>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <ExportFieldsModel
        showExportModel={showExportModel}
        setShowExportModel={setShowExportModel}
        fieldType={ExportTypeClassName.UserLabelToExcel}
        setSelectFields={(values) => onExportList(values)}
      />
    </div>
  );
};

export default CustomerLabel;
