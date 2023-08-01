import { FC, useState } from 'react';
import { Tabs } from 'antd';
import RefundManageList from './RefundManageList';
import { PageContainer, ProCard } from '@ant-design/pro-components';

import './index.less';

const tabList = [
  {
    key: '1',
    label: '待处理',
  },
  {
    key: '2',
    label: '处理中',
  },
  {
    key: '3',
    label: '已完成',
  },
];
const RefundManagement: FC = () => {
  const [activeIndex, setActiveIndex] = useState<string>('1');

  const handTab = (key: string) => {
    setActiveIndex(key);
  };

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <ProCard size="small">
        <Tabs defaultActiveKey="1" items={tabList} onChange={handTab} style={{ marginLeft: 20 }} />
        <RefundManageList activeIndex={activeIndex} />
      </ProCard>
    </PageContainer>
  );
};

export default RefundManagement;
