import { getInitialState } from '@/app';
import { UnorderedListOutlined } from '@ant-design/icons';
import { ProSettings } from '@ant-design/pro-layout';
import { history } from '@umijs/max';
import { Button, Card, Dropdown, Form, Input, MenuProps, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { loginOut } from '@/components/RightContent/AvatarDropdown';
import { normImage, UploadPhotos } from '../components/UploadPhotos/UploadPhotos';
import { desensitizedPhone } from '../utils';
import { update } from './service';
import { FormInstance } from 'antd/lib/form';

export default function SelectStore() {
  const [settings, setSettings] = useState<Partial<ProSettings>>();
  const [user, setUser] = useState<API.CurrentUser>();

  const formRef = useRef<FormInstance>(null);

  const loadData = () => {
    getInitialState().then((res) => {
      setSettings(res.settings);
      setUser(res.currentUser);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const submit = () => {
    formRef.current?.validateFields().then((values) => {
      update({
        avatar: values.avatar,
        realName: values.name,
      }).then(() => {
        message.success('修改成功');
        loadData();
      });
    });
  };

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
            <span style={{ marginLeft: 10, fontSize: 18 }}>{settings?.title} | 资料设置</span>
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
          {user ? (
            <Form
              colon={false}
              labelCol={{ span: 4 }}
              initialValues={{
                name: user?.realName,
                avatar: user?.headImage,
              }}
              ref={formRef}
            >
              <Form.Item label="姓名：" name="name">
                <Input style={{ width: 300 }} placeholder="请填写联系人名称"></Input>
              </Form.Item>
              <Form.Item
                label="头像："
                name="avatar"
                getValueFromEvent={normImage}
                valuePropName={'imageUrl'}
              >
                <UploadPhotos amount={1} />
              </Form.Item>
              <Form.Item label=" ">
                <Button onClick={submit} type="primary">
                  保存
                </Button>
              </Form.Item>
            </Form>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
