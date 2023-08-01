import { useEffect, useRef, useState } from 'react';
import { TableRequest } from '@/pages/utils/tableRequest';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import type { TableListItem } from './data';
import { getPage, setting } from './service';
import { Button, Cascader, Divider, Image, message, Modal, Switch, Typography } from 'antd';
import { getSubPage } from '@/pages/product/ProductManagement/Category/service';

export default () => {
  const ref = useRef<ActionType>();

  const [currentItem, setCurrentItem] = useState<TableListItem>();
  const [selectRowKeys, setSelectRowKeys] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<'single' | 'multiple'>('single');
  const [switch1, setSwitch1] = useState(true);
  const [switch2, setSwitch2] = useState(true);

  const [treeData, setTreeData] = useState<any>([]);

  const getCategoryAsync = async (parentId: string) => {
    const res = await getSubPage({ parentId });
    return res.data
      .filter((item) => !item.isBottom || item.level !== 1)
      .map((v: any) => {
        return {
          key: v.id,
          title: v.name,
          isLeaf: v.isBottom,
          disabled: parentId === '0' && v.isBottom,
        };
      });
  };

  useEffect(() => {
    // getBrandList({ pageNo: 1, pageSize: 10000 }).then((res) => {
    //   setBrandList(res.data.records);
    getCategoryAsync('0').then((res) => {
      setTreeData(res);
    });
  }, []);

  const loadMore = async (selectedOptions: any[]) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    const children = await getCategoryAsync(targetOption.key);
    targetOption.children = children;
    setTreeData([...treeData]);
  };

  const renderSetting = (record: TableListItem) => {
    return (
      <a
        key="subordinate"
        onClick={() => {
          console.log(record);
          setCurrentItem(record);
          setSwitch1(record.divideTeam);
          setSwitch2(record.dividePartner);
          setModalOpen(true);
          setMode('single');
        }}
      >
        设置
      </a>
    );
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '商品信息',
      dataIndex: 'productInfo',
      fieldProps: {
        placeholder: '商品名称/商品编号',
      },
      hideInTable: true,
    },
    {
      title: '推广设置',
      hideInTable: true,
      dataIndex: 'isJoinExtension',
      valueType: 'select',
      fieldProps: {
        placeholder: '请选择',
      },
      valueEnum: {
        false: '未参与',
        true: '参与',
      },
    },
    {
      title: '商品分类',
      hideInTable: true,
      fieldProps: {
        placeholder: '不选择显示全部',
      },
      search: {
        transform: (value) => ({
          category1: value[0],
          category2: value[1],
        }),
      },
      renderFormItem() {
        return (
          <Cascader
            options={treeData}
            placeholder="请选择..."
            allowClear
            fieldNames={{
              label: 'title',
              value: 'key',
            }}
            loadData={loadMore}
          />
        );
      },
    },
    {
      title: '商品',
      dataIndex: 'product',
      search: false,
      width: 200,
      render: (_dom, record) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image style={{ width: 80, height: 80 }} src={record.mainPic[0]} />
            <div style={{ marginLeft: 10 }}>
              <div>{record.name}</div>
              <div>¥{record.salePrice}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: '销量/库存',
      width: 100,
      dataIndex: 'id',
      search: false,
      align: 'center',
      render: (_dom, record) => {
        return (
          <div>
            <div>{record.factGmv}</div>
            <div>{record.stockCount}</div>
          </div>
        );
      },
    },
    {
      title: '是否参与团长佣金',
      dataIndex: 'divideTeam',
      width: 120,
      align: 'center',
      search: false,
      valueEnum: {
        true: {
          text: '已参与',
          status: 'Success',
        },
        false: {
          text: '未参与',
          status: 'Error',
        },
      },
    },
    {
      title: '是否参与合伙人佣金',
      dataIndex: 'dividePartner',
      width: 120,
      align: 'center',
      search: false,
      valueEnum: {
        true: {
          text: '已参与',
          status: 'Success',
        },
        false: {
          text: '未参与',
          status: 'Error',
        },
      },
    },

    {
      title: '操作时间',
      dataIndex: 'modifyTime',
      width: 90,
      search: false,
      ellipsis: true,
    },
    {
      title: '操作',
      width: 60,
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
            gap: '6px',
            flexWrap: 'wrap',
          }}
        >
          {selectRowKeys.includes(record?.id) ? null : renderSetting(record)}
        </div>
      ),
    },
  ];

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <ProTable<TableListItem>
        columns={columns}
        rowKey="id"
        actionRef={ref}
        scroll={{ x: 1000 }}
        // headerTitle="团长列表"
        search={{
          labelWidth: 'auto',
          span: 8,
          collapsed: false,
          collapseRender: () => null,
          showHiddenNum: true,
        }}
        headerTitle={
          <div key={'key'} style={{ display: 'flex', width: '100%' }}>
            <Button
              onClick={() => {
                setMode('multiple');
                setModalOpen(true);
                setSwitch1(true);
                setSwitch2(true);
              }}
              disabled={selectRowKeys.length === 0}
            >
              批量设置
            </Button>
          </div>
        }
        rowSelection={{
          selectedRowKeys: selectRowKeys,
          onChange(selectedRowKeys, selectedRows, info) {
            setSelectRowKeys(selectedRowKeys as string[]);
          },
        }}
        request={(params) => {
          return TableRequest(params, getPage);
        }}
      />
      <Modal
        onOk={() => {
          setting({
            dividePartner: switch2,
            divideTeam: switch1,
            ids: mode === 'multiple' ? selectRowKeys : [currentItem?.id ?? ''],
            isJoinExtension: true,
          }).then(() => {
            message.success('设置成功');
            ref.current?.reload();
            setModalOpen(false);
            setSelectRowKeys([]);
          });
        }}
        onCancel={() => {
          setModalOpen(false);
        }}
        destroyOnClose
        title="商品佣金设置"
        open={modalOpen}
      >
        <>
          <div
            style={{
              width: '100%',
              border: '1px solid #f5f5f5',
              background: 'rgb(250, 250, 250)',
              padding: 20,
            }}
          >
            {mode === 'single' ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Image style={{ width: 80, height: 80 }} src={currentItem?.mainPic[0]} />
                <div style={{ marginLeft: 10 }}>
                  <div>{currentItem?.name}</div>
                  <div>¥{currentItem?.salePrice}</div>
                </div>
              </div>
            ) : (
              <div>{selectRowKeys.length}件商品</div>
            )}
          </div>
          <div style={{ marginTop: 30 }}>
            <Typography.Title style={{ marginBottom: 10 }} level={5}>
              佣金设置
            </Typography.Title>
            <Divider style={{ marginBlock: 10 }} />
            <div style={{ marginTop: 20 }}>
              <span style={{ width: 160, display: 'inline-block', textAlign: 'right' }}>
                是否参与团长佣金：
              </span>
              <Switch
                checked={switch1}
                onChange={(value) => {
                  setSwitch1(value);
                }}
              ></Switch>
            </div>
            <div style={{ marginTop: 20 }}>
              <span style={{ width: 160, display: 'inline-block', textAlign: 'right' }}>
                是否参与合伙人佣金：
              </span>
              <Switch
                onChange={(value) => {
                  setSwitch2(value);
                }}
                checked={switch2}
              ></Switch>
            </div>
          </div>
        </>
      </Modal>
    </PageContainer>
  );
};
