import { FC, memo, useEffect, useState } from 'react';
import { Button, DatePicker, Form } from 'antd';
import dayjs from 'dayjs';

import { PageContainer } from '@ant-design/pro-components';
import {
  getFormatDayTime,
  getSubtractDayTime,
  todayEndTime,
} from '@/pages/utils/getSubtractDayTime';
import { withDrawStatistics } from './services';
import './index.less';

const { RangePicker } = DatePicker;
const formatText: string = 'YYYY-MM-DD HH:mm:ss';
const timeArr: { title: string; dayNum: number }[] = [
  {
    title: '今天',
    dayNum: 0,
  },
  {
    title: '昨天',
    dayNum: 1,
  },
  {
    title: '近7天',
    dayNum: 7,
  },
  {
    title: '近30天',
    dayNum: 30,
  },
];
const WithdrawalStatistics = () => {
  const [form] = Form.useForm();
  const [activeTimeObj, setActiveTimeObj] = useState<any>({});
  const [withDrawStatistic, setWithDrawStatistic] = useState<IWithDrawStatistic>(); // 看板数据

  const getWithDrawStatistic = async (): Promise<void> => {
    const [startTime, endTime] = form.getFieldValue('time') || [];
    const params: { startTime: string; endTime: string } = {
      startTime: getFormatDayTime(startTime, formatText) || '',
      endTime: getFormatDayTime(endTime, formatText) || '',
    };
    const { data = {} } = await withDrawStatistics(params);
    setWithDrawStatistic(data);
  };

  const handScreen = (): void => {
    getWithDrawStatistic();
  };

  const onReset = (): void => {
    form.resetFields();
    setActiveTimeObj({});
    getWithDrawStatistic();
  };
  // 获取当前日期对应的时间类型，如今天返回0 ，昨天返回1，近七天返回7
  const getDayNumValue = (entryTime: string[]): number | undefined => {
    const currentTimeArr = timeArr.map(({ dayNum }) => {
      return {
        dayNum,
        timeArr: [
          getFormatDayTime(getSubtractDayTime(dayNum).startTime, formatText),
          getFormatDayTime(
            dayNum !== 1 ? todayEndTime : getSubtractDayTime(dayNum).endTime,
            formatText,
          ),
        ],
      };
    });
    let currentDayNum;
    currentTimeArr?.forEach((time) => {
      if (time?.timeArr?.[0] === entryTime[0] && time?.timeArr?.[1] === entryTime[1]) {
        currentDayNum = time.dayNum;
      }
    });
    return currentDayNum;
  };
  //  设置时间
  const TimeSelect: FC<{ timeType: string }> = memo((props: any) => {
    const { timeType = '' } = props || {};
    const setCurrentTime = (dayNum: number, timeType: string) => {
      let currentTime = null;
      currentTime = getSubtractDayTime(dayNum);
      if (dayNum !== 1) {
        currentTime = {
          startTime: getFormatDayTime(currentTime.startTime, formatText),
          endTime: getFormatDayTime(todayEndTime, formatText),
        };
      }
      // 回显当前的结算时间
      form.setFieldValue(timeType, [dayjs(currentTime.startTime), dayjs(currentTime.endTime)]);
    };
    return (
      <div className="timeSelectBtn">
        {timeArr.map(({ title, dayNum }) => {
          return (
            <span
              onClick={() => {
                setCurrentTime(dayNum, timeType);
                setActiveTimeObj({
                  ...activeTimeObj,
                  [timeType]: dayNum,
                });
              }}
              key={dayNum}
              style={{
                color: dayNum === activeTimeObj?.[timeType] ? '#2e75f5' : '#333',
              }}
            >
              {title}
            </span>
          );
        })}
      </div>
    );
  });
  // form表单值改变时触发
  const onChangetime = (data: any, dateString: string[] | any) => {
    if (dateString?.length) {
      setActiveTimeObj({
        time: getDayNumValue(dateString),
      });
    }
  };

  useEffect(() => {
    getWithDrawStatistic();
  }, []);

  const {
    applicantCount = 0, // 申请人数
    applicationCount = 0, // 申请笔数
    failedWithdrawalCount = 0, // 提现失败笔数
    successfulWithdrawalCount = 0, //	提现成功笔数
    totalFailedWithdrawalAmount = 0, // 	提现失败金额总计
    totalSuccessfulWithdrawalAmount = 0, // 提现成功金额总计
    totalWithdrawalAmount = 0, // 提现金额总计
  } = withDrawStatistic || {};
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <div className="withdrawalStatistics">
        <div className="main">
          <div className="main-form">
            <div className="form-time">
              <Form name="basic" autoComplete="off" form={form}>
                <Form.Item
                  label="起止时间"
                  name="time"
                  // rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <RangePicker showTime onChange={onChangetime} />
                </Form.Item>
              </Form>
              <TimeSelect timeType="time" />
            </div>
            <div>
              <Button className="form-search-btn" type="primary" onClick={handScreen}>
                筛选
              </Button>
              <Button onClick={onReset}>重置</Button>
            </div>
          </div>
          <div className="footer-tab">
            <div className="tab-content">
              <div>申请人数</div>
              <div className="text-weight text-size">{applicantCount ?? '-'}</div>
            </div>
            <div className="tab-content">
              <div>申请笔数</div>
              <div className="text-weight text-size">{applicationCount ?? '-'}</div>
            </div>
            <div className="tab-content">
              <div>申请金额(元)</div>
              <div className="text-weight text-size">{totalWithdrawalAmount ?? '-'}</div>
            </div>
            <div className="tab-content">
              <div>发放</div>
              <div>
                <span>笔数:</span>
                <span className="text-weight">{successfulWithdrawalCount ?? '-'}</span>
              </div>
              <div>
                <span>金额:</span>
                <span className="text-weight">{totalSuccessfulWithdrawalAmount ?? '-'}</span>
              </div>
            </div>
            <div className="tab-content border-rig-none">
              <div>驳回</div>
              <div>
                <span>笔数:</span>
                <span className="text-weight">{failedWithdrawalCount ?? '-'}</span>
              </div>
              <div>
                <span>金额:</span>
                <span className="text-weight">{totalFailedWithdrawalAmount ?? '-'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default WithdrawalStatistics;
