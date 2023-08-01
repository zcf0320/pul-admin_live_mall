import { useRef, useState } from 'react';
import { Button, Col, DatePicker, Form, Input, Row } from 'antd';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { TableListItem } from './data';
import { getExport, getPageList } from './services';
import dayjs from 'dayjs';
import { exportExcelBlob } from '@/pages/utils/export';
import ExportFieldsModel from '@/pages/components/ExportFieldsModel';
import { ExportTypeClassName } from '@/pages/components/ExportFieldsModel/exportType';
import './index.less';

const { RangePicker } = DatePicker;
const Detail = () => {
  // const [time, setTime] = useState<any>(['', '']);
  const [pageation, setPageation] = useState<any>({ current: 1, pageSize: 20 });
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [showExportModel, setShowExportModel] = useState(false);
  // //   时间回调
  // const handChangeTime = (e: any, day: string[]) => {
  //   setTime(day);
  // };
  //   筛选
  const handScreen = () => {
    actionRef.current?.reload();
  };
  // 导出列表
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
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '团长ID',
      width: 50,
      dataIndex: 'teamId',
    },
    {
      title: '结算时间',
      width: 110,
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
  return (
    <div className="Detail">
      <div className="main">
        <div className="main-form">
          <div className="form-time">
            <Form name="basic" initialValues={{ remember: true }} autoComplete="off" form={form}>
              <Row gutter={[30, 20]}>
                <Col span={8}>
                  <Form.Item label="结算时间" name="time">
                    <RangePicker
                      style={{ width: '100%' }}
                      // onChange={(e, day) => handChangeTime(e, day)}
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
          <div className="settlement-form-btn">
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
            setPageation({ current: params?.current, pageSize: params?.pageSize });
            const res = await getPageList({
              pageNo: params?.current || pageation?.current,
              pageSize: params?.pageSize || pageation?.pageSize,
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
  );
};

export default Detail;
