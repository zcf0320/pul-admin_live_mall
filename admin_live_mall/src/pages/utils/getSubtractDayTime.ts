import dayjs from 'dayjs';

const formatText = 'YYYY/MM/DD HH:mm:ss';

/* todayEndTime 今天的结束时间 */
const todayEndTime: string = dayjs().endOf('day').format(formatText); //今日结束时间

/**
 * 获取相差今日几天的开始结束时间
 *  @param {number} subtractDay
 *  @param format 传入格式化值
 *  @return {string,string} 返回{startTime,endTime}
 */
const getSubtractDayTime = (subtractDay: number, format?: string) => {
  return {
    startTime: dayjs().subtract(subtractDay, 'day').startOf('day').format(format),
    endTime: dayjs().subtract(subtractDay, 'day').endOf('day').format(format),
  };
};

/**
 *  传入格式化类型，格式化传入时间
 *  @param {Dayjs} time // 需要格式化的时间
 *  @param {format} string // 格式化的类型
 *  @return {string} 返回 string
 */
const getFormatDayTime = (time: any, format: string = formatText) => {
  if (!time) return;
  return dayjs(time).format(format);
};
export { todayEndTime, getSubtractDayTime, getFormatDayTime };
