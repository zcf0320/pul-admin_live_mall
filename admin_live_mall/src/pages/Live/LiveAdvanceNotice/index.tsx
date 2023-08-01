import { Button, DatePicker, Form, message, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';

import { TableRequest } from '@/pages/utils/tableRequest';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormSelect,
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
import { TableListItem as LiveListItem } from '../LiveList/data';
import { getPage as getLiveList } from '../LiveList/service';

export default function LiveList() {
  const ref = useRef<ActionType>();

  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<TableListItem>();
  const [liveList, setLiveList] = useState<LiveListItem[]>([]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editValue, setEditValue] = useState<TableListItem>();

  useEffect(() => {
    getLiveList({
      pageNo: 1,
      pageSize: 100000,
    }).then((res) => {
      setLiveList(res.data.records);
    });
  }, []);

  const reloadTable = () => {
    ref.current?.reload();
  };

  const renderAdd = () => {
    return (
      <Button
        onClick={() => {
          setEditModalOpen(true);
          setEditValue(undefined);
        }}
        type="primary"
      >
        创建预告
      </Button>
    );
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
      title: '预告名称',
      dataIndex: 'name',
      // width: 90,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '预告封面',
      dataIndex: 'type',
      // width: 90,
      ellipsis: true,
      align: 'center',
      search: false,
      valueEnum: {
        DEVICE: '第三方设备直播',
        MOBILE: '小程序直播',
      },
    },
    {
      title: '预约人数',
      dataIndex: 'type',
      // width: 90,
      ellipsis: true,
      align: 'center',
      search: false,
      valueEnum: {
        DEVICE: '第三方设备直播',
        MOBILE: '小程序直播',
      },
    },

    {
      title: '操作',
      width: 240,
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
            {
              key: '  renderEdit(record),',
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
        toolBarRender={() => [renderAdd()]}
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
              <div style={{ width: 200, height: 120, backgroundColor: '#f5f5f5' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button type="link">下载</Button>
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
          await edit({
            ...values,
            id: editValue?.id,
            player: values.playerAccount,
            startTime: dayjs(values.time[0]).format('YYYY-MM-DD HH:mm:ss'),
            endTime: dayjs(values.time[0]).format('YYYY-MM-DD HH:mm:ss'),
          }).then(() => {
            message.success('编辑成功');
            reloadTable();
          });
          return true;
        }}
        title="新增预告"
      >
        <ProFormText
          width={400}
          rules={[{ required: true, message: '请输入预告名称' }]}
          label="预告名称"
          name="name"
        ></ProFormText>
        <Form.Item
          required
          rules={[{ required: true, message: '请上传直播间封面' }]}
          label="直播间封面"
        >
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
            {/* <span style={{ fontSize: 12, color: '#999', marginLeft: 20 }}>
              上传直播间封面，格式：png、jpg
              <br />
              最大1mb,尺寸400*400
            </span> */}
          </div>
        </Form.Item>

        <Form.Item
          name={'time'}
          rules={[{ required: true, message: '请选择开播时间' }]}
          label="开播时间"
        >
          <DatePicker.RangePicker showTime></DatePicker.RangePicker>
        </Form.Item>
        <ProFormSelect
          width={400}
          required
          rules={[{ required: true, message: '请选择开播时间' }]}
          label="选择直播间"
          name={'liveId'}
          options={liveList.map((item) => ({ label: item.name, value: item.id }))}
        ></ProFormSelect>
      </ModalForm>
    </PageContainer>
  );
}
