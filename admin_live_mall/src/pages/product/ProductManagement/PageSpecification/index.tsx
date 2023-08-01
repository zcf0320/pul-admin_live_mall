import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal, Tag } from 'antd';
import { useRef, useState } from 'react';

import { TableRequest } from '@/pages/utils/tableRequest';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormList,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import type { SpecValue, TableListItem } from './data';
import { add, edit, getPage, remove } from './service';
import { getRandomTagColor } from '@/pages/utils';

export default function PageSpecification() {
  const ref = useRef<ActionType>();
  const reloadTable = () => {
    ref.current?.reload();
  };

  const [isEdit, setIsEdit] = useState<any>();
  const [modalVisit, setModalVisit] = useState(false);

  const checkHasRepetition = (value: string[]) => {
    const set = new Set(value);
    return set.size !== value.length;
  };

  //新建
  const newAdd = () => {
    return (
      <ModalForm
        key="label"
        title={isEdit ? '编辑规格' : ''}
        trigger={
          <Button type="primary">
            <PlusOutlined />
            新建
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
          if (checkHasRepetition(values.values.map((item: any) => item.value))) {
            message.error('不能用一样的规格值');
            return false;
          }
          values.values = values.values.map((v: { value: any }) => ({ value: v.value, sort: 0 }));

          console.log('是否编辑？', isEdit?.type, values);
          let msg = null;
          if (isEdit) {
            msg = await edit({ ...values, id: isEdit.id });
          } else {
            msg = await add(values);
          }

          if (msg.code === 0) {
            if (isEdit) {
              message.success('编辑成功！');
            } else {
              message.success('新增成功！');
            }
            reloadTable();
          } else {
            if (isEdit) {
              message.error('编辑失败！');
            } else {
              message.error('新增失败！');
            }
          }
          return true;
        }}
      >
        <ProFormText
          name="name"
          label="规格名称"
          placeholder="请输入规格名称"
          rules={[{ required: true }]}
        />
        <ProFormList
          name="values"
          initialValue={[
            {
              value: '',
            },
          ]}
          creatorButtonProps={{
            position: 'bottom',
            creatorButtonText: '再建一行',
          }}
        >
          <ProFormText
            name="value"
            label="规格值"
            rules={[{ required: true }]}
            placeholder="请输入规格值"
          />
        </ProFormList>
        <ProFormTextArea name="remark" label="规格说明" placeholder="请输入规格说明" />
      </ModalForm>
    );
  };

  //编辑
  const alterLabel = (record: any) => (
    <a
      key="alter"
      onClick={() => {
        setModalVisit(true);
        console.log(record);
        record.values = record.specValues;
        setIsEdit(record);
      }}
    >
      编辑
    </a>
  );

  //删除
  const deleteLabel = (record: TableListItem) => (
    <a
      onClick={() => {
        const deleteModal = Modal.confirm({
          title: `确定要删除规格：${record.name}吗?`,
          onOk: () => {
            remove({ id: record.id }).then(() => {
              message.success('删除成功');
              // refresh();
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

  // const renderAction = (record: TableListItem) => {
  //   // alterLabel(record), deleteLabel(record)
  //   const dropdownItems: ItemType[] = [
  //     {
  //       key: '1',
  //       label: alterLabel(record),
  //     },
  //     {
  //       key: '2',
  //       label: deleteLabel(record),
  //     },
  //   ].filter((item) => item.label !== null);

  //   return (
  //     <Dropdown trigger={['click']} menu={{ items: dropdownItems }} placement="bottomLeft">
  //       <Button size="small" type="primary">
  //         操作
  //         <DownOutlined />
  //       </Button>
  //     </Dropdown>
  //   );
  // };

  //常量列表
  const columns: ProColumns<TableListItem>[] = [
    // { title: 'ID', width: 90, dataIndex: 'id', search: false },
    { title: '规格名称', width: 230, dataIndex: 'name', ellipsis: true },
    {
      title: '规格值',
      width: 230,
      dataIndex: 'configName',
      search: false,
      ellipsis: true,
      render(_, record) {
        return record.specValues.map((v: SpecValue) => {
          return (
            <Tag color={getRandomTagColor()} key={v.id}>
              {v.value}
            </Tag>
          );
        });
      },
    },
    { title: '规格说明', width: 250, dataIndex: 'remark', search: false, ellipsis: true },
    {
      title: '操作',
      width: 60,
      fixed: 'right',
      align: 'center',
      valueType: 'option',
      // render: (_: any, record: any) => [renderAction(record)],
      render: (_: any, record: any) => [alterLabel(record), deleteLabel(record)],
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
        }}
        toolBarRender={() => [newAdd()]}
        request={(params) => TableRequest(params, getPage)}
      />
    </PageContainer>
  );
}
