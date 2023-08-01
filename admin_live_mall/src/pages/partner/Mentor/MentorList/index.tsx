import { useRef, useState } from 'react';
import { history } from '@umijs/max';
import type { MenuProps } from 'antd';
import { Avatar, Button, Dropdown, Form, Input, message, Modal } from 'antd';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { normImage, UploadEquityPhotos } from './components/UploadMentor/UploadMentor';
import { TableListItem } from './data';
import {
  addMentor,
  delMentor,
  editMentorRemarkName,
  getMentorList,
  getSubList,
  setAllowance,
} from './services';
import { checkIcon } from '@/pages/partner/PartnerManagement/PartnerList';
import './index.less';

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
const imgSize = 50000;
const MentorList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [mentorEditData, setMentorEditData] = useState<TableListItem>({
    key: -1,
    id: '',
    allowanceRatio: '',
    createId: -1,
    createTime: '',
    customerNum: -1,
    image: '',
    isDefault: false,
    modifyId: '',
    modifyTime: '',
    name: '',
    phone: '',
    remarkName: '',
    settledCommission: '',
    teamNum: -1,
    toBeSettledCommission: -1 || '',
  });
  const [fileUrl, setFileUrl] = useState<string>('');
  const [isModalTabelOpen, setIsModalTableOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const actionRef = useRef<ActionType>();
  const actionRefChildren = useRef<ActionType>();
  const [form] = Form.useForm();
  // 修改备注名
  const EditNoteName = () => {
    setModalTitle('修改备注名');
    setIsModalOpen(true);
  };

  // 删除客户经理
  const onClickDelData = async () => {
    const res = await delMentor({ id: mentorEditData?.id });
    if (res.message === 'SUCCESS') {
      actionRef.current?.reload();
    }
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Button type="link" onClick={EditNoteName}>
          修改备注名
        </Button>
      ),
    },
    !mentorEditData?.isDefault
      ? {
          key: '2',
          label: (
            <Button type="link" onClick={onClickDelData}>
              删除
            </Button>
          ),
        }
      : null,
  ];
  // 设置
  const onClickSetUp = (row: TableListItem) => {
    setModalTitle('设置');
    setMentorEditData(row);
    form.setFieldsValue(row);
    setIsModalOpen(true);
  };
  // 新建客户经理
  const addFormMentor = () => {
    setModalTitle('新建客户经理');
    setFileUrl('');
    form.resetFields();
    setIsModalOpen(true);
  };
  // 获取上传的图片文件地址
  const setImageUrl = (fileList: any[]) => {
    if (fileList.length === 0) {
      setFileUrl('');
    }
    const url = normImage(fileList);
    if (url) {
      setFileUrl(url);
    }
  };
  // 打开团队数量表格
  const showModalTable = (row: TableListItem) => {
    setUserId(row.id);
    actionRefChildren.current?.reload();
    setIsModalTableOpen(true);
  };

  const handleTableOk = () => {
    setIsModalTableOpen(false);
  };

  const handleTableCancel = () => {
    setIsModalTableOpen(false);
  };
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '客户经理信息',
      dataIndex: 'name',
      width: 200,
      fixed: 'left',
      align: 'center',
      render: (text, record) => {
        const {
          image = '',
          id = '',
          name = '',
          phone = '',
          remarkName = '',
          isDefault = false,
        } = record || {};
        return (
          <div className="userInfo">
            <div className="avatar">
              <Avatar
                size={48}
                icon={<UserOutlined />}
                src={image}
                className={isDefault ? 'defaultAvatarImg' : 'avatarImg'}
              />
              {isDefault ? <span className="userTag">系统</span> : null}
            </div>
            <div className="flexColumn">
              <span>昵称：{remarkName ?? name}</span>
              <span>ID：{id || '-'}</span>
              <span>手机号：{phone || '-'}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: '加入时间',
      dataIndex: 'modifyTime',
      order: 100,
      width: 160,
      align: 'center',
      // valueType: 'dateRange',
      valueType: 'dateTimeRange',
      // valueType: 'dateTime',
      search: {
        transform: (value: any) => ({
          startTime: value[0],
          endTime: value[1],
        }),
      },
      render: (_, record: any) => {
        return <div>{record?.modifyTime}</div>;
      },
    },
    {
      title: '团队数量',
      dataIndex: 'teamNum',
      search: false,
      width: 100,
      align: 'center',
      render: (text, record) => {
        return (
          <div className="clickStyle" onClick={() => showModalTable(record)}>
            {record?.teamNum}
            <img src={checkIcon} className="solutionOutlined" />
          </div>
        );
      },
    },
    {
      title: '学员数量',
      dataIndex: 'one',
      search: false,
      width: 100,
      align: 'center',
      render: (text, record) => (
        <span>{Number(record?.customerNum) + Number(record?.teamNum) || 0}</span>
      ),
    },
    {
      title: '培训津贴',
      dataIndex: 'allowanceRatio',
      align: 'center',
      width: 100,
      search: false,
      render: (text) => <span>{text || 0}%</span>,
    },
    {
      title: '客户经理收益',
      align: 'center',
      width: 100,
      search: false,
      render: (text, record) => {
        const { settledCommission = '', toBeSettledCommission = '' } = record;
        return (
          <div
            onClick={() => history.push('/partner/Mentor/MentorDetail', { parentId: record.id })}
            className="clickStyle"
          >
            <span style={{ color: '#2e74ff' }}>
              ¥{(Number(settledCommission) + Number(toBeSettledCommission)).toFixed(2) || 0}
            </span>
            <img src={checkIcon} className="solutionOutlined" />
          </div>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      align: 'center',
      width: 150,
      search: false,
      render: (_, record) => {
        return (
          <div className="table-action">
            <span className="border-rig" onClick={() => onClickSetUp(record)}>
              设置
            </span>
            <Dropdown
              menu={{ items }}
              trigger={['click']}
              placement="bottom"
              arrow={{ pointAtCenter: true }}
              overlayStyle={{ width: 150 }}
            >
              <span onClick={() => setMentorEditData(record)}>更多</span>
            </Dropdown>
          </div>
        );
      },
    },
  ];
  const columns1: ProColumns<TableListItem>[] = [
    {
      title: '团长名称',
      dataIndex: 'name',
      align: 'center',
      width: 300,
      search: false,
      render: (text, record) => {
        const {
          image = '',
          id = '',
          name = '',
          phone = '',
          remarkName = '',
          isDefault = false,
        } = record || {};
        return (
          <div className="userInfo">
            <div className="avatar">
              <Avatar
                size={48}
                icon={<UserOutlined />}
                src={image}
                className={isDefault ? 'defaultAvatarImg' : 'avatarImg'}
              />
              {isDefault ? <span className="userTag">系统</span> : null}
            </div>
            <div className="flexColumn">
              <span>昵称：{remarkName ?? name}</span>
              <span>ID：{id || '-'}</span>
              <span>手机号：{phone || '-'}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: '团队人数',
      dataIndex: 'customerNum',
      align: 'center',
      search: false,
    },
    {
      title: '关联时间',
      dataIndex: 'createTime',
      align: 'center',
      search: false,
    },
  ];
  // 对话框确认
  // const handleOk = () => {

  // };
  // 表单提交
  const onFinish = async (values: any) => {
    const params = {
      ...form.getFieldsValue(),
    };
    if (modalTitle === '设置') {
      await setAllowance({ id: mentorEditData?.id, ...params });
      actionRef.current?.reload();
      setIsModalOpen(false);
    } else if (modalTitle === '修改备注名') {
      await editMentorRemarkName({ id: mentorEditData?.id, ...params });
      actionRef.current?.reload();
      setIsModalOpen(false);
    } else if (modalTitle === '新建客户经理') {
      if (
        Number(form.getFieldsValue().allowanceRatio) < 0 ||
        Number(form.getFieldsValue().allowanceRatio) > 100
      ) {
        message.error('培训津贴比例范围在0%-100%之间,请重新输入');
      } else {
        addMentor({ ...values, image: fileUrl })
          .then((res) => {
            console.log(res);
            message.success('新增成功');
            actionRef.current?.reload();
            setIsModalOpen(false);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };
  // 对话框取消
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <ProTable<TableListItem>
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const mentorData = await getMentorList({
            pageNo: params.current || 1,
            pageSize: params.pageSize || 20,
            mentorInfo: params?.name,
            startTime: params?.startTime,
            endTime: params?.endTime,
          });
          return Promise.resolve({
            data: mentorData.data?.records,
            success: true,
            total: mentorData.data?.total,
          });
        }}
        scroll={{ x: 1500 }}
        // form={{
        //   // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        //   syncToUrl: (values, type) => {
        //     if (type === 'get') {
        //       return {
        //         ...values,
        //         created_at: [values.startTime, values.endTime],
        //       };
        //     }
        //     return values;
        //   },
        // }}
        rowKey="id"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              actionRef.current?.reload();
              addFormMentor();
            }}
            type="primary"
          >
            新建
          </Button>,
        ]}
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          showSizeChanger: true,
        }}
      />
      <Modal
        title={modalTitle}
        open={isModalOpen}
        // onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={onFinish}
          {...formItemLayout}
          initialValues={{ directCommissionRate: 0 }}
        >
          {modalTitle === '设置' ? (
            <>
              <Form.Item
                label="培训津贴"
                name="allowanceRatio"
                extra="客户经理培训收益 = 关联合伙人团队的所有订单，按照 直推佣金 * 培训津贴比例奖励给客户经理"
              >
                <Input
                  style={{
                    width: '100%',
                  }}
                  addonAfter="%"
                />
              </Form.Item>
            </>
          ) : null}
          {modalTitle === '修改备注名' ? (
            <>
              <Form.Item label="昵称/手机号">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ marginRight: 10 }}>
                    <span>{mentorEditData?.name}</span>
                    <span>（{mentorEditData?.phone}）</span>
                  </div>
                </div>
              </Form.Item>
              <Form.Item label="备注名" name="remarkName" extra="设置后优先展示备注名，仅后台可见">
                <Input maxLength={16} showCount />
              </Form.Item>
            </>
          ) : null}
          {modalTitle === '新建客户经理' ? (
            <>
              <Form.Item
                label="头像"
                name="image"
                rules={[{ required: true, message: '请上传头像！' }]}
              >
                <UploadEquityPhotos amount={1} onChange={setImageUrl} imgSize={imgSize} />
              </Form.Item>
              <Form.Item
                label="名称"
                name="name"
                rules={[{ required: true, message: '请填写客户经理名称！' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="手机号"
                name="phone"
                rules={[{ required: true, message: '请填写手机号！' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="培训津贴比例"
                name="allowanceRatio"
                rules={[{ required: true, message: '请填写培训津贴比例！' }]}
                extra="比例范围在0%-100%之间"
              >
                <Input addonAfter="%" />
              </Form.Item>
              <Form.Item label="备注名称" name="remarkName">
                <Input maxLength={16} showCount />
              </Form.Item>
            </>
          ) : null}
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button style={{ margin: '0 20px 0 0' }} onClick={() => handleCancel()}>
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              确认
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* 团队数量 */}
      <Modal
        title="服务团队"
        open={isModalTabelOpen}
        onOk={handleTableOk}
        onCancel={handleTableCancel}
        width={800}
      >
        <ProTable<TableListItem>
          columns={columns1}
          actionRef={actionRefChildren}
          scroll={{ y: 500 }}
          search={false}
          options={false}
          request={async (params) => {
            // 表单搜索项会从 params 传入，传递给后端接口。
            const mentorData = await getSubList({
              id: userId,
              pageNo: params.current || 1,
              pageSize: params.pageSize || 20,
            });
            return Promise.resolve({
              data: mentorData.data?.records,
              success: true,
              total: mentorData.data?.total,
            });
          }}
          // form={{
          //   // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          //   syncToUrl: (values, type) => {
          //     if (type === 'get') {
          //       return {
          //         ...values,
          //         created_at: [values.startTime, values.endTime],
          //       };
          //     }
          //     return values;
          //   },
          // }}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
          }}
        />
      </Modal>
    </PageContainer>
  );
};

export default MentorList;
