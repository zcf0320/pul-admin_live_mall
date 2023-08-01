import { Button, Card, Form, FormInstance, Input, Radio, Spin, message } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { UploadPhotos, normImage } from '@/pages/components/UploadPhotos/UploadPhotos';
import { useEffect, useRef, useState } from 'react';
import { ShopInfo } from './data';
import { getShopInfo, updataShopInfo } from './service';
import useStore from '@/hooks/useStore';

export default () => {
  const formRef = useRef<FormInstance>(null);
  const [data, setData] = useState<ShopInfo>();

  const store = useStore();

  useEffect(() => {
    getShopInfo().then((res) => {
      setData(res.data);
    });
  }, []);

  const submit = () => {
    formRef.current?.validateFields().then((v) => {
      updataShopInfo(v).then(() => {
        message.success('保存成功！');
        store.refreshStore();
      });
    });
  };

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <Card>
        {data ? (
          <Form ref={formRef} labelCol={{ span: 3 }} initialValues={data}>
            <Form.Item label="ID" name="id">
              <Input style={{ width: 200 }} disabled />
            </Form.Item>

            <Form.Item
              label="店铺Logo"
              name="logo"
              style={{ marginBottom: 10 }}
              valuePropName="imageUrl"
              getValueFromEvent={normImage}
              rules={[{ required: true, message: '请上传店铺Logo' }]}
            >
              <UploadPhotos amount={1}>
                <div style={{ fontSize: 12, color: '#999' }}>仅支持png、jpg格式的图片</div>
              </UploadPhotos>
            </Form.Item>

            <Form.Item
              label="小程序二维码"
              name="qrCode"
              style={{ marginBottom: 10 }}
              valuePropName="imageUrl"
              getValueFromEvent={normImage}
              rules={[{ required: true, message: '请小程序二维码' }]}
            >
              <UploadPhotos amount={1}>
                <div style={{ fontSize: 12, color: '#999' }}>仅支持png、jpg格式的图片</div>
              </UploadPhotos>
            </Form.Item>

            <Form.Item
              label="店铺名称"
              name="name"
              rules={[{ required: true, message: '请输入店铺名称' }]}
            >
              <Input style={{ width: 300 }} placeholder="请输入店铺名称" />
            </Form.Item>

            <Form.Item label="营业状态" name="tradeStatus" initialValue={true}>
              <Radio.Group style={{ marginTop: 5 }}>
                <Radio value={true}> 营业 </Radio>
                <Radio value={false}> 休息 </Radio>

                <div style={{ fontSize: 12, color: '#999', marginTop: 5 }}>
                  设置休息后，买家将无法在店内下单，请谨慎操作
                </div>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="手机号"
              name="mobile"
              rules={[{ required: true, message: '请输入手机号' }]}
            >
              <Input style={{ width: 300 }} placeholder="请输入手机号" />
            </Form.Item>

            <Form.Item
              label="联系人"
              name="manager"
              rules={[{ required: true, message: '请输入联系人' }]}
            >
              <Input style={{ width: 300 }} placeholder="请输入联系人" />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 3 }}>
              <Button type="primary" onClick={submit}>
                保存
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <div
            style={{
              height: '70vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Spin />
          </div>
        )}
      </Card>
    </PageContainer>
  );
};
