import { useRef, useState } from 'react';
import { Avatar, Button, Card, Form, Input, message } from 'antd';
import dayjs from 'dayjs';
import { FormInstance } from 'antd/es/form';
import { ActionType, ModalForm, ProColumns, ProTable } from '@ant-design/pro-components';
import { UserOutlined } from '@ant-design/icons';
import { markDistribute, markReject, postExport, withdrawalApply } from '../services';
import { exportExcelBlob } from '@/pages/utils/export';
import ExportFieldsModel from '@/pages/components/ExportFieldsModel';
import { ExportTypeClassName } from '@/pages/components/ExportFieldsModel/exportType';
import './index.less';

import styles from './index.less';

interface IProps {
  tabKey: string;
  withdrawStatus: number[];
}

const { TextArea } = Input;

const Application = (props: IProps) => {
  const { tabKey = 'APPLICATION', withdrawStatus } = props || {};

  const tableRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const [showModel, setShowModel] = useState<boolean>(false);
  const [columnRecords, setColumnRecords] = useState<IColumnRecord>({
    selectArr: [],
  });
  const [templateParams, setTemplateParams] = useState<IParams>({
    pageSize: 10,
    pageNo: 1,
  });
  const [showExportModel, setShowExportModel] = useState(false);
  const getApplicationList = async (params: IParams) => {
    const {
      data: { records = [], total },
    } = await withdrawalApply(params);
    return {
      data: records,
      success: true,
      total,
    };
  };

  // 操作

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: IRecord[]) => {
      setColumnRecords({
        ...columnRecords,
        selectArr: selectedRows,
      });
    },
  };

  const onSubmit = async (values: any) => {
    const requestMethod = columnRecords?.operateMethod === 'mark' ? markDistribute : markReject;
    await requestMethod({
      ...values,
      ids: columnRecords?.selectArr?.map((item) => item.id),
    });
    setShowModel(false);
    message.success(`${columnRecords?.operateType}成功`);
    //清空数据
    setColumnRecords({});
    tableRef.current?.reload();
  };

  // 批量操作
  const onBatchOperate = (typeObj: { operateType: string; operateMethod: string }): any => {
    if (!columnRecords?.selectArr?.length) return message.error('请至少选择一条数据');
    setShowModel(true);
    setColumnRecords({
      ...columnRecords,
      ...typeObj,
    });
  };
  const onExportList = (excludeColumnFieldNames: string[]) => {
    postExport({ ...templateParams, excludeColumnFieldNames }).then((res) => {
      exportExcelBlob(
        `${
          tabKey === 'APPLICATION'
            ? '提现申请'
            : tabKey === 'LOG'
            ? '提现记录'
            : tabKey === 'REJECT'
            ? '驳回记录'
            : null
        }-${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
        res,
      );
    });
  };
  const renderExport = (form: any) => {
    return (
      <Button
        // onClick={() => {
        //   // TODO
        //   postExport(templateParams).then((res) => {
        //     exportExcelBlob(`${dayjs().format('YYYY-MM-DD HH:mm:ss')}-结算列表`, res);
        //   });
        // }}
        onClick={() => {
          setShowExportModel(true);
          form?.submit();
        }}
        type="primary"
      >
        导出
      </Button>
    );
  };

  const columns: ProColumns<IRecord>[] = [
    {
      title: '客户信息',
      dataIndex: 'customerInfo',
      align: 'center',
      width: 300,
      ellipsis: true,
      render: (text, record) => {
        const { userName = '', userPhone = '', headImage } = record || {};
        return (
          <div className="user">
            <Avatar size={50} src={headImage} icon={<UserOutlined />} className="avatar" />
            <div className="userInfo">
              <span>名字：{userName ?? '-'}</span>
              <span>手机号：{userPhone ?? '-'}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      search: false,
      align: 'center',
      width: 200,
      ellipsis: true,
    },
    tabKey !== 'APPLICATION'
      ? {
          title: `${tabKey === 'LOG' ? '发放时间' : '驳回时间'}`,
          dataIndex: `${tabKey === 'LOG' ? 'passTime' : 'rejectionTime'}`,
          align: 'center',
          search: false,
          width: 200,
          ellipsis: true,
        }
      : {
          search: false,
          hideInTable: true,
        },
    {
      title: `${
        tabKey === 'APPLICATION' ? '申请时间' : tabKey === 'LOG' ? '发放时间' : '驳回时间'
      }`,
      dataIndex: 'time',
      valueType: 'dateTimeRange',
      hideInTable: true,
      align: 'center',
      search: {
        transform: (record) => {
          return {
            startTime: record[0],
            endTime: record[1],
          };
        },
      },
    },

    {
      title: '提现方式',
      dataIndex: 'dealChannel',
      valueType: 'select',
      align: 'center',
      width: 150,
      ellipsis: true,
      hideInTable: true,
      valueEnum: {
        1: '支付宝',
      },
    },
    {
      title: '提现金额/手续费',
      dataIndex: 'amount',
      align: 'center',
      search: false,
      width: 200,
      render: (_, record) => {
        return (
          <div>
            <span>{record?.amount ?? '-'}</span>/<span>{record?.charge ?? '-'}</span>
          </div>
        );
      },
    },
    {
      title: '提现方式',
      dataIndex: 'dealChannel',
      align: 'center',
      search: false,
      width: 150,
      valueEnum: {
        1: '支付宝',
      },
    },
    {
      title: '收款人信息',
      dataIndex: 'payee',
      align: 'center',
      width: 200,
      render: (text, record) => {
        const { name = '', account = '' } = record || {};
        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span>账号：{account ?? '-'}</span>
              <span>名字：{name ?? '-'}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: tabKey === 'LOG' ? '备注' : '驳回原因',
      dataIndex: 'remark',
      align: 'center',
      search: false,
      ellipsis: true,
      width: 200,
      hideInTable: tabKey === 'APPLICATION',
    },
    tabKey === 'APPLICATION'
      ? {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          search: false,
          fixed: 'right',
          render: (_, record) => {
            const isDisabled: boolean | undefined = columnRecords?.selectArr?.some(
              (item: IRecord) => item.id === record?.id,
            );
            return (
              <div>
                <Button
                  disabled={isDisabled as boolean}
                  type="link"
                  onClick={() => {
                    setShowModel(true);
                    setColumnRecords({
                      selectArr: [record],
                      operateType: '标记',
                      operateMethod: 'mark',
                    });
                  }}
                >
                  标记
                </Button>
                ｜
                <Button
                  type="link"
                  disabled={isDisabled as boolean}
                  danger
                  onClick={() => {
                    setShowModel(true);
                    setColumnRecords({
                      selectArr: [record],
                      operateType: '驳回',
                      operateMethod: 'reject',
                    });
                  }}
                >
                  驳回
                </Button>
              </div>
            );
          },
        }
      : {
          search: false,
          hideInTable: true,
        },
  ];

  return (
    <div className={styles.application}>
      <Card size="small">
        <ProTable<IRecord>
          columns={columns}
          scroll={{ x: 1200 }}
          rowSelection={tabKey === 'APPLICATION' ? rowSelection : undefined}
          rowKey="id"
          actionRef={tableRef}
          headerTitle={
            tabKey === 'APPLICATION' ? (
              <div className="table-btn">
                <Button
                  key="btn1"
                  type="primary"
                  size="small"
                  disabled={!columnRecords?.selectArr?.length}
                  onClick={() => onBatchOperate({ operateType: '批量标记', operateMethod: 'mark' })}
                >
                  批量标记
                </Button>
                {/*<Button>批量发放</Button>*/}
                <Button
                  key="btn2"
                  type="primary"
                  size="small"
                  danger
                  disabled={!columnRecords?.selectArr?.length}
                  className="table-btn-reject"
                  style={{ marginLeft: 20 }}
                  onClick={() =>
                    onBatchOperate({ operateType: '批量驳回', operateMethod: 'reject' })
                  }
                >
                  批量驳回
                </Button>
              </div>
            ) : null
          }
          search={{
            labelWidth: 'auto',
            span: 8,
            collapsed: false,
            collapseRender: () => null,
            optionRender: (searchConfig, { form }, dom) => [...dom, renderExport(form)],
          }}
          params={{ status: withdrawStatus }}
          options={false}
          pagination={{
            pageSize: templateParams?.pageSize,
          }}
          request={(params): any => {
            setTemplateParams(params as IParams);
            return getApplicationList(params as IParams);
          }}
        />
      </Card>

      <ModalForm
        title="批量操作"
        formRef={formRef}
        width={500}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
        open={showModel}
        onOpenChange={(visible) => {
          setShowModel(visible);
          formRef.current?.resetFields();
        }}
        onFinish={onSubmit}
      >
        <div className="operateModal">
          <div>操作：{columnRecords?.operateType || ''}</div>
          {/*<div className="userList">*/}
          {/*  用户列表：*/}
          {/*  <div className="userItem">*/}
          {/*    {columnRecords?.selectArr?.map((item: any) => {*/}
          {/*      return (*/}
          {/*        <div key={item?.id}>*/}
          {/*          {item?.userName}（{item?.userPhone}）*/}
          {/*        </div>*/}
          {/*      );*/}
          {/*    })}*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
        <Form.Item
          label="备注"
          name="remark"
          rules={[
            {
              required: columnRecords?.operateMethod === 'reject',
              message: '请输入驳回原因！',
            },
          ]}
        >
          <TextArea showCount maxLength={50} allowClear rows={4} />
        </Form.Item>
      </ModalForm>
      <ExportFieldsModel
        showExportModel={showExportModel}
        setShowExportModel={setShowExportModel}
        fieldType={ExportTypeClassName.WithdrawalRecordToExcel}
        setSelectFields={(values) => onExportList(values)}
      />
    </div>
  );
};
export default Application;
