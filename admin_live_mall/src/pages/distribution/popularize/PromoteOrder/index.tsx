import { FC, useEffect, useState } from 'react';
import { history } from '@umijs/max';
import dayjs from 'dayjs';
import {
  PageContainer,
  ProColumns,
  ProForm,
  ProFormDateTimeRangePicker,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { SearchOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Col, Form, message, Row } from 'antd';

import { exportPromoteOrderList, promoteOrderList } from './service';
import { IOrderStatusNum, IPromoteOrderList, IRequestParams, tabPaneList } from './data.d';

import { exportExcelBlob } from '@/pages/utils/export';
import styles from './index.module.less';
import ExportFieldsModel from '@/pages/components/ExportFieldsModel';
import { ExportTypeClassName } from '@/pages/components/ExportFieldsModel/exportType';

const formatText = 'YYYY-MM-DD HH:mm:ss';
const PromoteOrder: FC = () => {
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(false);
  const [requestParams, setRequestParams] = useState<IRequestParams>({
    pageSize: 10,
    pageNo: 1,
  });
  const [totalParams, setTotalParams] = useState<{
    orderStatusTotal: number;
    total: number;
  }>({
    orderStatusTotal: 0,
    total: 0,
  });
  const [refresh, setRefresh] = useState<boolean>(false); // 刷新列表
  const [promoteOrder, setPromoteOrder] = useState<IPromoteOrderList[]>([]);
  const [orderStatusNum, setOrderStatusNum] = useState<IOrderStatusNum>({
    waitPay: 0,
    toReceive: 0,
    toShip: 0,
    closeCount: 0,
    refund: 0,
    finish: 0,
    afterSales: 0,
    all: 0,
  });
  const [showExportModel, setShowExportModel] = useState(false);

  // 获取表单数据
  const getFormValues = () => {
    const { createTime, settleTime, settleStatus = null } = form.getFieldsValue() || {};
    const params = {
      ...form.getFieldsValue(),
      status: activeKey,
      settleStatus: settleStatus !== null ? settleStatus === 1 : undefined,
      settleStartTime: settleTime?.[0] ? dayjs(settleTime?.[0]).format(formatText) : undefined,
      settleEndTime: settleTime?.[1] ? dayjs(settleTime?.[1]).format(formatText) : undefined,
      startTime: createTime?.[0] ? dayjs(createTime?.[0]).format(formatText) : undefined,
      endTime: createTime?.[0] ? dayjs(createTime?.[1]).format(formatText) : undefined,
    };
    delete params.createTime;
    delete params.settleTime;
    return params;
  };

  const getPromoteOrderList = async (): Promise<void> => {
    try {
      setLoading(true);
      const {
        data: {
          promotionOrders,
          promotionOrders: { records = [] },
          waitPay = 0,
          toShip = 0,
          toReceive = 0,
          refund = 0,
          finish = 0,
          closeCount = 0,
          afterSales = 0,
          total = 0,
        },
      } = await promoteOrderList(requestParams);
      setOrderStatusNum({
        waitPay,
        toReceive,
        toShip,
        refund,
        finish,
        closeCount,
        afterSales,
        all: total, // 所有订单数量
      });
      setPromoteOrder(records);
      setTotalParams({
        orderStatusTotal: promotionOrders?.total,
        total,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  // 查询列表
  const onQueryList = () => {
    setRequestParams({
      ...requestParams,
      ...getFormValues(),
      pageNo: 1,
    });
    setRefresh(!refresh);
  };

  // 重置刷新列表
  const onReset = () => {
    form.resetFields();
    setRequestParams({
      status: requestParams.status,
      pageSize: requestParams?.pageSize,
      pageNo: 1,
    });
    setRefresh(!refresh);
  };

  const onExportList = async (excludeColumnFieldNames: string[]) => {
    setRefresh(!refresh);
    exportExcelBlob(
      `推广订单-${dayjs().format('YYYY-MM-DD HH_mm')}`,
      await exportPromoteOrderList({
        ...getFormValues(),
        excludeColumnFieldNames,
      }),
    );
    message.success('导出成功！');
  };
  const handClickTab = (key: string) => {
    setActiveKey(key);
    setRequestParams({
      ...requestParams,
      status: key,
      pageNo: 1,
    });
    setRefresh(!refresh);
  };

  useEffect(() => {
    getPromoteOrderList();
  }, [refresh]);

  const columns: ProColumns[] = [
    {
      title: '订单状态',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      render: (text) => {
        const currentStatus: any = tabPaneList.find((item) => item.key === text);
        return (
          <>
            <Badge color={currentStatus?.color} className={styles.mr10} />
            <span>{currentStatus?.label || ''}</span>
          </>
        );
      },
    },
    {
      title: '买家信息',
      dataIndex: 'createTime',
      align: 'center',
      width: 300,
      render: (text, record) => {
        return (
          <div className={styles.flexColumn}>
            <span>昵称：{record?.userName || '-'}</span>
            <span>ID：{record?.userId || '-'}</span>
            <span>手机号：{record?.userPhone || '-'}</span>
          </div>
        );
      },
    },
    {
      title: '订单号',
      dataIndex: 'orderNo',
      align: 'center',
      width: 200,
      render: (text, record) => {
        return record?.orderNo ? (
          <div className={styles.orderNo}>
            <span className={[styles.orderNumber, styles.mr10].join(' ')}>{text || '-'}</span>
            <SearchOutlined
              className={styles.orderSearch}
              onClick={() =>
                history.push('/Order/OrderManagement/OrderDetail', { orderId: record?.id })
              }
            />
          </div>
        ) : (
          '-'
        );
      },
    },
    {
      title: '结算状态',
      dataIndex: 'settleStatus',
      width: 100,
      align: 'center',
      render: (text, record) => {
        return (
          <>
            <Badge color={record?.settleStatus ? 'green' : 'red'} className={styles.mr10} />
            <span>{record.settleStatus ? '已结算' : '待结算' || '-'}</span>
          </>
        );
      },
    },
    {
      title: '实付金额',
      dataIndex: 'levelName',
      search: false,
      ellipsis: true,
      align: 'center',
      width: 200,
      render: (text, record) => {
        const { payAmount = 0, freight = 0 } = record || {};
        return (
          <div className={styles.orderAmount}>
            <span className={styles.amount}>¥{Number(payAmount)?.toFixed(2)}</span>
            <span className={styles.freight}>（含运费¥{Number(freight)?.toFixed(2)}）</span>
          </div>
        );
      },
    },
    {
      title: '总佣金',
      dataIndex: 'totalCommission',
      align: 'center',
      width: 100,
      render: (text: any, record) => {
        const allowShowTypes = ['WAIT_PAY', 'CLOSE', 'REFUND']; // 待付款， 已取消，已退款无佣金
        return !allowShowTypes.includes(record?.status) ? (
          <span
          // className={styles.commission}
          // onClick={() => {
          //   // history.push('/distribution/popularize/PromoteOrderDetail', {
          //   //   orderId: record?.orderNo,
          //   // });
          //   history.push('/Order/OrderManagement/OrderDetail', { orderId: record?.id });
          // }}
          >
            ¥{text || 0}
          </span>
        ) : (
          '-'
        );
      },
    },
    // {
    //   title: '佣金支出方',
    //   search: false,
    //   align: 'center',
    //   dataIndex: 'expenditures',
    //   ellipsis: true,
    // },
    {
      title: '团长信息',
      search: false,
      align: 'center',
      width: 300,
      render: (text, record) => {
        return (
          <div className={styles.flexColumn}>
            <span>昵称：{record?.teamName || '-'}</span>
            <span>ID：{record?.teamId || '-'}</span>
            <span>手机号：{record?.teamPhone || '-'}</span>
          </div>
        );
      },
    },
    {
      title: '创建时间',
      search: false,
      align: 'center',
      width: 200,
      dataIndex: 'createTime',
      sorter: (a: IPartnerList, b: IPartnerList) =>
        dayjs(a.createTime).valueOf() - dayjs(b.createTime).valueOf(),
    },
    {
      title: '结算时间',
      search: false,
      align: 'center',
      width: 200,
      dataIndex: 'settleTime',
      sorter: (a: IPartnerList, b: IPartnerList) =>
        dayjs(a.settleTime).valueOf() - dayjs(b.settleTime).valueOf(),
    },
  ];
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <Card className={styles.mb20}>
        <ProForm
          layout="inline"
          form={form}
          submitter={false}
          // onValuesChange={(changedValues) => {
          //   // if (tabList.map((item) => item.key)?.includes(changedValues?.settleStatus)) {
          //     // setActiveKey(changedValues?.settleStatus);
          //     // setRefresh(!refresh);
          //   }
          // }}
        >
          <Row gutter={[20, 20]}>
            <Col span={12}>
              <ProFormDateTimeRangePicker
                name="createTime"
                label="创建时间"
                width="lg"
                placeholder={['开始时间', '结束时间']}
              />
            </Col>
            <Col span={8}>
              <ProFormText name="orderNo" label="订单号" placeholder="请输入订单号" />
            </Col>
            <Col span={8}>
              <ProFormText name="buyInfo" label="买家信息" placeholder="备注名/昵称/手机号/ID" />
            </Col>
            <Col span={12}>
              <ProFormDateTimeRangePicker
                name="settleTime"
                label="结算时间"
                width="lg"
                placeholder={['开始时间', '结束时间']}
              />
            </Col>
            <Col span={8}>
              <ProFormSelect
                name="settleStatus"
                label="结算状态"
                options={[
                  {
                    value: 0,
                    label: '待结算',
                  },
                  {
                    value: 1,
                    label: '已结算',
                  },
                ]}
                placeholder="请选择结算状态"
              />
            </Col>
            <Col span={8}>
              <ProFormText name="teamInfo" label="团长信息" placeholder="备注名/昵称/手机号/ID" />
            </Col>
            <Col span={24}>
              <div key="buttons" className={styles.buttons}>
                <Button htmlType="button" key="search" type="primary" onClick={onQueryList}>
                  筛选
                </Button>
                <Button htmlType="button" key="reset" onClick={onReset}>
                  重置
                </Button>
                <Button htmlType="button" key="export" onClick={() => setShowExportModel(true)}>
                  导出
                </Button>
                {/*<Button htmlType="button" key="search3">*/}
                {/*  查看已导出列表*/}
                {/*</Button>*/}
              </div>
            </Col>
          </Row>
        </ProForm>
      </Card>
      <Card size="small">
        <ProTable
          search={false}
          options={false}
          rowKey="id"
          headerTitle="推广订单"
          loading={loading}
          scroll={{ x: 1000, y: promoteOrder.length > 8 ? '52vh' : undefined }}
          toolbar={{
            menu: {
              type: 'tab',
              activeKey,
              items: tabPaneList?.map((item) => ({
                ...item,
                label: `${item.label}(${(orderStatusNum as any)[item?.type] || 0})`,
              })),
              onChange: (key) => handClickTab(key as string),
            },
          }}
          pagination={{
            total: totalParams.orderStatusTotal,
            pageSize: requestParams?.pageSize,
            current: requestParams?.pageNo,
            onChange: (pageNo: number, pageSize: number) => {
              setRequestParams({ ...requestParams, pageNo, pageSize });
              setRefresh(!refresh);
            },
          }}
          columns={columns}
          dataSource={promoteOrder}
        />
      </Card>
      <ExportFieldsModel
        showExportModel={showExportModel}
        setShowExportModel={setShowExportModel}
        fieldType={ExportTypeClassName.PromoteOrderToExcel}
        setSelectFields={(values) => onExportList(values)}
      />
    </PageContainer>
  );
};

export default PromoteOrder;
