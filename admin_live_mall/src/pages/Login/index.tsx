// import { getVerifyCode } from '@/api/user';
import { history, useModel } from '@umijs/max';
// import { useCountDown } from 'ahooks';
import { Button, Form, FormInstance, Input, message, Space, Tabs } from 'antd';
// import TabPane from 'antd/es/tabs/TabPane';
import React, { useRef, useState } from 'react';
// import { isPhone } from '../utils/is';
import { getVerifyCode } from '@/api/user';
import { useCountDown } from 'ahooks';
import TabPane from 'antd/es/tabs/TabPane';
import { isPhone } from '../utils/is';
import styles from './index.less';
import { postPasswordLogin, postPhoneLogin } from './service';

interface FormPassword {
  userName: string;
  password: string;
}

interface FromVerifyCode {
  phone: string;
  verifyCode: string;
}

const Login: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const [activeTab, setActiveTab] = useState('1');
  // const [errorMessage, setErrorMessage] = useState('');
  const formRef = useRef<FormInstance<FormPassword | FromVerifyCode>>(null);
  const [loading, setLoading] = useState(false);
  const [targetDate, setTargetDate] = useState<number>();
  const [countdown] = useCountDown({
    targetDate,
  });

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo.backUser,
      }));
    }
  };

  const handleGetVerifyCode = () => {
    formRef.current?.validateFields(['phone']).then((res) => {
      if ('phone' in res) {
        getVerifyCode({ mobile: res.phone }).then(() => {
          setTargetDate(Date.now() + 60000);
        });
      }
    });
  };

  const loginSuccess = async (token: string) => {
    message.success('登录成功！');

    // 存储token;
    if (typeof Storage !== 'undefined') {
      localStorage.setItem('token', token);
      console.log(localStorage.getItem('token'));
    } else {
      message.error('您的浏览器不支持 web 存储！');
    }

    await fetchUserInfo();

    return history.push('/SelectStore');

    // /** 此方法会跳转到 redirect 参数所在的位置 */
    // if (!history) return;
    // // const { query } = history.location;
    // const query = queryString.parse(history.location.search);
    // const { redirect } = query as { redirect: string };
    // history.push(redirect || '/');
    // window.location.reload();
    // return;
    // console.log('loginSuccess');
    // localStorage.setItem('userStatus', 'login');
    // localStorage.setItem('token', token);
    // history.push('/');
  };

  const onSubmitClick = async () => {
    formRef.current?.validateFields().then((values) => {
      setLoading(true);
      if ('password' in values) {
        postPasswordLogin({ username: values.userName, password: values.password })
          .then((res) => {
            loginSuccess(res.data);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        postPhoneLogin({
          mobile: values.phone,
          verifyCode: values.verifyCode,
        })
          .then((res) => {
            loginSuccess(res.data);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
    // try {
    //   // 登录
    //   const msg = await login({ ...values });
    //   if (msg.code === 0) {
    //     message.success('登录成功！');

    //     // 存储token
    //     // if (typeof Storage !== 'undefined') {
    //     //   localStorage.setItem('token', msg.data.token);
    //     //   console.log(localStorage.getItem('token'));
    //     // } else {
    //     //   message.error('您的浏览器不支持 web 存储！');
    //     // }

    //     await fetchUserInfo();

    //     /** 此方法会跳转到 redirect 参数所在的位置 */
    //     if (!history) return;
    //     // const { query } = history.location;
    //     const query = queryString.parse(history.location.search);
    //     const { redirect } = query as { redirect: string };
    //     history.push(redirect || '/');
    //     window.location.reload();
    //     return;
    //   } else {
    //     message.error('登录失败！');
    //   }
    //   // 如果失败去设置用户错误信息
    // } catch (error) {
    //   message.error('登录失败！');
    // }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.boxImg} />
        <div className={styles.content}>
          <div className={styles.loginForm}>
            <div className={styles['login-form-wrapper']}>
              <div className={styles['login-form-title']}>登录</div>
              <div style={{ marginTop: '20px' }}>
                <Tabs accessKey={activeTab} onChange={setActiveTab}>
                  <TabPane key="1" tab="密码登录"></TabPane>
                  <TabPane key="2" tab="短信登录"></TabPane>
                </Tabs>
              </div>
              {/* <div className={styles['login-form-error-msg']}>{errorMessage}</div> */}
              <Form size="large" className={styles['login-form']} layout="vertical" ref={formRef}>
                {activeTab === '1' ? (
                  <Form.Item
                    name="userName"
                    rules={[{ required: true, message: '用户名不能为空' }]}
                  >
                    <Input
                      // prefix={<IconUser />}
                      placeholder={'用户名'}
                      // onPressEnter={onSubmitClick}
                    />
                  </Form.Item>
                ) : (
                  <Form.Item name="phone" rules={[{ required: true, validator: isPhone }]}>
                    <Input
                      // prefix={<IconUser />}
                      placeholder={'手机号'}
                      // onPressEnter={onSubmitClick}
                    />
                  </Form.Item>
                )}
                {activeTab === '1' ? (
                  <Form.Item name="password" rules={[{ required: true, message: '密码不能为空' }]}>
                    <Input.Password
                      // prefix={<IconLock />}
                      placeholder={'密码'}
                      // onPressEnter={onSubmitClick}
                    />
                  </Form.Item>
                ) : (
                  <Form.Item
                    name="verifyCode"
                    rules={[{ required: true, message: '请输入验证码' }]}
                  >
                    <Input
                      // size="large"
                      maxLength={6}
                      suffix={
                        countdown > 0 ? (
                          <div style={{ cursor: 'no-drop' }}>
                            重新获取({Math.round(countdown / 1000)})
                          </div>
                        ) : (
                          <Button
                            type="link"
                            size="small"
                            onClick={handleGetVerifyCode}
                            className={styles['login-form-forgetPassword']}
                          >
                            获取验证码
                          </Button>
                        )
                      }
                      placeholder={'验证码'}
                      onPressEnter={onSubmitClick}
                    />
                  </Form.Item>
                )}

                <Space style={{ width: '100%' }} size={16} direction="vertical">
                  <div className={styles['login-form-password-actions']}>
                    <Button
                      size="small"
                      type="link"
                      onClick={() => {
                        history.push('/forgetPassword');
                      }}
                    >
                      {'忘记密码'}
                    </Button>
                  </div>
                  <Button block type="primary" onClick={onSubmitClick} loading={loading}>
                    {'登录'}
                  </Button>
                  {/* <Button
                    onClick={() => {
                      history.push('/register');
                    }}
                    block
                    type="text"
                    className={styles['login-form-register-btn']}
                  >
                    {'注册账号'}
                  </Button> */}
                </Space>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
