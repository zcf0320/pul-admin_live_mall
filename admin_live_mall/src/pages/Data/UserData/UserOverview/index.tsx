import { useEffect } from 'react';
import * as echarts from 'echarts';
import { PageContainer } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import { Card } from 'antd';

const get30Days = (dayNums: number) => {
  const dateArr = [];
  for (let i = 0; i <= dayNums; i++) {
    dateArr.unshift(dayjs().subtract(i, 'day').format('M.D'));
  }
  return dateArr;
};

const options = {
  title: {
    text: '用户近30天数据',
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['总会员数', '今日新增会员数', '今日签到人数'],
  },
  // grid: {
  //   left: '3%',
  //   right: '1%',
  //   top: 100,
  //   bottom: '2%',
  //   containLabel: true,
  // },
  xAxis: {
    type: 'category',
    name: '日期',
    boundaryGap: false,
    data: get30Days(30),
    axisLabel: { interval: 1 },
  },
  yAxis: {
    type: 'value',
    name: '人数',
  },
  series: [
    {
      name: '总会员数',
      type: 'line',
      stack: 'Total',
      data: [
        120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90,
        230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132,
      ],
    },
    {
      name: '今日新增会员数',
      type: 'line',
      stack: 'Total',
      data: [
        220, 182, 191, 234, 290, 330, 310, 220, 182, 191, 234, 290, 330, 310, 220, 182, 191, 234,
        290, 330, 310, 220, 182, 191, 234, 290, 330, 310, 220, 182,
      ],
    },
    {
      name: '今日签到人数',
      type: 'line',
      stack: 'Total',
      data: [
        150, 232, 201, 154, 190, 330, 410, 150, 232, 201, 154, 190, 330, 410, 150, 232, 201, 154,
        190, 330, 410, 150, 232, 201, 154, 190, 330, 410, 150, 232,
      ],
    },
  ],
};
const UserOverview = () => {
  // 基于准备好的dom，初始化echarts实例
  // 绘制图表

  useEffect(() => {
    const main = document.getElementById('main') || '';
    if (main !== '') {
      const myChart = echarts.init(main);
      myChart.setOption(options);
      window.onresize = () => {
        myChart.resize();
      };
    }
  }, [window.onresize]);

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <Card>
        <div id="main" style={{ height: '75vh', width: '90%', background: '#fff' }} />
      </Card>
    </PageContainer>
  );
};

export default UserOverview;
