import { getInitialState } from '@/app';
import { UnorderedListOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { Card, Dropdown, MenuProps } from 'antd';
import { useEffect, useState } from 'react';
import { indexPath } from '../utils/constants';
import { IStore } from './data';
import { fetchUserShops } from './service';
import { loginOut } from '@/components/RightContent/AvatarDropdown';
import { desensitizedPhone } from '../utils';
import { ProSettings } from '@ant-design/pro-components';

export default function SelectStore() {
  const [settings, setSettings] = useState<Partial<ProSettings>>();
  const [user, setUser] = useState<API.CurrentUser>();

  const [storeList, setStoreList] = useState<IStore[]>();

  useEffect(() => {
    getInitialState().then((res) => {
      setSettings(res.settings);
      setUser(res.currentUser);
    });
    fetchUserShops().then((res) => {
      setStoreList(res.data);
    });
  }, []);

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a
          onClick={() => {
            history.push('/InfoSetting');
          }}
        >
          资料设置
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a
          onClick={() => {
            history.push('/SecuritySetting');
          }}
        >
          安全设置
        </a>
      ),
    },
    {
      key: '3',
      label: (
        <a
          onClick={() => {
            loginOut();
          }}
        >
          退出
        </a>
      ),
    },
  ];

  const selectStore = (item: IStore) => {
    localStorage.setItem('shopId', item.id + '');
    history.push(indexPath);
    location.reload();
  };

  return (
    <div style={{ backgroundColor: '#f4f6fa', width: '100%', height: '100vh' }}>
      <Card bodyStyle={{ display: 'flex', justifyContent: 'center', paddingBlock: 10 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '80%',
          }}
        >
          <div
            onClick={() => {
              history.push('/SelectStore');
            }}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <img src={'/logo.png'} alt="" style={{ width: 50 }} />
            <span style={{ marginLeft: 10, fontSize: 18 }}>{settings?.title}</span>
          </div>
          <Dropdown menu={{ items }}>
            <div style={{ cursor: 'pointer' }}>
              {desensitizedPhone(user?.mobile ?? '')}
              <UnorderedListOutlined style={{ marginLeft: 10 }} />
            </div>
          </Dropdown>
        </div>
      </Card>
      <div style={{ marginTop: 40, paddingInline: '10%' }}>
        <Card bodyStyle={{ minHeight: '60vh' }}>
          <div>我参与的店铺</div>
          <div
            style={{ marginTop: 20, height: 1, width: '100%', backgroundColor: '#e3e3e3' }}
          ></div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              marginTop: 20,
            }}
          >
            {storeList?.map((item) => {
              return (
                <div
                  key={item.name}
                  style={{
                    marginRight: 20,
                    padding: 40,
                    border: '1px solid #e3e3e3',
                    borderRadius: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    selectStore(item);
                  }}
                >
                  <img src={item.logo ?? '/.plogong'} alt="" style={{ width: 50 }} />
                  <div style={{ marginTop: 10 }}>{item.name}</div>
                  <div style={{ marginTop: 10 }}>{item.endTime}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
