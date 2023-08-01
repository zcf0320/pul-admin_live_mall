import { useEffect, useRef, useState } from 'react';
import { Button, Col, DatePicker, Form, Input, Row } from 'antd';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { TableListItem } from './data';
import dayjs from 'dayjs';
import { useLocation } from '@@/exports';
import { exportExcelBlob } from '@/pages/utils/export';
import { getPageList, getExport } from './service';
import ExportFieldsModel from '@/pages/components/ExportFieldsModel';
import { ExportTypeClassName } from '@/pages/components/ExportFieldsModel/exportType';
import './index.less';

const { RangePicker } = DatePicker;
const SettlementDetails = () => {
  // const [time, setTime] = useState<any>(['', '']);
  const [form] = Form.useForm();
  const { state }: any = useLocation();
  const actionRef = useRef<ActionType>();
  const [showExportModel, setShowExportModel] = useState(false);
  //   时间回调
  // const handChangeTime = (e: any, day: string[]) => {
  //   setTime(day);
  // };
  //   筛选
  const handScreen = () => {
    actionRef.current?.reload();
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '结算时间',
      width: 80,
      dataIndex: 'settleTime',
      valueType: 'date',
    },
    {
      title: '订单号',
      dataIndex: 'orderNo',
      width: 80,
    },
    {
      title: '人员账号',
      width: 80,
      dataIndex: 'teamName',
      render: (text, record) => {
        return (
          <div>
            <div>{record?.teamName}</div>
            <div style={{ margin: '5px 0 0 0' }}>{record?.teamPhone}</div>
          </div>
        );
      },
    },
    {
      title: '结算金额',
      width: 80,
      dataIndex: 'realCommission',
    },
  ];
  const onExportList = async (excludeColumnFieldNames: string[]) => {
    const [startTime, endTime] = form.getFieldValue('time') || [];
    let params = {
      ...form.getFieldsValue(),
      startTime: startTime ? dayjs(startTime).format('YYYY-MM-DD HH:mm:ss') : '',
      endTime: endTime ? dayjs(endTime).format('YYYY-MM-DD HH:mm:ss') : '',
      excludeColumnFieldNames,
    };
    delete params.time;
    getExport({ ...params })
      .then((res) => {
        exportExcelBlob(`结算明细-${dayjs().format('YYYY-MM-DD HH_mm')}`, res);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    let startTime = dayjs(state?.time?.dayTime).startOf('month');
    let endTime = dayjs(state?.time?.dayTime).endOf('month');

    if (state?.time) {
      if (state?.time?.type === 'day') {
        form.setFieldValue('time', [
          dayjs(state?.time?.dayTime).startOf('day'),
          dayjs(state?.time?.dayTime).endOf('day'),
        ]);
        // setTime([dayjs(state?.time).format('YYYY-MM-DD'), dayjs(state?.time)]);
      } else if (state?.time?.type === 'month') {
        form.setFieldValue('time', [startTime, endTime]);
        // setTime([startTime, endTime]);
      }
    }
  }, [state?.time]);
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <div className="SettlementDetails">
        <div className="main">
          <div className="main-form">
            <div className="form-time">
              <Form name="basic" initialValues={{ remember: true }} autoComplete="off" form={form}>
                <Row gutter={[30, 20]}>
                  <Col span={8}>
                    <Form.Item label="结算时间" name="time">
                      <RangePicker
                        // onChange={(e, day) => handChangeTime(e, day)}
                        style={{ width: '100%' }}
                        showTime
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="订单号" name="orderNo">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="人员账号" name="teamInfo">
                      <Input placeholder="昵称/ID" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
            <div className="form-settlementDetails-btn">
              <Button type="primary" onClick={() => handScreen()}>
                筛选
              </Button>
              <Button
                onClick={() => {
                  form.resetFields();
                  // setTime(['', '']);
                  actionRef.current?.reload();
                }}
              >
                重置
              </Button>
              <Button onClick={() => setShowExportModel(true)}>导出</Button>
            </div>
          </div>
        </div>
        <div className="table-content">
          <ProTable<TableListItem>
            pagination={{
              showSizeChanger: true,
            }}
            actionRef={actionRef}
            // rowKey="settleTime"
            scroll={{ x: 1000 }}
            options={false}
            search={false}
            columns={columns}
            request={async (params) => {
              const [startTime, endTime] = form.getFieldValue('time') || [];
              let param = {
                ...form.getFieldsValue(),
                startTime: startTime ? dayjs(startTime).format('YYYY-MM-DD HH:mm:ss') : '',
                endTime: endTime ? dayjs(endTime).format('YYYY-MM-DD HH:mm:ss') : '',
              };
              delete param.time;

              const res = await getPageList({
                pageNo: params?.current,
                pageSize: params?.pageSize,
                ...param,
              });
              const { data } = res;
              return Promise.resolve({
                data: data?.records,
                success: true,
                total: data?.total,
              });
            }}
          />
        </div>
        <ExportFieldsModel
          showExportModel={showExportModel}
          setShowExportModel={setShowExportModel}
          fieldType={ExportTypeClassName.SettlementDetailsToExcel}
          setSelectFields={(values) => onExportList(values)}
        />
      </div>
    </PageContainer>
  );
};

export default SettlementDetails;
