import { useRef } from 'react';

import { UploadOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Alert, Button, Form, message } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import type { TableListItem } from './data';
import { batchShipment, getPage, postExport } from './service';
import { exportExcelBlob } from '@/pages/utils/export';

// export enum OrderStatus {
//   'CLOSE' = 'CLOSE',
//   'WAIT_PAY' = 'WAIT_PAY',
//   'TO_SHIP' = 'TO_SHIP',
//   'TO_RECEIVE' = 'TO_RECEIVE',
//   'FINISH' = 'FINISH',
// }

// export const orderStatusObject: { [key: string]: string } = {
//   CLOSE: '已关闭',
//   WAIT_PAY: '待付款',
//   TO_SHIP: '待发货',
//   TO_RECEIVE: '待收货',
//   FINISH: '已完成',
// };

export default function PageSpecification() {
  const ref = useRef<ActionType>();

  const newAdd = () => {
    return (
      <ModalForm
        key="label"
        width={500}
        title={'批量发货'}
        trigger={
          <Button type="primary">
            {/* <PlusOutlined /> */}
            批量发货
          </Button>
        }
        onFinish={async (values) => {
          const formData = new FormData();
          formData.append('file', values.file.file.originFileObj);
          await batchShipment(formData);
          message.success('批量发货成功');
          ref.current?.reload();
          return true;
        }}
      >
        <Alert
          message="请严格按照模板中说明进行填写表格！否则将可能导致更新数据失败及用户数据异常！"
          type="info"
          showIcon
        />
        <Form.Item name={'file'} noStyle>
          <Dragger maxCount={1} style={{ marginTop: 20 }} accept=".xls,.xlsx">
            <p className="ant-upload-drag-icon">
              {/* <InboxOutlined /> */}
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">将文件拖到此处，或点击上传</p>
          </Dragger>
        </Form.Item>

        <p style={{ color: '#666', fontSize: 12, marginTop: 10 }}>
          单次操作最多支持导入10000条数据，最大5MB，支持xlsx格式
        </p>
        <a
          onClick={() => {
            postExport().then((blob) => {
              exportExcelBlob('批量发货模板', blob);
            });
          }}
        >
          <VerticalAlignBottomOutlined />
          下载发货模板
        </a>
        {/* <ProFormText
          name="name"
          label="标签名称"
          placeholder="请输入分类名称"
          rules={[{ required: true }]}
        /> */}
      </ModalForm>
    );
  };

  //常量列表
  const columns: ProColumns<TableListItem>[] = [
    // { title: 'ID', width: 90, dataIndex: 'id', search: false },
    { title: '导入时间', dataIndex: 'createTime', align: 'center' },
    // { title: '购买人手机号', dataIndex: 'userPhone', search: false, ellipsis: true },
    { title: '导入状态', dataIndex: 'status', align: 'center' },
    { title: '导入成功数', dataIndex: 'success', align: 'center' },
    {
      title: '导入失败数',
      dataIndex: 'fail',
      align: 'center',
    },
    {
      title: '操作者',
      dataIndex: 'operator',
      align: 'center',
    },
  ];
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <div style={{ marginTop: 10 }}>
        <ProTable<TableListItem>
          columns={columns}
          actionRef={ref}
          scroll={{ x: 1000 }}
          search={false}
          toolBarRender={() => [newAdd()]}
          request={async () => {
            return await getPage();
          }}
        />
      </div>
    </PageContainer>
  );
}
