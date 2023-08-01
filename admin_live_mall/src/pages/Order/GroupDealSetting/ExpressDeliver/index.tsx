import { Card, Tabs, TabsProps } from 'antd';

import Deliver from './components/Deliver';
import DeliverCompony from './components/DeliverCompony';

export default function PageSpecification() {
  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `快递发货`,
      children: <Deliver />,
    },
    {
      key: '2',
      label: `快递公司`,
      children: <DeliverCompony />,
    },
  ];

  return (
    // <PageContainer header={{ breadcrumb: undefined }}>
    <Card>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </Card>
    // </PageContainer>
  );
}
