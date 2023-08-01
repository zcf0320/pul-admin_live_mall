import { FC, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { history } from '@umijs/max';
import {
  PageContainer,
  ProCard,
  ProColumns,
  ProForm,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Avatar, Button, Col, Form, message, Row, Tooltip } from 'antd';
import { QuestionCircleOutlined, UserOutlined } from '@ant-design/icons';

import QuotaModel from '@/pages/capital/billManagement/CustomerWallet/QuotaModel';
import { customerWallet, exportCustomerWallet } from './services';
import { exportExcelBlob } from '@/pages/utils/export';
import ExportFieldsModel from '@/pages/components/ExportFieldsModel';
import { ExportTypeClassName } from '@/pages/components/ExportFieldsModel/exportType';
import styles from './index.module.less';

const CustomerWallet: FC = () => {
  const [form] = Form.useForm();
  const [requestParams, setRequestParams] = useState<IRequestParam>({
    pageNo: 1,
    pageSize: 10,
  });
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [customerWalletList, setCustomerWallerList] = useState<ICustomerWalletList[]>([]);
  const [showQuotaModel, setShowQuotaModel] = useState<boolean>(false); // 显示调整余额弹窗
  const [columnParam, setColumnsParams] = useState<any>({}); // 点击当前列的数据
  const [showExportModel, setShowExportModel] = useState(false);
  const setQuotaType = (type: string, columnsRecord: ICustomerWalletList) => {
    setColumnsParams({
      ...columnsRecord,
      type,
    });
    setShowQuotaModel(true);
  };

  const columns: ProColumns[] = [
    // {
    //   title: '钱包ID',
    //   dataIndex: 'id',
    //   align: 'center',
    // },
    {
      title: '客户信息',
      dataIndex: 'userName',
      align: 'center',
      width: 300,
      ellipsis: true,
      render: (_: any, record: ICustomerWalletList) => (
        <div className={styles.user}>
          <Avatar
            size={50}
            src={record?.headImage}
            icon={<UserOutlined />}
            className={styles.avatar}
          />
          <div className={styles.userInfo}>
            <span>昵称：{record?.userName ?? '-'}</span>
            <span>ID：{record?.userId ?? '-'}</span>
            <span>手机号：{record?.phone ?? '-'}</span>
          </div>
        </div>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'registerTime',
      align: 'center',
      showSorterTooltip: false,
      sorter: {
        compare: (a, b) => dayjs(a.registerTime).valueOf() - dayjs(b.registerTime).valueOf(),
      },
    },
    {
      title: (
        <>
          <span>余额</span>&nbsp;
          <Tooltip title="商城客户的余额，在商城消费时，可用余额支付">
            <QuestionCircleOutlined />
          </Tooltip>
        </>
      ),
      dataIndex: 'balanceMoney',
      showSorterTooltip: false,
      align: 'center',
      sorter: {
        compare: (a, b) => a.balanceMoney - b.balanceMoney,
      },
      render: (_: any, record: ICustomerWalletList) => <div>¥{record?.balanceMoney}</div>,
    },
    // {
    //   title: (
    //     <>
    //       <span>佣金账户</span>&nbsp;
    //       <Tooltip title="商城分销体系内，合伙人、团长、客户经理角色的佣金收入账户，佣金可申请提现，可转入余额消费">
    //         <QuestionCircleOutlined />
    //       </Tooltip>
    //     </>
    //   ),
    //   dataIndex: 'consumptionTime',
    //   showSorterTooltip: false,
    //   align: 'center',
    //   sorter: {
    //     compare: (a, b) => a.consumptionTime - b.consumptionTime,
    //   },
    //   render: (_: any, record: any) => <div>¥{record?.consumptionTime}</div>,
    // },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      valueType: 'option',
      align: 'center',
      render: (_, record: any) => (
        <>
          <div className={styles.option}>
            <Button
              type="link"
              onClick={() =>
                history.push('/capital/billManagement/WalletDetail', {
                  parentId: record?.userId,
                  ...record,
                })
              }
            >
              详情
            </Button>
            <Button type="link" onClick={() => setQuotaType('storedValue', record)}>
              调整余额
            </Button>
            {/*{showQuotaModel ? (*/}
            {/*  <Button type="link">调整</Button>*/}
            {/*) : (*/}
            {/*  <Popover*/}
            {/*    placement="bottomLeft"*/}
            {/*    content={*/}
            {/*      <div className={styles.Popover}>*/}
            {/*        <span onClick={() => setQuotaType('storedValue', record)}>余额</span>*/}
            {/*        /!*<span onClick={() => setQuotaType('commission', record)}>佣金账户余额</span>*!/*/}
            {/*      </div>*/}
            {/*    }*/}
            {/*    trigger="click"*/}
            {/*  >*/}
            {/*    <Button type="link">调整余额</Button>*/}
            {/*  </Popover>*/}
            {/*)}*/}
          </div>
        </>
      ),
    },
  ];

  const getCustomerWalletList = async (): Promise<void> => {
    try {
      setLoading(true);
      const {
        data: { records = [], total = 0 },
      } = await customerWallet(requestParams);
      setCustomerWallerList(records);
      setTotal(total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // 查询列表
  const onQueryList = (): void => {
    setRequestParams({
      ...requestParams,
      ...form.getFieldsValue(),
      pageNo: 1,
    });
    setRefresh(!refresh);
  };
  // 重置表单
  const onReset = () => {
    form.resetFields();
    setRequestParams({
      pageNo: 1,
      pageSize: 10,
    });
    setRefresh(!refresh);
  };

  const onExportList = async (excludeColumnFieldNames: string[]) => {
    // setRefresh(!refresh);
    exportExcelBlob(
      `客户钱包列表-${dayjs().format('YYYY-MM-DD HH_mm')}`,
      await exportCustomerWallet({ ...form.getFieldsValue(), excludeColumnFieldNames }),
    );
    message.success('导出成功！');
  };

  const onValidatorMinValue = (_: any, value: string, callback: (message?: string) => void) => {
    const maxValue = requestParams.maxValue;
    if (!maxValue && !value) {
      callback();
    }
    if (+value < 0) {
      callback('余额需要大于0');
    }
    if (maxValue && !value) {
      callback('请填写初始余额');
    }
    if (maxValue && value >= maxValue) {
      callback('初始余额应小于截止余额');
    } else {
      callback();
    }
  };
  const onValidatorMaxValue = (_: any, value: string, callback: (message?: string) => void) => {
    const minValue = requestParams.minValue;
    if (!minValue && !value) {
      callback();
    }
    if (+value < 0) {
      callback('余额需要大于0');
    }
    if (minValue && !value) {
      callback('请填写截止余额');
    }
    if (minValue && value <= minValue) {
      callback('截止余额应大于初始余额');
    } else {
      callback();
    }
  };

  useEffect(() => {
    form.validateFields().then(() => {
      getCustomerWalletList();
    });
  }, [refresh]);

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <ProCard size="small">
        <ProForm
          layout="inline"
          className={styles.mg20}
          form={form}
          autoFocusFirstInput={false}
          onValuesChange={async (changedValues, values) => {
            setRequestParams({
              ...requestParams,
              ...values,
            });
            await form.validateFields();
          }}
          submitter={{
            render: () => {
              return [
                <div key="buttons" className={styles.buttons}>
                  <Button htmlType="button" key="search" type="primary" onClick={onQueryList}>
                    筛选
                  </Button>
                  <Button htmlType="button" key="reset" onClick={onReset}>
                    重置
                  </Button>
                  <Button
                    htmlType="button"
                    key="export"
                    // onClick={onExportCustomerWallet}
                    onClick={() => setShowExportModel(true)}
                  >
                    导出
                  </Button>
                  {/*<Button htmlType="button" key="search3">*/}
                  {/*  查看已导出列表*/}
                  {/*</Button>*/}
                </div>,
              ];
            },
          }}
        >
          <Row gutter={[20, 10]}>
            <Col span={14}>
              <ProFormText
                label="客户信息"
                name="customerInfo"
                placeholder="备注名/昵称/手机号/ID"
              />
            </Col>
            <Col span={10}>
              <div className={styles.amountFormItem}>
                <ProFormText
                  label="余额"
                  name="minValue"
                  placeholder="请填写初始余额"
                  required={false}
                  rules={[
                    {
                      required: true,
                      validator: onValidatorMinValue,
                    },
                  ]}
                />
                <span className={styles.mr10}>- </span>
                <ProFormText
                  name="maxValue"
                  required={false}
                  placeholder="请填写截止余额"
                  rules={[
                    {
                      // required:
                      required: true,
                      // message: '请填写截止余额',
                      validator: onValidatorMaxValue,
                    },
                  ]}
                />
              </div>
            </Col>
            {/*<div className={styles.amountFormItem}>*/}
            {/*  <ProFormText*/}
            {/*    label="佣金余额"*/}
            {/*    name="commission1"*/}
            {/*    required={false}*/}
            {/*    rules={[{ required: requestParams.commission2, message: '请填写初始佣金' }]}*/}
            {/*  />*/}
            {/*  <span className={styles.mr10}>- </span>*/}
            {/*  <ProFormText*/}
            {/*    name="commission2"*/}
            {/*    required={false}*/}
            {/*    rules={[{ required: requestParams.commission1, message: '请填写截止佣金' }]}*/}
            {/*  />*/}
            {/*</div>*/}
          </Row>
        </ProForm>
        <ProTable
          rowKey="id"
          scroll={{ x: 1200, y: customerWalletList.length > 5 ? '60vh' : undefined }}
          search={false}
          options={false}
          columns={columns}
          loading={loading}
          dataSource={customerWalletList}
          pagination={{
            total,
            pageSize: requestParams.pageSize,
            current: requestParams.pageNo,
            onChange: (pageNo, pageSize) => {
              setRequestParams({
                ...requestParams,
                pageNo,
                pageSize,
              });
              setRefresh(!refresh);
            },
          }}
        />
      </ProCard>
      <QuotaModel
        {...columnParam}
        visible={showQuotaModel}
        setShowQuotaModel={() => {
          setShowQuotaModel(false);
          setRefresh(!refresh);
        }}
      />
      <ExportFieldsModel
        showExportModel={showExportModel}
        setShowExportModel={setShowExportModel}
        fieldType={ExportTypeClassName.CustomerWalletToExcel}
        setSelectFields={(values) => onExportList(values)}
      />
    </PageContainer>
  );
};

export default CustomerWallet;
