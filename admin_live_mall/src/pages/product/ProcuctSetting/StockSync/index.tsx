import { Button, Card, Form, message } from 'antd';
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
import { getPage, uploadFile } from './service';
import { downloadExcel } from '@/pages/utils/export';
import { TableRequest } from '@/pages/utils/tableRequest';

export default function PageSpecification() {
  const ref = useRef<ActionType>();
  const reloadTable = () => {
    ref.current?.reload();
  };

  const [isEdit, setIsEdit] = useState<any>();
  const [modalVisit, setModalVisit] = useState(false);

  const downloadTemplate = () => {
    downloadExcel(
      '库存同步模板',
      'https://cdn-1301909928.cos.ap-shanghai.myqcloud.com/excelTemplate/%E5%BA%93%E5%AD%98%E5%90%8C%E6%AD%A5%E6%A8%A1%E6%9D%BF.xlsx',
    );
  };

  //新建
  const newAdd = () => {
    return (
      <ModalForm
        key="label"
        width={500}
        title={'表格导入'}
        trigger={
          <Button type="primary">
            {/* <PlusOutlined /> */}
            库存同步
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
          await uploadFile(formData);
          message.success('库存同步成功');
          reloadTable();
          return true;
        }}
      >
        {/* <Alert
          message="请严格按照模板中说明进行填写表格！否则将可能导致更新数据失败及用户数据异常！"
          type="info"
          showIcon
        /> */}
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
          文件支持xls、xlsx，文件大小请控制在1MB以内
        </p>
        <a onClick={downloadTemplate}>
          <VerticalAlignBottomOutlined />
          库存同步模板
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
      title: '记录编号',
      width: 230,
      dataIndex: 'id',
      ellipsis: true,
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
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
      title: '同步数量',
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
    {
      title: '状态',
      dataIndex: 'status',
      search: false,
      ellipsis: true,
      renderText: (node, record) => {
        return record.status === 'finish' ? '已完成' : '进行中';
      },
    },
  ];
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <Card>
        <div style={{ fontSize: 16 }}>使用说明</div>
        <div style={{ marginTop: 10 }}>
          <div>
            1、点击下载<a onClick={downloadTemplate}>库存同步模板文件；</a>
          </div>
          <div>2、将要更新库存的商品编码或规格编码及对应的更新数量填入表格；</div>
          <div>3、【规格编码】都是必填项</div>
          <div>
            4、库存数量前面带+号，表示在现有的基础上增加对应库存，-号表示在现有基础上减掉对应库存；
            不带+/-符号，则直接将商品库存更新为模板里面填写的数量；
          </div>
          <div>5、使用下方【库存同步】功能上传编辑好的文件即可。</div>
        </div>
      </Card>
      <div style={{ marginTop: 10 }}>
        <ProTable<TableListItem>
          columns={columns}
          actionRef={ref}
          scroll={{ x: 1000 }}
          search={{
            labelWidth: 'auto',
          }}
          toolBarRender={() => [newAdd()]}
          request={(params) => TableRequest(params, getPage)}
        />
      </div>
    </PageContainer>
  );
}
