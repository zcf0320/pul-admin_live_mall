import { Card, Tabs, TabsProps } from 'antd';
import PosterSet from './components/PosterSet';
import { useState } from 'react';
import AppletShareSet from './components/AppletShareSet';

export default () => {
  const [key, setKey] = useState<string>('1');

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '邀请海报',
    },
    {
      key: '2',
      label: '小程序分享卡片',
    },
  ];

  const onChange = (key: string) => {
    setKey(key);
  };

  return (
    <>
      <Card>
        <Tabs defaultActiveKey={key} items={items} onChange={onChange} />
        {key === '1' && <PosterSet />}
        {key === '2' && <AppletShareSet />}
      </Card>
    </>
  );
};
