import { useState } from 'react';
// import Rejection from './components/Rejection';
import { Tabs } from 'antd';
import Application from './Application';
import { PageContainer } from '@ant-design/pro-components';
import './index.less';

const items: any = [
  {
    key: 'APPLICATION',
    label: `提现申请`,
    status: [1], // 申请状态
  },
  {
    key: 'LOG',
    label: `提现记录`,
    status: [3, 4], // 申请状态
  },
  {
    key: 'REJECT',
    label: `驳回记录`,
    status: [2], // 申请状态
  },
];
const WithdrawalApplication = () => {
  const [activeIndex, setActiveIndex] = useState<string>('APPLICATION');

  const onChange = (key: string) => {
    setActiveIndex(key);
  };

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <div className="withdrawalApplication">
        <div className="header-tab">
          <Tabs
            tabBarStyle={{ height: '60px' }}
            defaultActiveKey="1"
            items={items}
            onChange={onChange}
          />
        </div>
        <div className="form-search">
          <Application
            tabKey={activeIndex}
            withdrawStatus={items.find((item: any) => item.key === activeIndex)?.status}
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default WithdrawalApplication;
