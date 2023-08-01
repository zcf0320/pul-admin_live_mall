import { Alert, Button, Form, message } from 'antd';
import { useRef, useState } from 'react';

import { UploadOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import Dragger from 'antd/es/upload/Dragger';
import type { TableListItem } from './data';
import { fetchImportProductTemplate, getPage, importExcel } from './service';
import { exportExcelBlob } from '@/pages/utils/export';
import { TableRequest } from '@/pages/utils/tableRequest';

export default function PageSpecification() {
  const ref = useRef<ActionType>();
  const reloadTable = () => {
    ref.current?.reload();
  };

  const [isEdit, setIsEdit] = useState<any>();
  const [modalVisit, setModalVisit] = useState(false);

  //新建
  const newAdd = () => {
    return (
      <ModalForm
        key="label"
        width={500}
        title={'批量发布商品'}
        trigger={
          <Button type="primary">
            {/* <PlusOutlined /> */}
            批量发布商品
          </Button>
        }
        initialValues={isEdit}
        open={modalVisit}
        onOpenChange={(visible) => {
          setModalVisit(visible);
          if (!visible) {
            setIsEdit(null);
          }
        }}
        modalProps={{ destroyOnClose: true, maskClosable: false }}
        onFinish={async (values) => {
          const formData = new FormData();
          formData.append('multipartFile', values.file.file.originFileObj);
          await importExcel(formData);
          message.success('导入成功');
          reloadTable();
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
          单次操作最多支持导入10000条数据，最大20MB，支持xlsx格式
        </p>
        <a
          onClick={async () => {
            exportExcelBlob('商品批量导入模板', await fetchImportProductTemplate());
          }}
        >
          <VerticalAlignBottomOutlined />
          下载商品模板
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
    // {
    //   title: 'ID',
    //   width: 200,
    //   dataIndex: 'id',
    //   ellipsis: true,
    // },
    {
      title: '编号',
      width: 230,
      dataIndex: 'id',

      ellipsis: true,
    },
    {
      title: '任务类型',
      dataIndex: 'taskType',
      search: false,
      ellipsis: true,
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      search: false,
      ellipsis: true,
    },
    {
      title: '任务上传时间',
      dataIndex: 'createTime',
      search: false,
      ellipsis: true,
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      search: false,
      ellipsis: true,
      renderText: (node, record) => {
        return record.status === 'finish' ? '已完成' : '进行中';
      },
    },
    {
      title: '导入数量',
      dataIndex: 'total',
      search: false,
      ellipsis: true,
    },
    {
      title: '成功数量',
      dataIndex: 'success',
      search: false,
      ellipsis: true,
    },
    {
      title: '失败数量',
      dataIndex: 'fail',
      search: false,
      ellipsis: true,
    },
  ];
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <ProTable<TableListItem>
        columns={columns}
        actionRef={ref}
        scroll={{ x: 1000 }}
        search={false}
        toolBarRender={() => [newAdd()]}
        request={(params) => TableRequest(params, getPage)}
      />
    </PageContainer>
  );
}
