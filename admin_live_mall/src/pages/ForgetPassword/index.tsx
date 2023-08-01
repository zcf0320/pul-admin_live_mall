import { useRef, useState } from 'react';
import styles from './index.less';
import { getVerifyCode } from '@/api/user';
import { useCountDown } from 'ahooks';
import { isPhone } from '../utils/is';
import { Button, Card, Form, FormInstance, Input, message, Typography } from 'antd';
import { forgetPassword } from './service';
import { history } from '@umijs/max';

interface FormValues {
  phone: string;
  verifyCode: string;
  password: string;
  rePassword: string;
}

export default function ForgetPassword() {
  // const [step, setStep] = useState(1);

  const formRef = useRef<FormInstance<FormValues>>(null);

  const [targetDate, setTargetDate] = useState<number>();

  const [countdown] = useCountDown({
    targetDate,
  });

  const handleGetVerifyCode = () => {
    formRef.current?.validateFields(['phone']).then((values) => {
      console.log(values.phone);
      getVerifyCode({
        mobile: values.phone,
        codeType: 5,
      }).then(() => {
        setTargetDate(Date.now() + 60000);
      });
    });
  };

  const handleSubmit = () => {
    formRef.current?.validateFields().then((values) => {
      if (values.password !== values.rePassword) {
        message.error('两次输入的密码不一致');
      } else {
        forgetPassword({
          mobile: values.phone,
          pwd: values.password,
          verifyCode: values.verifyCode,
        }).then((res) => {
          console.log(res);
          message.success('修改成功');
          setTimeout(() => {
            history.push('/Login');
          }, 1000);
        });
      }
      // console.log(values.phone);
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles['top-container']}>
        <Typography.Title level={3}>修改密码</Typography.Title>
      </div>
      <Card
        style={{
          width: '80vw',
          marginTop: '20px',
          padding: '30px 40px',
        }}
      >
        {/* <Steps current={step} style={{ maxWidth: 900, margin: '0 auto' }}>
          <Step title="输入手机号" />
          <Step title="验证身份" />
          <Step title="设置新密码" />
          <Step title="完成" />
        </Steps> */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Form ref={formRef} style={{ marginTop: '2px' }}>
            <Form.Item
              name={'phone'}
              label="手机号"
              rules={[{ required: true, validator: isPhone }]}
            >
              <Input maxLength={11} style={{ width: '500px' }}></Input>
            </Form.Item>
            <Form.Item
              name={'verifyCode'}
              label="短信验证码"
              rules={[{ required: true, message: '请输入短信验证码' }]}
            >
              <div style={{ display: 'flex' }}>
                <Input
                  onChange={(e) => {
                    formRef.current?.setFieldValue('verifyCode', e.target.value);
                  }}
                  placeholder="请输入验证码"
                  maxLength={6}
                  style={{ width: '300px' }}
                ></Input>
                <div
                  style={{
                    marginLeft: '20px',
                    alignItems: 'center',
                    display: 'flex',
                  }}
                >
                  {countdown > 0 ? (
                    <div style={{ cursor: 'no-drop' }}>
                      重新获取({Math.round(countdown / 1000)})
                    </div>
                  ) : (
                    <Button onClick={handleGetVerifyCode}>获取验证码</Button>
                  )}
                </div>
              </div>
            </Form.Item>
            <Form.Item
              name={'password'}
              label="新密码"
              rules={[{ required: true, message: '请输入新密码' }]}
            >
              <Input.Password
                placeholder="请输入验证码"
                style={{ width: '500px' }}
              ></Input.Password>
            </Form.Item>
            <Form.Item
              name={'rePassword'}
              label="确认新密码"
              rules={[{ required: true, message: '请输入新密码' }]}
            >
              <Input.Password
                placeholder="请输入验证码"
                style={{ width: '500px' }}
              ></Input.Password>
            </Form.Item>
          </Form>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={() => {
              console.log('history;', history);
              history.back();
            }}
            style={{ marginTop: '30px' }}
          >
            返回
          </Button>
          <Button
            onClick={handleSubmit}
            type="primary"
            style={{ marginTop: '30px', marginLeft: '20px' }}
          >
            提交
          </Button>
        </div>
      </Card>
    </div>
  );
}
