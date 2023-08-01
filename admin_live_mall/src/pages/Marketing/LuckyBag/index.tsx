import { Button, Form, InputNumber, message, Modal, Radio, Select, Space, Typography } from 'antd';
import { useRef, useState } from 'react';

import { TableRequest } from '@/pages/utils/tableRequest';
import {
  ActionType,
  DrawerForm,
  PageContainer,
  ProColumns,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import type { TableListItem } from './data';
import { add, edit, getPage, remove } from './service';
import styles from './index.module.less';
import SelectProductModal from '../CouponList/components/SelectProductModal';
import SelectedProductTable from '../CouponList/components/SelectedProductTable';
import { IProduct } from '@/api/type';
import { getProductsByIds } from '@/api/product';
import { history } from '@umijs/max';
import { FormInstance } from 'antd/lib/form';

enum ActionEnum {
  See = '查看',
  Edit = '编辑',
  Add = '新增',
}

export default function LiveList() {
  const ref = useRef<ActionType>();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editValue, setEditValue] = useState<TableListItem>();

  const [selectProductModalOpen, setSelectProductModalOpen] = useState(false);
  const [selectProducts, setSelectProducts] = useState<IProduct[]>([]);

  const [currentAction, setCurrentAction] = useState<ActionEnum>();

  const form = useRef<FormInstance<any>>(null);

  const reloadTable = () => {
    ref.current?.reload();
  };

  const fetchProducts = (productIds: string[]) => {
    getProductsByIds({
      productIds,
    }).then((res) => {
      setSelectProducts(res.data.records);
    });
  };

  const renderAdd = () => {
    return (
      <Button
        onClick={() => {
          setEditModalOpen(true);
          setEditValue(undefined);
          setCurrentAction(ActionEnum.Add);
        }}
        type="primary"
      >
        创建福袋活动
      </Button>
    );
  };

  //删除
  const deleteLabel = (record: TableListItem) => (
    <a
      onClick={() => {
        const deleteModal = Modal.confirm({
          title: `确定要删除福袋活动：${record.name}吗?`,
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

  const renderEdit = (record: TableListItem) => {
    const isProcess = record.status === '投放中';
    return (
      <a
        style={{
          color: isProcess ? '#c3c3c3' : undefined,
          cursor: isProcess ? 'not-allowed' : undefined,
        }}
        onClick={() => {
          if (isProcess) return;
          console.log('record', record);
          setEditModalOpen(true);
          setEditValue(record);
          setCurrentAction(ActionEnum.Edit);
          // setSelectProducts(record.)
          fetchProducts([record.goods]);
        }}
      >
        编辑
      </a>
    );
  };

  const renderSee = (record: TableListItem) => {
    if (!record.status) return;
    return (
      <a
        onClick={() => {
          // console.log('record', record);
          // setEditModalOpen(true);
          // setEditValue(record);
          // setCurrentAction(ActionEnum.See);
          // fetchProducts(record.goods);
          history.push('/Marketing/LuckyBagDetail?id=' + record.id);
        }}
      >
        查看历史投放
      </a>
    );
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '福袋名称',
      dataIndex: 'name',
      // width: 90,
      ellipsis: true,
      align: 'center',
    },
    // {
    //   title: '展示位置',
    //   dataIndex: 'position',
    //   width: 120,
    //   ellipsis: true,
    //   align: 'center',
    //   search: false,
    //   valueEnum: {
    //     INDEX: '小程序首页',
    //     LIVE: '直播间',
    //   },
    // },
    {
      title: '状态',
      dataIndex: 'status',
      // width: 120,
      search: false,
      ellipsis: true,
      valueEnum: {
        true: '已绑定',
        false: '未绑定',
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      // width: 160,
      search: false,
      ellipsis: true,
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTimeRange',
      search: {
        transform: (value) => ({ startTime: value[0], endTime: value[1] }),
      },
      hideInTable: true,
    },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      align: 'center',
      valueType: 'option',
      render: (_, record: TableListItem) => [
        renderSee(record),
        renderEdit(record),
        deleteLabel(record),
      ],
    },
  ];
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <ProTable<TableListItem>
        columns={columns}
        actionRef={ref}
        scroll={{ x: 1000 }}
        toolBarRender={() => [renderAdd()]}
        search={{
          labelWidth: 'auto',
          span: 6,
        }}
        request={(params) => TableRequest(params, getPage)}
      />

      <DrawerForm
        layout="horizontal"
        formRef={form}
        initialValues={
          editValue
            ? {
                ...editValue,
                method: Number(editValue.method),
              }
            : undefined
        }
        drawerProps={{
          destroyOnClose: true,
          footer: currentAction === ActionEnum.See ? null : undefined,
        }}
        submitter={currentAction === ActionEnum.See ? false : undefined}
        onOpenChange={(value) => {
          if (!value) {
            setSelectProducts([]);
          }
          setEditModalOpen(value);
        }}
        open={editModalOpen}
        onFinish={async (values) => {
          const method = currentAction === ActionEnum.Edit ? edit : add;
          await method({
            ...values,
            id: currentAction === ActionEnum.Edit ? editValue?.id : undefined,
            goods: selectProducts.map((item) => item.id)[0],
          }).then(() => {
            if (currentAction === ActionEnum.Edit) {
              message.success('编辑成功');
            } else {
              message.success('添加成功');
            }

            reloadTable();
          });
          return true;
        }}
        title={`${currentAction}签到活动`}
      >
        <Typography.Title level={5}>福袋类型</Typography.Title>
        <div className={styles['radio-group-container']}>
          <Form.Item label="福袋类型" required name={'type'} initialValue={'FUDAI'}>
            <Radio.Group style={{ marginTop: 5 }}>
              <Radio value={'FUDAI'}>
                <div>
                  <div>无门槛福袋</div>
                  <div style={{ marginTop: 10, color: '#666', fontSize: 12 }}>
                    用户直接参与领福袋
                  </div>
                </div>
              </Radio>
              <Radio value={'SIGN'}>
                <div>
                  <div>签到领福袋</div>
                  <div style={{ marginTop: 10, color: '#666', fontSize: 12 }}>
                    用户签到获取直播间福袋抽奖资格
                  </div>
                </div>
              </Radio>
            </Radio.Group>
          </Form.Item>
        </div>
        <ProFormText
          rules={[{ required: true, message: '请输入福袋名称' }]}
          label="福袋名称"
          placeholder={'请输入福袋名称'}
          fieldProps={{
            showCount: true,
            maxLength: 30,
          }}
          name="name"
        ></ProFormText>
        {/* <ProFormText
          rules={[{ required: true, message: '请输入签到标题' }]}
          label="签到标题"
          fieldProps={{
            showCount: true,
            maxLength: 30,
          }}
          name="name"
        ></ProFormText> */}
        <Form.Item shouldUpdate noStyle>
          {({ getFieldValue }) => {
            const isShowSign = getFieldValue('type') === 'SIGN';
            if (isShowSign) {
              return (
                <div className={styles['radio-group-container']}>
                  <Form.Item initialValue={'SINGLE'} name="signRule" required label="签到规则">
                    <Radio.Group
                      onChange={(e) => {
                        const array = e.target.value === 'SINGLE' ? ['totalTime'] : ['singleTime'];
                        form.current?.validateFields(array);
                      }}
                      style={{ marginTop: 5 }}
                    >
                      <Space direction="vertical">
                        <Radio value={'SINGLE'}>
                          <div>
                            <div>单次观看</div>
                            <div style={{ marginTop: 20, marginLeft: -24 }}>
                              <Form.Item noStyle shouldUpdate>
                                {({ getFieldValue }) => {
                                  const checked = getFieldValue('signRule') === 'TOTAL';
                                  // if (!checked) {
                                  //   formRef.current?.validateFields(['time3']);
                                  // }
                                  return (
                                    <div style={{ display: 'flex' }}>
                                      <span style={{ lineHeight: '32px' }}>
                                        用户单次直播间观看时长
                                      </span>
                                      <Form.Item
                                        rules={[{ required: !checked, message: '请输入' }]}
                                        name={'singleTime'}
                                        style={{ marginBottom: 0 }}
                                      >
                                        <InputNumber
                                          disabled={checked}
                                          style={{ marginLeft: 10 }}
                                        />
                                      </Form.Item>
                                      <Form.Item name="unit" noStyle initialValue={'分'}>
                                        <Select
                                          onClick={(e) => {
                                            e.preventDefault();
                                          }}
                                          disabled={checked}
                                          style={{ width: 60, height: 34 }}
                                          options={[
                                            { label: '分', value: '分' },
                                            { label: '时', value: '时' },
                                          ]}
                                        ></Select>
                                      </Form.Item>
                                    </div>
                                  );
                                }}
                              </Form.Item>
                            </div>
                          </div>
                        </Radio>
                        <Radio value={'TOTAL'} style={{ marginTop: 10 }}>
                          <div className="radio2-container">
                            <div>累计观看</div>
                            <div
                              style={{
                                display: 'flex',
                                alignContent: 'center',
                                marginTop: 10,
                                marginLeft: -24,
                              }}
                            >
                              <Form.Item noStyle shouldUpdate>
                                {({ getFieldValue }) => {
                                  const checked = getFieldValue('signRule') === 'SINGLE';
                                  return (
                                    <div style={{ display: 'flex' }}>
                                      <span style={{ lineHeight: '32px' }}>
                                        用户累计直播间观看时长
                                      </span>
                                      <Form.Item
                                        rules={[{ required: !checked, message: '请输入' }]}
                                        name={'totalTime'}
                                        style={{ marginBottom: 0 }}
                                      >
                                        <InputNumber
                                          disabled={checked}
                                          style={{ marginLeft: 10 }}
                                        />
                                      </Form.Item>
                                      <Form.Item name="totalTimeUnit" noStyle initialValue={'分'}>
                                        <Select
                                          disabled={checked}
                                          onClick={(e) => {
                                            e.preventDefault();
                                          }}
                                          style={{ width: 60, height: 34 }}
                                          options={[
                                            { label: '分', value: '分' },
                                            { label: '时', value: '时' },
                                          ]}
                                        ></Select>
                                      </Form.Item>
                                    </div>
                                  );
                                }}
                              </Form.Item>
                            </div>
                          </div>
                        </Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                </div>
              );
            }
            return null;
          }}
        </Form.Item>

        <Typography.Title level={5}>中奖规则</Typography.Title>
        <Form.Item
          required
          name={'products'}
          rules={[
            {
              validator(rule, value, callback) {
                if (selectProducts.length === 0) {
                  callback('请选择适用商品');
                } else {
                  callback();
                }
              },
            },
          ]}
          label="适用商品"
        >
          <div>
            <div>
              <span>部分参与</span>
              <Button
                onClick={() => {
                  setSelectProductModalOpen(true);
                }}
                type="link"
              >
                选择参与商品
              </Button>
              <span style={{ fontSize: 12, color: '#666' }}>选中的商品为参与活动的商品</span>
            </div>
            <div>
              {selectProducts.length > 0 ? (
                <SelectedProductTable
                  removeOne={(productId: string) => {
                    setSelectProducts((item) => {
                      return item.filter((product) => product.id !== productId);
                    });
                  }}
                  selectRows={selectProducts}
                ></SelectedProductTable>
              ) : null}
            </div>
          </div>
        </Form.Item>
      </DrawerForm>
      <SelectProductModal
        params={{ type: 2 }}
        selectRows={selectProducts}
        open={selectProductModalOpen}
        onCancel={() => {
          setSelectProductModalOpen(false);
        }}
        onOk={(selectRows) => {
          setSelectProducts(selectRows);
          setSelectProductModalOpen(false);
        }}
      />
    </PageContainer>
  );
}
