import { useRef, useState } from 'react';
import { Button, Descriptions, Drawer, Form, message, Popconfirm, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';

import type { TableListItem } from './data';
import { table, add, edit, remove, updateStatus, bindCourse, allTable } from './service';
import { UploadPhotos, normImage } from '@/pages/components/UploadPhotos/UploadPhotos';
import CourseSubsection from './components/CourseSubsection';
import {
  ActionType,
  DrawerForm,
  ModalForm,
  PageContainer,
  ProColumns,
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { TableRequest } from '@/pages/utils/tableRequest';
import { excludeControls, extendControls, myUploadFn } from '@/pages/utils/richTextUpload';

export default () => {
  const [isEdit, setIsEdit] = useState<TableListItem | undefined>(undefined);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [bindModalVisible, setBindModalVisible] = useState<boolean>(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState<boolean>(false);
  const [childModalVisible, setChildModalVisible] = useState<boolean>(false);
  const [currentIds, setCurrentIds] = useState<any>();
  const [currentItem, setCurrentItem] = useState<TableListItem>();
  const braft = BraftEditor.createEditorState(null);
  const [editValue, setEditValue] = useState(braft);

  const tableRef = useRef<ActionType>();
  const reloadTable = () => {
    tableRef.current?.reload();
  };

  // 删除富文本P标签导致的空行
  const hooks = {
    'insert-medias': (e: any[]) => {
      let a = editValue.toHTML() as string;
      const first = /altered="false"><\/p>$/;
      if (first.test(a)) {
        a = '';
      }
      const reg = /<p><\/p>$/;
      if (reg.test(a)) {
        a = a.slice(0, a.length - 7);
      }
      for (let index = 0; index < e.length; index++) {
        let lineFeed = '';
        if (e.length - 1 === index) {
          lineFeed = '<p></p>';
        }
        a +=
          '<div class="media-wrap image-wrap"><img class="media-wrap image-wrap" src="' +
          e[index].url +
          '"/></div>' +
          lineFeed;
      }
      setEditValue(BraftEditor.createEditorState(a));
    },
  };

  //新建
  const addItem = () => {
    return (
      <DrawerForm
        key="addItem"
        width={900}
        title={isEdit ? '编辑课程' : '新建课程'}
        trigger={
          <Button type="primary">
            <PlusOutlined />
            新建课程
          </Button>
        }
        initialValues={isEdit}
        open={addModalVisible}
        onOpenChange={(visible) => {
          setAddModalVisible(visible);
          if (!visible) {
            setIsEdit(undefined);
            setEditValue(BraftEditor.createEditorState(null));
          }
        }}
        drawerProps={{ destroyOnClose: true, maskClosable: false }}
        onFinish={async (values) => {
          let res = null;
          if (isEdit) {
            res = await edit({ ...values, id: isEdit.id, courseDetail: editValue.toHTML() });
          } else {
            res = await add({ ...values, courseDetail: editValue.toHTML() });
          }
          if (res?.code === 0) {
            message.success(`${isEdit ? '编辑' : '新建'}成功！`);
            reloadTable();
          } else {
            message.error(`${isEdit ? '编辑' : '新建'}失败！`);
            return false;
          }
          return true;
        }}
      >
        <Form.Item
          label="课程主图"
          tooltip="只能上传一张图片哦"
          name="mainImage"
          valuePropName="imageUrl"
          getValueFromEvent={normImage}
          rules={[{ required: true, message: '请上传图片' }]}
        >
          <UploadPhotos
            amount={1}
            onChange={(e: any) => {
              normImage(e);
            }}
          />
        </Form.Item>
        {/* <ProFormText name="mainImage" label="课程主图" rules={[{ required: true }]} /> */}
        <ProFormText name="courseTitle" label="课程标题" rules={[{ required: true }]} />
        <ProFormText name="courseSubtitle" label="课程副标题" rules={[{ required: true }]} />
        {/* <ProFormText name="courseDetail" label="课程详情" /> */}
        {/* <ProFormText name="giftBag" label="邮寄礼包清单" /> */}
        <ProForm.Group>
          <ProFormDigit label="已学人数" name="learnCount" fieldProps={{ precision: 0 }} />
        </ProForm.Group>
        <Form.Item shouldUpdate label="详情内容">
          {/* https://www.yuque.com/braft-editor/be/gz44tn */}
          <BraftEditor
            placeholder="请输入正文内容"
            value={editValue}
            onChange={(editorState) => setEditValue(editorState)}
            media={{ uploadFn: myUploadFn }}
            hooks={hooks}
            contentStyle={{ height: 'auto' }}
          />
        </Form.Item>
      </DrawerForm>
    );
  };

  //编辑
  const editItem = (record: TableListItem) => (
    <a
      key="editItem"
      onClick={() => {
        setAddModalVisible(true);
        setIsEdit(record);
        setEditValue(BraftEditor.createEditorState(record.courseDetail));
      }}
    >
      编辑
    </a>
  );

  //删除
  const deleteItem = (record: TableListItem) => (
    <Popconfirm
      key="deleteItem"
      title="确定要删除吗?"
      onConfirm={async () => {
        const res = await remove({ id: record.id });
        if (res.code === 0) {
          message.success('删除成功！');
          reloadTable();
        } else {
          message.error('删除失败！');
        }
      }}
    >
      <a>删除</a>
    </Popconfirm>
  );

  //禁用、启用
  const statusSwitch = (record: TableListItem) => (
    <Popconfirm
      key="statusSwitch"
      title={`确定要【${record.status === 0 ? '启用' : '禁用'}】吗？`}
      onConfirm={async () => {
        const res = await updateStatus({ id: record.id, status: record.status === 0 ? 1 : 0 });
        if (res.code === 0) {
          message.success(`${record.status === 0 ? '启用' : '禁用'}成功！`);
          reloadTable();
        } else {
          message.error(`${record.status === 0 ? '启用' : '禁用'}失败！`);
        }
      }}
    >
      <a>{record.status === 0 ? '启用' : '禁用'}</a>
    </Popconfirm>
  );

  //详情
  const details = (record: TableListItem) => (
    <a
      key="details"
      onClick={() => {
        setDetailsModalVisible(true);
        setCurrentItem(record);
        setEditValue(BraftEditor.createEditorState(record.courseDetail));
      }}
    >
      详情
    </a>
  );

  //课程小节
  const schedule = (record: TableListItem) => (
    <a
      key="schedule"
      onClick={() => {
        setChildModalVisible(true);
        setCurrentItem(record);
      }}
    >
      课程小节
    </a>
  );

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      width: 100,
      dataIndex: 'id',
      search: false,
      align: 'center',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '课程主图',
      width: 90,
      dataIndex: 'mainImage',
      valueType: 'image',
      search: false,
      align: 'center',
    },
    { title: '课程标题', width: 140, dataIndex: 'courseTitle', align: 'center', ellipsis: true },
    {
      title: '课程副标题',
      dataIndex: 'courseSubtitle',
      width: 200,
      search: false,
      align: 'center',
      ellipsis: true,
    },
    { title: '已学人数', width: 100, dataIndex: 'learnCount', search: false, align: 'center' },
    {
      title: '课程状态',
      width: 120,
      dataIndex: 'status',
      valueEnum: {
        0: {
          text: '已下架',
          status: 'error',
        },
        1: {
          text: '已上架',
          status: 'success',
        },
      },
      search: false,
      align: 'center',
    },
    {
      title: '操作',
      width: 260,
      fixed: 'right',
      valueType: 'option',
      align: 'center',
      render: (_, record: TableListItem) => (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          {details(record)}
          {editItem(record)}
          {schedule(record)}
          {statusSwitch(record)}
          {deleteItem(record)}
        </div>
      ),
    },
  ];
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <ProTable<TableListItem>
        headerTitle="课程列表"
        rowKey="id"
        columns={columns}
        actionRef={tableRef}
        scroll={{ x: 1000 }}
        search={{ labelWidth: 'auto' }}
        toolBarRender={() => [addItem()]}
        request={(params) => TableRequest(params, table)}
        rowSelection={{
          // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
          // 注释该行则默认不显示下拉选项（全选、反选）
          // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          defaultSelectedRowKeys: [],
        }}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space size={24}>
            <span>
              已选 {selectedRowKeys.length} 项 &nbsp; &nbsp; &nbsp;
              <a onClick={onCleanSelected}>取消选择</a>
            </span>
          </Space>
        )}
        tableAlertOptionRender={({ selectedRowKeys }) => {
          return (
            <Space size={16}>
              <a
                onClick={() => {
                  setCurrentIds(selectedRowKeys);
                  setBindModalVisible(true);
                }}
              >
                绑定课程套餐
              </a>
            </Space>
          );
        }}
      />

      <ModalForm
        title="绑定课程套餐"
        open={bindModalVisible}
        modalProps={{ destroyOnClose: true, maskClosable: false }}
        onFinish={async (values) => {
          const res = await bindCourse({ ...values, courseIds: currentIds });
          if (res.code === 0) {
            message.success('课程绑定成功！');
            if (tableRef.current?.clearSelected) tableRef.current?.clearSelected();
            reloadTable();
          } else {
            message.error('课程绑定失败！');
            return false;
          }
          return true;
        }}
        onVisibleChange={(visible) => setBindModalVisible(visible)}
      >
        <ProFormSelect
          showSearch
          name="packageId"
          label="课程套餐标题"
          placeholder="请输入课程套餐标题"
          debounceTime={1000}
          fieldProps={{
            fieldNames: { value: 'id', label: 'name' },
          }}
          request={async () => {
            const res = await allTable();
            return res?.data?.map((item: any) => ({
              id: item.id,
              name: item.packageTitle,
            }));
          }}
          rules={[{ required: true }]}
        />
      </ModalForm>

      <Drawer
        title="详细信息"
        width={600}
        open={detailsModalVisible}
        destroyOnClose
        footer={null}
        onClose={() => setDetailsModalVisible(false)}
      >
        <Descriptions column={1}>
          <Descriptions.Item label="课程标题">{currentItem?.courseTitle}</Descriptions.Item>
          <Descriptions.Item label="课程副标题">{currentItem?.courseSubtitle}</Descriptions.Item>
          <Descriptions.Item label="已学人数">{currentItem?.learnCount}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{currentItem?.createTime}</Descriptions.Item>
          <Descriptions.Item label="修改时间">{currentItem?.modifyTime}</Descriptions.Item>
        </Descriptions>
        <div style={{ backgroundColor: '#fafafc' }}>
          <BraftEditor
            readOnly //只读
            extendControls={extendControls} //自定义控件
            excludeControls={excludeControls} //不显示默认控件
            value={editValue}
            contentStyle={{ height: 'auto' }}
          />
        </div>
      </Drawer>

      <Drawer
        destroyOnClose
        width={1000}
        placement={'left'}
        closable={false}
        open={childModalVisible}
        onClose={() => setChildModalVisible(false)}
      >
        <CourseSubsection courseId={currentItem?.id} />
      </Drawer>
    </PageContainer>
  );
};
