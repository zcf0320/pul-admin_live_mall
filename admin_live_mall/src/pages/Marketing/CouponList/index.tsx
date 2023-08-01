import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Space,
  Typography,
} from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

import { TableRequest } from '@/pages/utils/tableRequest';
import {
  ActionType,
  DrawerForm,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import type { TableListItem } from './data';
import { add, edit, getPage, remove, cancel } from './service';
import storeCouponPng from '@/assets/store-coupon.png';
import productCouponPng from '@/assets/product-coupon.png';
import styles from './index.module.less';
import { FormInstance } from 'antd/lib/form';
import SelectProductModal from './components/SelectProductModal';
import { IProduct } from '@/api/type';
import SelectedProductTable from './components/SelectedProductTable';
import dayjs from 'dayjs';
import { getProductsByIds } from '@/api/product';
import { RangePickerProps } from 'antd/es/date-picker';
import ManualDistributeModal from '@/pages/Marketing/CouponList/components/ManualDistributeModal';

enum CouponType {
  product = 'PRODUCT',
  store = 'STORE',
}

export default function LiveList() {
  const ref = useRef<ActionType>();
  const reloadTable = () => {
    ref.current?.reload();
  };

  // const [isEdit, setIsEdit] = useState<any>();
  // const [modalVisit, setModalVisit] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const formRef = useRef<FormInstance>(null);
  const [couponType, SetCouponType] = useState(CouponType.store);
  const [selectProductModalOpen, setSelectProductModalOpen] = useState(false);
  const [selectProducts, setSelectProducts] = useState<IProduct[]>([]);
  const [editValue, setEditValue] = useState<TableListItem>();
  const [time2, setTime2] = useState(1);
  const [showManualModal, setShowManualModal] = useState(false);

  useEffect(() => {
    if (time2 === 2) formRef.current?.validateFields(['time']);
  }, [formRef, time2]);

  useEffect(() => {
    formRef.current?.validateFields(['products']);
  }, [formRef, selectProducts]);

  const Line = () => {
    return <div style={{ width: '100%', height: 1, backgroundColor: '#f5f5f5' }}></div>;
  };

  const fetchProducts = (productIds: string[]) => {
    console.log('productIds', productIds);
    if (productIds.length > 0) {
      getProductsByIds({
        productIds,
      }).then((res) => {
        setSelectProducts(res.data.records);
      });
    } else {
      setSelectProducts([]);
    }
  };

  //编辑
  const alterLabel = (record: any) => (
    <a
      key="alter"
      onClick={() => {
        setDrawerOpen(true);
        setEditValue(record);
        SetCouponType(record.couponType);
        if (couponType === CouponType.product) fetchProducts(record.discountId);
      }}
    >
      编辑
    </a>
  );

  //失效
  const deleteLabel = (record: TableListItem) => (
    <a
      onClick={() => {
        const deleteModal = Modal.confirm({
          title: `确定要失效优惠券：${record.couponName}吗?`,
          content: '已领的优惠券可以继续使用',
          onOk: () => {
            remove({ id: record.id }).then(() => {
              message.success('失效成功');
              deleteModal.destroy();
              reloadTable();
            });
          },
        });
      }}
    >
      失效
    </a>
  );
  // 作废
  const cancelLabel = (record: TableListItem) => (
    <a
      onClick={() => {
        const deleteModal = Modal.confirm({
          title: `确定要作废优惠券：${record.couponName}吗?`,
          content: '已领的优惠券不可以继续使用',
          onOk: () => {
            cancel({ id: record.id }).then(() => {
              message.success('作废成功');
              deleteModal.destroy();
              reloadTable();
            });
          },
        });
      }}
      style={{ color: 'red' }}
    >
      作废
    </a>
  );
  // 手动发放
  const manualDistribute = (record: TableListItem) => {
    return (
      <a
        onClick={() => {
          setShowManualModal(true);
        }}
      >
        手动发放
      </a>
    );
  };

  const discountMethodComputed = (_text: any, record: TableListItem) => {
    if (record.discountMethod === 'REDUCTION') {
      return `满${record.money}减${record.deductionMoney}元`;
    } else {
      return `满${record.money}打${record.discountRate}折，最高优惠${record.limitMoney}元`;
    }
  };

  const couponTimeComputed = (_text: any, record: TableListItem) => {
    if (record.effectiveRules === 1) {
      return (
        <div>
          <div>起：{record.startTime}</div>
          <div>止：{record.endTime}</div>
        </div>
      );
    } else {
      return `领券后${record.day}天`;
    }
  };

  const tableEditValue = useMemo(() => {
    return editValue
      ? {
          ...editValue,
          time:
            editValue.effectiveRules === 1
              ? [dayjs(editValue.startTime), dayjs(editValue.endTime)]
              : undefined,
          day: editValue.effectiveRules === 2 ? editValue.day : undefined,
          couponTime: [dayjs(editValue.couponStartTime), dayjs(editValue.couponEndTime)],
          money: editValue.discountMethod === 'REDUCTION' ? editValue.money : undefined,
          money2: editValue.discountMethod === 'DISCOUNT' ? editValue.money : undefined,
          deductionMoney:
            editValue.discountMethod === 'REDUCTION' ? editValue.deductionMoney : undefined,
          discountRate:
            editValue.discountMethod === 'DISCOUNT' ? editValue.discountRate : undefined,
          limitMoney: editValue.discountMethod === 'DISCOUNT' ? editValue.limitMoney : undefined,
        }
      : undefined;
  }, [editValue]);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '优惠券名称',
      dataIndex: 'couponName',
      width: 90,
      ellipsis: true,
      align: 'center',
      // search: {
      //   transform: (value) => ({
      //     name: value,
      //   }),
      // },
    },
    {
      title: '用券有效期',
      dataIndex: 'couponStarttime',
      width: 120,
      search: false,
      // ellipsis: true,
      align: 'center',
      renderText: couponTimeComputed,
    },

    {
      title: '券类型',
      dataIndex: 'couponType',
      width: 90,
      // search: {
      //   transform: (value) => ({ type: value }),
      // },
      ellipsis: true,
      align: 'center',
      valueEnum: {
        STORE: '店铺券',
        PRODUCT: '商品券',
      },
    },
    {
      title: '优惠方式',
      dataIndex: 'discountMethod',
      width: 90,
      search: false,
      // ellipsis: true,
      align: 'center',
      renderText: discountMethodComputed,
    },
    {
      title: '券领状态',
      dataIndex: 'couponState',
      width: 120,
      // search: false,
      ellipsis: true,
      align: 'center',
      valueEnum: {
        IN_PROGRESS: '进行中',
        NOT_STARTED: '未开始',
        ENDED: '已结束',
        EXPIRED: '已失效',
      },
    },
    {
      title: '用券有效期',
      dataIndex: 'couponStarttime',
      valueType: 'dateTimeRange',
      search: {
        transform: (values) => ({ startTime: values[0], endTime: values[1] }),
      },
      colSize: 2,
      hideInTable: true,
    },
    {
      title: '操作',
      width: 140,
      fixed: 'right',
      align: 'center',
      valueType: 'option',
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
          {alterLabel(record)}
          {deleteLabel(record)}
          {cancelLabel(record)}
          {record?.couponState === 'IN_PROGRESS' ? manualDistribute(record) : null}
        </div>
      ),
    },
  ];

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    return current && current <= dayjs().subtract(1, 'day');
  };

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <Card>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex' }} className={styles.card}>
            <img
              src={storeCouponPng}
              style={{ width: 75, height: 100, marginLeft: 10, marginTop: 10 }}
            />
            <div style={{ marginLeft: 20, marginTop: 10 }}>
              <div style={{ fontWeight: 'bold' }}>店铺券</div>
              <div style={{ fontSize: 12, color: '#666' }}>适用于全店所有商品</div>
              <div style={{ marginTop: 10 }}>
                <Button
                  onClick={() => {
                    SetCouponType(CouponType.store);
                    setDrawerOpen(true);
                    setEditValue(undefined);
                  }}
                  type="primary"
                >
                  立即创建
                </Button>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex' }} className={styles.card}>
            <img
              src={productCouponPng}
              style={{ width: 75, height: 100, marginLeft: 10, marginTop: 10 }}
            />
            <div style={{ marginLeft: 20, marginTop: 10 }}>
              <div style={{ fontWeight: 'bold' }}>商品券</div>
              <div style={{ fontSize: 12, color: '#666' }}>适用于指定的部分商品</div>
              <div style={{ marginTop: 10 }}>
                <Button
                  onClick={() => {
                    SetCouponType(CouponType.product);
                    setDrawerOpen(true);
                    setEditValue(undefined);
                  }}
                  type="primary"
                >
                  立即创建
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <ProTable<TableListItem>
        columns={columns}
        actionRef={ref}
        scroll={{ x: 1000 }}
        search={{
          labelWidth: 'auto',
          span: 6,
          collapsed: false,
          collapseRender: () => undefined,
        }}
        // toolBarRender={() => []}
        request={(params) => TableRequest(params, getPage)}
      />
      <DrawerForm
        formRef={formRef}
        title={editValue ? '编辑优惠券' : '新建优惠券'}
        disabled={!!editValue}
        labelCol={{ span: 3 }}
        initialValues={tableEditValue}
        layout="horizontal"
        submitter={{
          resetButtonProps: {
            disabled: false,
          },
          submitButtonProps: {
            disabled: false,
          },
        }}
        onOpenChange={(value) => {
          if (!value) {
            setSelectProducts([]);
          }
          setDrawerOpen(value);
        }}
        // width={800}
        drawerProps={{ destroyOnClose: true }}
        open={drawerOpen}
        onFinishFailed={(err) => {
          console.log('err', err);
        }}
        onFinish={async (values) => {
          console.log('values', values);
          const params = {
            id: editValue ? editValue.id : undefined,
            couponName: values.couponName,
            couponStartTime: values.couponTime[0],
            couponEndTime: values.couponTime[1],
            effectiveRules: values.effectiveRules,
            startTime: values.effectiveRules === 1 ? values.time[0] : undefined,
            endTime: values.effectiveRules === 1 ? values.time[1] : undefined,
            day: values.effectiveRules === 2 ? values.day : undefined,
            couponNumber: values.couponNumber,
            returnUrl: values.returnUrl,
            restrictionMethod: values.restrictionMethod,
            // isOpen: values.isOpen,
            isOpen: 1, // 现在默认打开
            couponType: couponType,
            discountMethod: values.discountMethod,
            money: values.discountMethod === 'REDUCTION' ? values.money : values.money2,
            deductionMoney:
              values.discountMethod === 'REDUCTION' ? values.deductionMoney : undefined,
            discountRate: values.discountMethod === 'DISCOUNT' ? values.discountRate : undefined,
            limitMoney: values.discountMethod === 'DISCOUNT' ? values.limitMoney : undefined,
            discountId:
              couponType === CouponType.product ? selectProducts.map((item) => item.id) : undefined,
          };
          await (!editValue ? add(params) : edit({ id: params.id, num: params.couponNumber }));
          setSelectProducts([]);
          reloadTable();
          if (editValue) {
            message.success('编辑成功');
          } else {
            message.success('添加成功');
          }
          return true;
        }}
      >
        <Typography.Title level={5}>推广方式</Typography.Title>
        <Form.Item label="推广方式" required>
          <div>
            直接领取
            <span style={{ fontSize: 12, color: '#666', marginLeft: 10 }}>
              此类优惠券可以通过复制“推广链接”得到领券链接，进行自主推广
            </span>
          </div>
        </Form.Item>
        <Line />
        <Typography.Title style={{ marginTop: 20 }} level={5}>
          基本信息
        </Typography.Title>
        <Form.Item required label="优惠券名称">
          <Form.Item
            rules={[{ required: true, message: '请输入优惠券名称' }]}
            name="couponName"
            noStyle
          >
            <Input
              style={{ width: 400 }}
              showCount
              maxLength={15}
              placeholder="请输入优惠券名称"
            ></Input>
          </Form.Item>
          <span style={{ marginLeft: 10, fontSize: 12, color: '#666' }}>
            仅用于商家管理活动，不会展示给消费者
          </span>
        </Form.Item>
        <Form.Item
          name="couponTime"
          rules={[{ required: true, message: '请选择领券时间' }]}
          required
          label="领券时间"
        >
          <DatePicker.RangePicker
            disabledDate={disabledDate}
            style={{ width: 400 }}
            showTime
          ></DatePicker.RangePicker>
        </Form.Item>
        <div className={styles['radio-group-container']}>
          <Form.Item initialValue={1} name="effectiveRules" required label="用券有效期">
            <Radio.Group
              style={{ marginTop: 5 }}
              onChange={(e) => {
                setTime2(e.target.value);
              }}
            >
              <Space direction="vertical">
                <Radio value={1}>
                  <div>
                    <div>固定时间</div>
                    <div style={{ marginTop: 20, marginLeft: -24 }}>
                      <Form.Item noStyle shouldUpdate>
                        {({ getFieldValue }) => {
                          const checked = getFieldValue('effectiveRules') === 2 || !!editValue;
                          // if (!checked) {
                          //   formRef.current?.validateFields(['time3']);
                          // }
                          return (
                            <Form.Item
                              name="time"
                              rules={[{ required: !checked, message: '请选择用券时间' }]}
                            >
                              <DatePicker.RangePicker
                                style={{ width: 400 }}
                                showTime
                                disabledDate={disabledDate}
                                disabled={checked}
                              ></DatePicker.RangePicker>
                            </Form.Item>
                          );
                        }}
                      </Form.Item>
                    </div>
                  </div>
                </Radio>
                <Radio value={2} style={{ marginTop: 10 }}>
                  <div>
                    <div>领券后生效</div>
                    <div
                      style={{
                        display: 'flex',
                        alignContent: 'center',
                        marginTop: 10,
                        marginLeft: -24,
                      }}
                    >
                      <span style={{ lineHeight: '30px' }}>券领取后</span>
                      <Form.Item noStyle shouldUpdate>
                        {({ getFieldValue }) => {
                          const checked = getFieldValue('effectiveRules') === 1 || !!editValue;
                          return (
                            <Form.Item
                              rules={[{ required: !checked, message: '请输入' }]}
                              initialValue={1}
                              name="day"
                            >
                              <InputNumber
                                disabled={checked}
                                style={{ marginInline: 10 }}
                                min={1}
                              ></InputNumber>
                            </Form.Item>
                          );
                        }}
                      </Form.Item>
                      {/* <InputNumber style={{ marginInline: 10 }} min={0}></InputNumber> */}
                      <span style={{ lineHeight: '30px' }}>天内使用，逾期失效</span>
                    </div>
                  </div>
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        </div>
        <div className={styles['radio-group-container']}>
          <Form.Item initialValue={'REDUCTION'} name="discountMethod" required label="优惠方式">
            <Radio.Group
              style={{ marginTop: 5 }}
              onChange={(e) => {
                // setTime2(e.target.value);
                formRef.current?.validateFields([
                  'money',
                  'money2',
                  'deductionMoney',
                  'discountRate',
                  'limitMoney',
                ]);
              }}
            >
              <Space direction="vertical">
                <Radio value={'REDUCTION'}>
                  <div>
                    <div>满减券</div>
                    <div
                      style={{
                        display: 'flex',
                        alignContent: 'center',
                        marginTop: 10,
                        marginLeft: -24,
                      }}
                    >
                      <span style={{ lineHeight: '30px' }}>满</span>
                      <Form.Item noStyle shouldUpdate>
                        {({ getFieldValue }) => {
                          const checked =
                            getFieldValue('discountMethod') === 'DISCOUNT' || !!editValue;
                          return (
                            <Form.Item
                              rules={[{ required: !checked, message: '请输入' }]}
                              name="money"
                            >
                              <InputNumber
                                disabled={checked}
                                style={{ marginInline: 10 }}
                              ></InputNumber>
                            </Form.Item>
                          );
                        }}
                      </Form.Item>
                      <span style={{ lineHeight: '30px' }}>元，减</span>
                      <Form.Item noStyle shouldUpdate>
                        {({ getFieldValue }) => {
                          const checked =
                            getFieldValue('discountMethod') === 'DISCOUNT' || !!editValue;
                          return (
                            <Form.Item
                              rules={[{ required: !checked, message: '请输入' }]}
                              name="deductionMoney"
                            >
                              <InputNumber
                                disabled={checked}
                                style={{ marginInline: 10 }}
                              ></InputNumber>
                            </Form.Item>
                          );
                        }}
                      </Form.Item>
                      <span style={{ lineHeight: '30px' }}>元</span>
                    </div>
                  </div>
                </Radio>
                <Radio value={'DISCOUNT'} style={{ marginTop: 10 }}>
                  <div>
                    <div>满折券</div>
                    <div
                      style={{
                        display: 'flex',
                        alignContent: 'center',
                        marginTop: 10,
                        marginLeft: -24,
                        flexWrap: 'wrap',
                      }}
                    >
                      <span style={{ lineHeight: '30px' }}>满</span>
                      <Form.Item noStyle shouldUpdate>
                        {({ getFieldValue }) => {
                          const checked =
                            getFieldValue('discountMethod') === 'REDUCTION' || !!editValue;
                          return (
                            <Form.Item
                              rules={[{ required: !checked, message: '请输入' }]}
                              name="money2"
                            >
                              <InputNumber
                                disabled={checked}
                                style={{ marginInline: 10 }}
                              ></InputNumber>
                            </Form.Item>
                          );
                        }}
                      </Form.Item>
                      <span style={{ lineHeight: '30px' }}>元，打</span>
                      <Form.Item noStyle shouldUpdate>
                        {({ getFieldValue }) => {
                          const checked =
                            getFieldValue('discountMethod') === 'REDUCTION' || !!editValue;
                          return (
                            <Form.Item
                              rules={[{ required: !checked, message: '请输入' }]}
                              name="discountRate"
                            >
                              <InputNumber
                                disabled={checked}
                                min={0}
                                max={10}
                                style={{ marginInline: 10 }}
                              ></InputNumber>
                            </Form.Item>
                          );
                        }}
                      </Form.Item>
                      <span style={{ lineHeight: '30px' }}>折，最高优惠限额</span>
                      <Form.Item noStyle shouldUpdate>
                        {({ getFieldValue }) => {
                          const checked =
                            getFieldValue('discountMethod') === 'REDUCTION' || !!editValue;
                          return (
                            <Form.Item
                              rules={[{ required: !checked, message: '请输入' }]}
                              name="limitMoney"
                            >
                              <InputNumber
                                disabled={checked}
                                min={0}
                                max={10}
                                style={{ marginInline: 10 }}
                              ></InputNumber>
                            </Form.Item>
                          );
                        }}
                      </Form.Item>
                      <span style={{ lineHeight: '30px' }}>元</span>
                      <span
                        style={{ lineHeight: '30px', marginLeft: 10, fontSize: 12, color: '#666' }}
                      >
                        最高优惠限额填写不能超过5000元
                      </span>
                    </div>
                  </div>
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        </div>
        <Form.Item
          name="couponNumber"
          rules={[{ required: true, message: '请输入发放数量' }]}
          required
          label="发放数量"
        >
          <InputNumber
            disabled={false}
            style={{ width: 300 }}
            placeholder="最多不超过300万张"
          ></InputNumber>
        </Form.Item>
        <Line />
        <Typography.Title style={{ marginTop: 20 }} level={5}>
          领取和使用规则
        </Typography.Title>
        <Form.Item required initialValue={1} label="限领规则" name={'restrictionMethod'}>
          <Radio.Group style={{ marginTop: 5 }}>
            <Space direction="vertical">
              <Radio value={1}>每人限领一张</Radio>
              {/* <Radio value={2}>每人每天限领一张</Radio> */}
            </Space>
          </Radio.Group>
        </Form.Item>
        {/* <Form.Item label="是否公开" required initialValue={1} name={'isOpen'}>
          <Radio.Group style={{ marginTop: 5 }}>
            <Space direction="vertical">
              <Radio value={1}>不公开</Radio>
              <Radio value={2}>
                <div>
                  公开
                  <span style={{ fontSize: 12, color: '#666' }}>
                    公开后优惠券可在商品详情页、购物车展示
                  </span>
                </div>
              </Radio>
            </Space>
          </Radio.Group>
        </Form.Item> */}
        {/* <Form.Item label="领取返回页面" name={'returnUrl'}>
          <Input style={{ width: 300 }}></Input>
        </Form.Item> */}
        <Form.Item
          required
          name={'products'}
          rules={[
            {
              validator(rule, value, callback) {
                if (selectProducts.length === 0 && couponType === CouponType.product) {
                  callback('请选择适用商品');
                }
                callback();
              },
            },
          ]}
          label="适用商品"
        >
          {couponType === CouponType.store ? (
            <div>全部参加</div>
          ) : (
            <div>
              <div style={{ lineHeight: '32px' }}>
                <span>部分参与</span>
                <Button
                  // style={{ marginInline: 10 }}
                  onClick={() => {
                    setSelectProductModalOpen(true);
                  }}
                  type="link"
                >
                  选择参与商品
                </Button>
                <span style={{ fontSize: 12, color: '#666' }}>
                  选中的商品为参与活动的商品；活动期间，参与活动的商品下新增的SKU不会参与到活动中
                </span>
              </div>
              <div>
                {selectProducts.length > 0 ? (
                  <SelectedProductTable
                    removeOne={(productId: string) => {
                      setSelectProducts((item) => {
                        return item.filter((product) => product.id !== productId);
                      });
                    }}
                    removeMultiple={(productIds: string[]) => {
                      setSelectProducts((item) => {
                        return item.filter((product) => !productIds.includes(product.id));
                      });
                    }}
                    selectRows={selectProducts}
                  ></SelectedProductTable>
                ) : null}
              </div>
            </div>
          )}
        </Form.Item>
      </DrawerForm>
      <SelectProductModal
        type="checkbox"
        selectRows={selectProducts}
        open={selectProductModalOpen}
        onCancel={() => {
          setSelectProductModalOpen(false);
        }}
        onOk={(selectRows) => {
          setSelectProducts(selectRows);
          // setSelectProductIds((item) => {
          //   const set = new Set([...item, ...selectRowKeys]);
          //   return [...set];
          // });
          setSelectProductModalOpen(false);
        }}
      />
      <ManualDistributeModal
        showManualModal={showManualModal}
        setShowManualModal={setShowManualModal}
      />
    </PageContainer>
  );
}
