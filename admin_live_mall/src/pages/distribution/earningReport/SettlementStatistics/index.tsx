import { useState } from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import Statistics from './components/statistics';
import Detail from './components/detail';
import './index.less';

const items: TabsProps['items'] = [
  {
    key: '1',
    label: `结算统计`,
  },
  {
    key: '2',
    label: `结算明细`,
  },
];
const SettlementStatistics = () => {
  const [activeIndex, setActiveIndex] = useState('1');
  const onChange = (key: string) => {
    setActiveIndex(key);
  };
  return (
    <div>
      <div className="CustomerTag-tab">
        <Tabs
          tabBarStyle={{ height: '60px' }}
          defaultActiveKey="1"
          items={items}
          onChange={onChange}
        />
      </div>
      <div style={{ width: '100%' }}>{activeIndex === '1' ? <Statistics /> : <Detail />}</div>
    </div>
  );
};
export default SettlementStatistics;
