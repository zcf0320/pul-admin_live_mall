import { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  Pagination,
  Row,
  Table,
  Tooltip,
} from 'antd';
import dayjs from 'dayjs';
import { getSubtractDayTime, todayEndTime } from '@/pages/utils/getSubtractDayTime';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { DataType } from './data';
import { history } from '@umijs/max';
import { getExport, getPageList } from './services';
import { exportExcelBlob } from '@/pages/utils/export';
import ExportFieldsModel from '@/pages/components/ExportFieldsModel';
import { ExportTypeClassName } from '@/pages/components/ExportFieldsModel/exportType';
import './index.less';

const { RangePicker } = DatePicker;

const add = (
  <div style={{ color: '#000' }}>
    <div>新增客户数:</div>
    <div>统计时间内，所有团长直接发展的新客户数汇总(含已成为团长的客户)</div>
    <div style={{ margin: '10px 0 0 0' }}>新增团长数:</div>
    <div>在统计时间内通过团长审核的人数</div>
  </div>
);
const promoteOrders = (
  <div style={{ color: '#000' }}>
    <div>推广订单数:</div>
    <div>在统计时间内付款的推广订单数(不去除已退款订单)</div>
    <div style={{ margin: '10px 0 0 0' }}>推广订单额:</div>
    <div>在统计时间内付款的推广订单的金额汇总(不去除已退款订单)</div>
  </div>
);
const totalCommission = (
  <div style={{ color: '#000' }}>
    <div>总佣金:</div>
    <div>
      在统计时间内成功付款的推广订单，当前可结算的佣金总额(含待结算和已结算)，结算前
      发生退款的订单，会重新核算佣金
    </div>
  </div>
);
const definition = (
  <div style={{ color: '#000' }}>
    <div>邀请人数:</div>
    <div>统计时间内，团长直接发展的下级团长数(按通过审核时间统计)</div>
    <div style={{ margin: '10px 0 0 0' }}>累计客户:</div>
    <div>统计时间内，团长发展过的直接客户数(含已失效和已成为团长的客户)</div>
    <div style={{ margin: '10px 0 0 0' }}>直推订单数:</div>
    <div>统计时间内付款，且团长直接推广的订单数(不去除已退款订单)</div>
    <div style={{ margin: '10px 0 0 0' }}>直推订单额:</div>
    <div>统计时间内付款，且团长直接推广的订单金额汇总(不去除已退款订单)</div>
    <div style={{ margin: '10px 0 0 0' }}>总佣金:</div>
    <div>
      统计时间内付款，且可结算给团长的佣金总额(含已结算和待结算)，结算前发生退款的订
      单，会重新核算佣金
    </div>
  </div>
);
const items = [
  {
    name: '昨天',
    time: 1,
  },
  {
    name: '近七天',
    time: 7,
  },
  {
    name: '近30天',
    time: 30,
  },
];
const PerformanceStatistics = () => {
  const [time, setTime] = useState<any>(['', '']);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [pageation, setPageation] = useState({ current: 1, pageSize: 10 });
  const [total, setTotal] = useState(0);
  const [data, setData] = useState();
  const [moneyData, setMoneyData] = useState({
    customerTotal: 0,
    orderAmountTotal: 0,
    orderTotal: 0,
    settledCommissionTotal: '',
    teamTotal: 0,
    toBeSettledCommissionTotal: '',
  });
  const [showExportModel, setShowExportModel] = useState(false);
  const [form] = Form.useForm();
  //   时间回调
  const handChangeTime = (e: any, day: string[]) => {
    setTime(day);
  };
  //   筛选
  const handScreen = () => {
    getPageList({
      pageNo: pageation.current,
      pageSize: pageation.pageSize,
      startTime: time[0] !== '' ? dayjs(time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
      endTime: time[1] !== '' ? dayjs(time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
      teamInfo: form.getFieldsValue().teamInfo,
    })
      .then((res) => {
        const {
          data: { statisticsList },
        } = res;
        setData(statisticsList?.records);
        // setPageation({
        //   current: statisticsList?.current,
        //   pageSize: statisticsList?.size,
        // });
        setTotal(statisticsList?.total);
      })
      .catch((error) => {
        console.log(error);
      });
    // form.resetFields();
  };
  //  设置时间
  const setFormTime = (timeNum: number) => {
    setActiveIndex(timeNum);
    let currentTime = null;
    currentTime = getSubtractDayTime(timeNum);
    if (timeNum !== 1) {
      currentTime = {
        ...currentTime,
        endTime: todayEndTime,
      };
    }
    setTime([currentTime.startTime, currentTime.endTime]);
    form.setFieldValue('time', [dayjs(currentTime.startTime), dayjs(currentTime.endTime)]);
  };
  //   分页器
  const onChangePageation = (page: number, pageSize: number) => {
    setPageation({ current: page, pageSize });
  };
  console.log(pageation.current, pageation.pageSize);

  const columns: ColumnsType<DataType> = [
    {
      title: '团长信息',
      dataIndex: 'name',
      width: 220,
      fixed: 'left',
      key: 'name',
      render: (text, record) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              style={{ width: 50, height: 50, borderRadius: '50%' }}
              src={record.image}
              preview={false}
            />

            <div style={{ marginLeft: 8, color: 'rgba(0, 0, 0, 0.65)' }}>
              <div>{record.name}</div>
              <div>{record.phone}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: '邀请人数',
      dataIndex: 'inviteCount',
      key: 'inviteCount',
    },
    {
      title: '累计客户',
      dataIndex: 'customerCount',
      key: 'customerCount',
    },
    {
      title: '直推订单数',
      key: 'directOrderNum',
      dataIndex: 'directOrderNum',
    },
    {
      title: '直推订单额',
      dataIndex: 'directOrderAmount',
      key: 'directOrderAmount',

      render: (text, record) => {
        return <div>¥{record.directOrderAmount}</div>;
      },
    },
    {
      title: '分佣订单数',
      dataIndex: 'indirectOrderNum',
      key: 'indirectOrderNum',
    },
    {
      title: '分佣订单额',
      dataIndex: 'indirectOrderAmount',
      key: 'indirectOrderAmount',

      render: (text, record) => {
        return <div>¥{record.indirectOrderAmount}</div>;
      },
    },
    {
      title: '总佣金',
      dataIndex: 'settledCommission',
      key: 'settledCommission',
      render: (text, record) => {
        return (
          <div>¥{Number(record.settledCommission) + Number(record.toBeSettledCommission)}</div>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <div>
          <a
            onClick={() => {
              history.push('/distribution/popularize/PopularizeDetail', {
                tabKey: 'ALL',
                parentId: record?.id,
              });
            }}
          >
            详情
          </a>
        </div>
      ),
    },
  ];

  // 获取数据
  const getData = () => {
    getPageList({ pageNo: pageation.current, pageSize: pageation.pageSize })
      .then((res) => {
        const {
          data: { statisticsList },
        } = res;
        const { data } = res;
        setData(statisticsList?.records);
        // setPageation({
        //   current: statisticsList?.current,
        //   pageSize: statisticsList?.size,
        // });
        setTotal(statisticsList?.total);

        setMoneyData({
          customerTotal: data?.customerTotal,
          orderAmountTotal: data?.orderAmountTotal,
          orderTotal: data?.orderTotal,
          settledCommissionTotal: data?.settledCommissionTotal,
          teamTotal: data?.teamTotal,
          toBeSettledCommissionTotal: data?.toBeSettledCommissionTotal,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const onExportList = async (excludeColumnFieldNames: string[]) => {
    getExport({
      pageNo: pageation.current,
      pageSize: pageation.pageSize,
      startTime: time[0] !== '' ? dayjs(time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
      endTime: time[1] !== '' ? dayjs(time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
      teamInfo: form.getFieldsValue().teamInfo,
      excludeColumnFieldNames,
    })
      .then((res) => {
        exportExcelBlob(`业绩统计-${dayjs().format('YYYY-MM-DD HH_mm')}`, res);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getData();
  }, [pageation.current]);
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <div className="PerformanceStatistics">
        <div className="main-form">
          <div className="form-time">
            <Form
              name="basic"
              initialValues={{ remember: true }}
              style={{ width: '100%' }}
              autoComplete="off"
              form={form}
            >
              <Row gutter={[30, 20]}>
                <Col span={12}>
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <Form.Item
                      label="起止时间"
                      name="time"
                      // rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                      <RangePicker onChange={(e, day) => handChangeTime(e, day)} showTime />
                    </Form.Item>
                    <div>
                      {items.length &&
                        items.map((v, i) => {
                          return (
                            <span
                              style={{ margin: '0 10px' }}
                              key={i}
                              className={`${activeIndex === v.time ? 'active' : ''}`}
                              onClick={() => setFormTime(v.time)}
                            >
                              {v.name}
                            </span>
                          );
                        })}
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <Form.Item label="团长信息" name="teamInfo">
                    <Input placeholder="备注名/昵称/手机号/ID" />
                  </Form.Item>
                </Col>
                <Col span={4}></Col>
              </Row>
            </Form>
          </div>

          <div className="performance-form-btn">
            <Button type="primary" onClick={() => handScreen()}>
              筛选
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
                setActiveIndex(0);
                getData();
                setTime(['', '']);
              }}
            >
              重置
            </Button>
            <Button
              // onClick={() => {
              //   getExport({
              //     pageNo: pageation.current,
              //     pageSize: pageation.pageSize,
              //     startTime: time[0] !== '' ? dayjs(time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
              //     endTime: time[1] !== '' ? dayjs(time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
              //     teamInfo: form.getFieldsValue().teamInfo,
              //   })
              //     .then((res) => {
              //       exportExcelBlob('业绩统计导出', res);
              //     })
              //     .catch((error) => {
              //       console.log(error);
              //     });
              // }}
              onClick={() => setShowExportModel(true)}
            >
              导出
            </Button>
          </div>
        </div>
        <div className="main-card">
          <div className="main-card-item">
            <div>
              <span className="text-color">新增</span>
              <Tooltip
                title={add}
                color="#fff"
                overlayInnerStyle={{ padding: '20px', width: '500px' }}
              >
                <QuestionCircleOutlined style={{ color: 'rgba(0,0,0,.65)' }} />
              </Tooltip>
            </div>
            <div className="main-card-item-conter">
              <span className="text-color">客户数:</span>
              <span className="text-weight">{moneyData?.customerTotal}</span>
            </div>
            <div>
              <span className="text-color">团长数:</span>
              <span className="text-weight">{moneyData?.teamTotal}</span>
            </div>
          </div>
          <div className="main-card-item">
            <div>
              <span className="text-color">推广订单</span>
              <Tooltip
                title={promoteOrders}
                color="#fff"
                overlayInnerStyle={{ padding: '20px', width: '500px' }}
              >
                <QuestionCircleOutlined style={{ color: 'rgba(0,0,0,.65)' }} />
              </Tooltip>
            </div>
            <div className="main-card-item-conter">
              <span className="text-color">数量 (笔):</span>
              <span className="text-weight">{moneyData?.orderTotal}</span>
            </div>
            <div>
              <span className="text-color">金额 (元):</span>
              <span className="text-weight">{moneyData?.orderAmountTotal}</span>
            </div>
          </div>
          <div className="main-card-item">
            <div>
              <span className="text-color">总佣金(元)</span>
              <Tooltip
                title={totalCommission}
                color="#fff"
                overlayInnerStyle={{ padding: '20px', width: '500px' }}
              >
                <QuestionCircleOutlined style={{ color: 'rgba(0,0,0,.65)' }} />
              </Tooltip>
            </div>
            <div className="main-card-item-conter">
              <span className="text-weight">
                {Number(moneyData?.settledCommissionTotal) +
                  Number(moneyData?.toBeSettledCommissionTotal)}
              </span>
            </div>
            <div>
              <span className="text-color">
                {moneyData?.settledCommissionTotal || 0} /
                {moneyData?.toBeSettledCommissionTotal || 0}
                (已结算 / 待结算)
              </span>
            </div>
          </div>
        </div>
        <Card>
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            scroll={{ x: 1000 }}
            pagination={false}
          />
          <div
            style={{
              margin: '20px 0 0 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <span style={{ margin: '0 10px 0 0' }}>名词解释</span>
              <Tooltip
                title={definition}
                color="#fff"
                overlayInnerStyle={{ padding: '20px', width: '500px' }}
              >
                <QuestionCircleOutlined style={{ color: 'rgba(0,0,0,.65)' }} />
              </Tooltip>
            </div>
            <Pagination
              total={total}
              showTotal={() => `共 ${Number(total)} 条记录`}
              defaultPageSize={pageation.pageSize}
              defaultCurrent={pageation.current}
              current={Number(pageation.current)}
              showSizeChanger={true}
              onChange={(page, pageSize) => onChangePageation(page, pageSize)}
            />
          </div>
        </Card>
        <ExportFieldsModel
          showExportModel={showExportModel}
          setShowExportModel={setShowExportModel}
          fieldType={ExportTypeClassName.TeamStatisticsToExcel}
          setSelectFields={(values) => onExportList(values)}
        />
      </div>
    </PageContainer>
  );
};

export default PerformanceStatistics;
