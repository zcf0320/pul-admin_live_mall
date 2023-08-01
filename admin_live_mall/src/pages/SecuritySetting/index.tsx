import { getInitialState } from '@/app';
import { UnorderedListOutlined } from '@ant-design/icons';
import { ProSettings } from '@ant-design/pro-layout';
import { history } from '@umijs/max';
import { Button, Card, Dropdown, Form, Input, MenuProps } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { loginOut } from '@/components/RightContent/AvatarDropdown';
import { desensitizedPhone } from '../utils';
import { useCountDown } from 'ahooks';
import { FormInstance } from 'antd/lib/form';
import { getVerifyCode } from '@/api/user';

export default function SelectStore() {
  const [settings, setSettings] = useState<Partial<ProSettings>>();
  const [user, setUser] = useState<API.CurrentUser>();

  const formRef = useRef<FormInstance>(null);

  const [targetDate, setTargetDate] = useState<number>();
  const [countdown] = useCountDown({
    targetDate,
  });

  const handleGetVerifyCode = () => {
    formRef.current?.validateFields(['phone']).then((res) => {
      getVerifyCode({ mobile: res.phone }).then(() => {
        setTargetDate(Date.now() + 60000);
      });
    });
  };

  useEffect(() => {
    getInitialState().then((res) => {
      setSettings(res.settings);
      setUser(res.currentUser);
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
            <span style={{ marginLeft: 10, fontSize: 18 }}>{settings?.title} | 安全设置</span>
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
          <div>修改登录密码</div>
          <div
            style={{ marginTop: 20, height: 1, width: '100%', backgroundColor: '#e3e3e3' }}
          ></div>
          <div style={{ marginTop: 20 }}>
            <Form ref={formRef} labelCol={{ span: 4 }} colon={false}>
              <Form.Item label="手机号：">
                <div>{desensitizedPhone(user?.mobile ?? '')}</div>
              </Form.Item>
              <Form.Item label="验证码：">
                <Input
                  style={{ width: 300 }}
                  // size="large"
                  maxLength={6}
                  suffix={
                    countdown > 0 ? (
                      <div style={{ cursor: 'no-drop' }}>
                        重新获取({Math.round(countdown / 1000)})
                      </div>
                    ) : (
                      <Button type="link" size="small" onClick={handleGetVerifyCode}>
                        获取验证码
                      </Button>
                    )
                  }
                  placeholder={'验证码'}
                />
              </Form.Item>
              <Form.Item label="新密码：">
                <Input.Password style={{ width: 300 }}></Input.Password>
              </Form.Item>
              <Form.Item label=" ">
                <Button type="primary">确认修改</Button>
              </Form.Item>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
}
