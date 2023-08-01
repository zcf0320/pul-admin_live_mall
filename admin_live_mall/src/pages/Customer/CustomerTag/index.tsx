import { useState } from 'react';
import CustomerLabel from './components/ CustomerLabel';
import CustomerLabelGrouping from './components/CustomerLabelGrouping';
import { PageContainer } from '@ant-design/pro-components';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import './index.less';
const items: TabsProps['items'] = [
  {
    key: '1',
    label: `客户标签`,
  },
  {
    key: '2',
    label: `标签分组`,
  },
];

const CustomerTag = () => {
  const [activeIndex, setActiveIndex] = useState('1');
  const onChange = (key: string) => {
    setActiveIndex(key);
  };
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <div className="CustomerTag-tab">
        <Tabs
          tabBarStyle={{ height: '60px' }}
          defaultActiveKey="1"
          items={items}
          onChange={onChange}
        />
      </div>

      <div style={{ width: '100%', background: '#fff' }}>
        {activeIndex === '1' ? <CustomerLabel /> : <CustomerLabelGrouping />}
      </div>
    </PageContainer>
  );
};

export default CustomerTag;
