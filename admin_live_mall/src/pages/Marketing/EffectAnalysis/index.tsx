import { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import CouponData from './components/CouponData';
import styles from './index.module.less';

const items: TabsProps['items'] = [
  {
    key: '1',
    label: `优惠劵数据`,
  },
  {
    key: '2',
    label: `福袋数据`,
    disabled: true,
  },
];
const EffectAnalysis = () => {
  const [activeIndex, setActiveIndex] = useState('1');
  const onChange = (key: string) => {
    setActiveIndex(key);
  };
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <div className={styles.EffectAnalysis}>
        <div className={styles.TabHeader}>
          <Tabs
            tabBarStyle={{ height: '60px' }}
            defaultActiveKey="1"
            items={items}
            onChange={onChange}
          />
        </div>
        {activeIndex === '1' ? <CouponData /> : null}
      </div>
    </PageContainer>
  );
};

export default EffectAnalysis;
