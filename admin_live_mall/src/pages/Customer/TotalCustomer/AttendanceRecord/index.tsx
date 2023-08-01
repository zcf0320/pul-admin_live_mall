// 签到记录
import { FC, memo, useEffect, useState } from 'react';

import { Calendar, message, Modal, Spin } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import { attendanceRecord, repairRecord } from '../services';

import styles from './index.module.less';

interface IProps {
  customerId: string; // 客户id
  registerTime: string; // 客户注册时间
  setSignInDays?: (value: number) => void; // 设置签到天数
}

const currentTime = dayjs().format('YYYY/MM/DD'); // 当前日期

const getRecordList = (value: Dayjs, record: any, registerTime: string) => {
  const formatDate = value.format('YYYY/MM/DD');
  let currentDate = {
    type: '',
    content: formatDate,
    text: '漏',
    background: '#43b244',
    isSameMonth: true,
    signInTime: '',
    disableClick: false,
    repairText: '补',
  };

  // 判断接口返回的数据是否存在记录
  record?.forEach(({ checkinDate, type, checkinTime }: any) => {
    const isSame = dayjs(formatDate).isSame(dayjs(checkinDate).format('YYYY/MM/DD')); // 接口是否含有该日期
    // if (dayjs(registerTime).isBefore(dayjs(checkinDate).format('YYYY/MM/DD'))) {
    //   console.log(checkinDate, '-----');
    //   currentDate = {
    //     ...currentDate,
    //     text: '',
    //     repairText: '',
    //     background: '',
    //   };
    // }
    if (isSame) {
      currentDate = {
        ...currentDate,
        text: '签',
        background: 'red',
        repairText: '',
        signInTime: dayjs(checkinTime).format('HH:mm:ss'),
        disableClick: true,
      };
      if (type === 'REPAIR') {
        currentDate = {
          ...currentDate,
          text: '补签',
          background: '#16adff',
        };
      }
    }
  });
  // 当前日期之后或者注册日期之前的一天时间设置无样式
  if (
    dayjs(formatDate).isAfter(currentTime) ||
    dayjs(value).isBefore(dayjs(registerTime).subtract(0, 'day'))
  ) {
    currentDate = { ...currentDate, text: '', background: '', disableClick: true, repairText: '' };
  }
  return currentDate;
};

const AttendanceRecord: FC<IProps> = memo((props: IProps) => {
  const { customerId = '', registerTime = '', setSignInDays } = props || {};
  // 当前月份
  const [currentMonth, setCurrentMonth] = useState<string>(dayjs().format('YYYY-MM'));
  const [record, setRecord] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  //  获取签到记录
  const getAttendanceRecord = async (): Promise<void> => {
    try {
      setLoading(true);

      const { data = [] } = await attendanceRecord({
        id: customerId,
        checkinMonth: currentMonth?.split('-')?.join(''),
      });
      setRecord(data);
      setSignInDays?.(data?.length);
    } finally {
      setLoading(false);
    }
  };

  // 面板变化回掉
  const onPanelChange = (value: Dayjs) => {
    setCurrentMonth(value.format('YYYY-MM'));
  };

  const setRepairRecord = async (params: {
    checkinDate: `${string} 00:00:00`;
    id: string;
  }): Promise<void> => {
    try {
      setLoading(true);
      await repairRecord(params);
      getAttendanceRecord();
      message.success('补签成功！');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  // 补签
  const onRepair = (date: Dayjs) => {
    const day = date.format('YYYY-MM-DD');
    Modal.confirm({
      title: '提示',
      okText: '补签',
      cancelText: '取消',
      centered: true,
      content: (
        <>
          是否需要补签{date.format('M')}月{date.format('D')}日?
        </>
      ),
      onOk: () =>
        setRepairRecord({
          id: customerId,
          checkinDate: `${day} 00:00:00`,
        }),
    });
  };

  const FullCellRender = (value: Dayjs) => {
    const {
      text = '',
      repairText = '',
      background = '',
      signInTime = '',
      disableClick = false,
    } = getRecordList(value, record, registerTime);
    const isToday = value.format('YYYY/MM/DD') === dayjs().format('YYYY/MM/DD');
    return dayjs(currentMonth).format('YYYY/MM') === value.format('YYYY/MM') ? (
      <div
        key={value.format('YYYY/MM/DD')}
        className={styles.attendance}
        style={{ background: isToday ? '#e6f4ff' : '' }}
        onClick={() => (disableClick || isToday ? {} : onRepair(value))}
      >
        <span className={styles.dayText} style={{ color: isToday ? '#1677ff' : '' }}>
          {value.format('D')}
        </span>
        <span className={styles.statusText} style={{ background: isToday ? '' : background }}>
          {isToday ? '' : text}
        </span>
        <span className={styles.repairText}>{isToday ? '' : repairText}</span>
        {signInTime && <span className={styles.signInTime}>{signInTime}</span>}
      </div>
    ) : null;
  };

  useEffect(() => {
    getAttendanceRecord();
  }, [customerId, currentMonth]);

  return (
    <div className={styles.calenderdate}>
      <Spin spinning={loading}>
        <Calendar
          onPanelChange={onPanelChange}
          fullCellRender={FullCellRender}
          validRange={[dayjs(registerTime).subtract(1, 'day'), dayjs(currentTime)]}
          disabledDate={(date) => dayjs(date).isBefore(dayjs(registerTime).subtract(1, 'day'))}
        />
      </Spin>
    </div>
  );
});

export default AttendanceRecord;
