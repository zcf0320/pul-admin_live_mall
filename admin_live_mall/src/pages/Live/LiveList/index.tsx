import { Button, DatePicker, Form, message, Modal } from 'antd';
import { useRef, useState } from 'react';

import { TableRequest } from '@/pages/utils/tableRequest';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormText,
  ProTable,
  TableDropdown,
} from '@ant-design/pro-components';
import type { TableListItem } from './data';
import { edit, getPage, remove } from './service';
import { CopyTwoTone } from '@ant-design/icons';
import { copyToClipboard } from '@/pages/utils';
import { normImage, UploadPhotos } from '@/pages/components/UploadPhotos/UploadPhotos';
import dayjs from 'dayjs';
import { history } from '@umijs/max';
import { generateWxQrCode } from '@/api';
import { downloadImage } from '@/pages/utils/export';

export default function LiveList() {
  const ref = useRef<ActionType>();

  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<TableListItem>();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editValue, setEditValue] = useState<TableListItem>();

  const [qrCode, setQrCode] = useState('');
  const [generateLoading, setGenerateLoading] = useState(false);

  const reloadTable = () => {
    ref.current?.reload();
  };

  const downloadQrCode = () => {
    downloadImage('直播二维码', qrCode);
  };

  //删除
  const deleteLabel = (record: TableListItem) => (
    <a
      onClick={() => {
        const deleteModal = Modal.confirm({
          title: `确定要删除直播间：${record.name}吗?`,
          onOk: () => {
            remove({ id: record.id }).then(() => {
              message.success('删除成功');
              deleteModal.destroy();
              reloadTable();
            });
          },
        });
      }}
    >
      删除
    </a>
  );

  const renderAddress = (record: TableListItem) => {
    return (
      <a
        onClick={() => {
          setCurrentItem(record);
          if (record.type === 'MOBILE') {
            setGenerateLoading(true);
            message.loading('图片生成中');
            generateWxQrCode({
              scene: 'liveRoomId=' + record.id,
              page: 'pages/subPackage/LivePushConfirm/index',
              envVersion: 'release',
            })
              .then((result) => {
                setQrCode(result.data);
              })
              .finally(() => {
                setGenerateLoading(false);
                message.destroy();
              });
          }
          setAddressModalOpen(true);
        }}
      >
        {record.type === 'DEVICE' ? '推流地址' : '开播码'}
      </a>
    );
  };

  const renderEdit = (record: TableListItem) => {
    return (
      <a
        onClick={() => {
          console.log('record', record);
          setEditModalOpen(true);
          setEditValue(record);
        }}
      >
        编辑
      </a>
    );
  };

  const renderProductShowcase = (record: TableListItem) => {
    return (
      <a
        onClick={() => {
          console.log('record', record);
          history.push('/Live/ProductShowcase?id=' + record.id);
        }}
      >
        商品橱窗
      </a>
    );
  };
  const renderMarketing = (record: TableListItem) => {
    return (
      <a
        onClick={() => {
          console.log('record', record);
          history.push('/Live/InteractMarketing?id=' + record.id);
        }}
      >
        互动营销
      </a>
    );
  };
  const renderDataAnalysis = (record: TableListItem) => {
    return (
      <a
        onClick={() => {
          console.log('record', record);
          history.push('/Live/DataAnalysis?id=' + record.id);
        }}
      >
        数据分析
      </a>
    );
  };
  // const renderMarketing = (record: TableListItem) => {
  //   return (
  //     <a
  //       onClick={() => {
  //         console.log('record', record);
  //       }}
  //     >
  //       互动营销
  //     </a>
  //   );
  // };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '直播间名称',
      dataIndex: 'name',
      width: 90,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '直播间类型',
      dataIndex: 'type',
      width: 90,
      ellipsis: true,
      align: 'center',
      search: false,
      valueEnum: {
        DEVICE: '第三方设备直播',
        MOBILE: '小程序直播',
      },
    },
    {
      title: '直播间封面',
      dataIndex: 'cover',
      width: 90,
      search: false,
      ellipsis: true,
      align: 'center',
      valueType: 'image',
    },
    {
      title: '直播间状态',
      dataIndex: 'liveStatus',
      width: 90,
      search: false,
      ellipsis: true,
      align: 'center',
      valueEnum: {
        待开播: {
          text: '待开播',
          status: 'Default',
        },
        直播中: {
          status: 'Success',
          text: '直播中',
        },
        已结束: {
          status: 'Error',
          text: '已结束',
        },
      },
    },
    {
      title: '开播时间',
      dataIndex: 'startTime',
      width: 120,
      search: false,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '开播时间',
      dataIndex: 'startTime',
      hideInTable: true,
      valueType: 'dateTimeRange',
      search: {
        transform: (value) => ({
          startTime: value[0],
          endTime: value[1],
        }),
      },
    },
    {
      title: '操作',
      width: 130,
      fixed: 'right',
      align: 'center',
      valueType: 'option',
      render: (_, record: TableListItem) => [
        renderAddress(record),
        renderMarketing(record),
        renderProductShowcase(record),
        // renderEdit(record),
        <TableDropdown
          menus={[
            // {
            //   key: 'renderDataAnalysis',
            //   name: renderDataAnalysis(record),
            // },
            {
              key: 'renderEdit(record),',
              name: renderEdit(record),
            },
            {
              key: 'deleteLabel',
              name: deleteLabel(record),
            },
          ]}
          key={'dropdown'}
        />,
      ],
    },
  ];
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <ProTable<TableListItem>
        columns={columns}
        actionRef={ref}
        scroll={{ x: 1000 }}
        search={{
          labelWidth: 'auto',
          span: 6,
        }}
        request={(params) => TableRequest(params, getPage)}
      />
      <Modal
        footer={null}
        open={addressModalOpen}
        onCancel={() => {
          setAddressModalOpen(false);
        }}
      >
        {currentItem?.type === 'MOBILE' ? (
          <>
            <div style={{ fontSize: 14, color: '#999', textAlign: 'center', marginTop: 20 }}>
              请将此开播码发给主播，主播即可扫码开播
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 20,
              }}
            >
              <div
                style={{
                  width: 200,
                  height: 200,
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {generateLoading ? null : (
                  <img style={{ width: 120, height: 120 }} src={qrCode} alt="" />
                )}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button onClick={downloadQrCode} type="link">
                下载
              </Button>
            </div>
          </>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 20,
            }}
          >
            <div
              style={{
                border: '1px solid #e3e3e3',
                // width: 300,
                // height: 120,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                padding: 20,
              }}
            >
              <div>推流地址：</div>
              <div style={{ marginTop: 10 }}>
                {currentItem?.pushStream}
                <CopyTwoTone
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    copyToClipboard(currentItem?.pushStream ?? '').then(() => {
                      message.success('复制成功');
                    });
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
      <ModalForm
        modalProps={{ destroyOnClose: true }}
        onOpenChange={setEditModalOpen}
        initialValues={{
          ...editValue,
          time: [dayjs(editValue?.startTime), dayjs(editValue?.endTime)],
        }}
        open={editModalOpen}
        onFinish={async (values) => {
          if (dayjs(values.time[0]).unix() >= dayjs(values.time[1]).unix()) {
            message.error('开始时间不能大于或等于结束时间');
            return false;
          }
          await edit({
            ...values,
            id: editValue?.id,
            startTime: dayjs(values.time[0]).format('YYYY-MM-DD HH:mm:ss'),
            endTime: dayjs(values.time[1]).format('YYYY-MM-DD HH:mm:ss'),
          }).then(() => {
            message.success('编辑成功');
            reloadTable();
          });
          return true;
        }}
        title="编辑直播间"
      >
        <ProFormText
          rules={[{ required: true, message: '请输入直播间标题' }]}
          label="直播间名称"
          name="name"
        ></ProFormText>
        <Form.Item rules={[{ required: true, message: '请上传直播间封面' }]} label="直播间封面">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Form.Item
              style={{ marginBottom: 0 }}
              valuePropName="imageUrl"
              getValueFromEvent={normImage}
              name={'cover'}
              rules={[{ required: true, message: '请上传直播间封面' }]}
            >
              <UploadPhotos amount={1}></UploadPhotos>
            </Form.Item>
            <span style={{ fontSize: 12, color: '#999', marginLeft: 20 }}>
              上传直播间封面，格式：png、jpg
              <br />
              最大1mb,尺寸400*400
            </span>
          </div>
        </Form.Item>
        {/* <ProFormSelect
          label="直播间状态"
          valueEnum={{ 待开播: '待开播', 直播中: '直播中', 已结束: '已结束' }}
        ></ProFormSelect> */}
        <Form.Item
          name={'time'}
          rules={[{ required: true, message: '请选择开播时间' }]}
          label="开播时间"
        >
          <DatePicker.RangePicker showTime></DatePicker.RangePicker>
        </Form.Item>
        <ProFormText
          rules={[{ required: true, message: '请输入主播昵称' }]}
          label="主播昵称"
          name={'anchorName'}
        ></ProFormText>
        {/* <ProFormText
          rules={[{ required: true, message: '请输入主播手机号' }]}
          label="主播手机号"
          name={'playerAccount'}
        ></ProFormText> */}
      </ModalForm>
    </PageContainer>
  );
}
