import { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { getPartnerAlias, setPartnerAlias } from './services';
import { Button, Form, Input, message } from 'antd';
import './index.less';

const PartnerSett = () => {
  const [form] = Form.useForm();

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 10 },
    },
  };
  //   获取数据反显
  const getPartnerData = () => {
    getPartnerAlias({ keys: ['PARTNER_ALIAS'] })
      .then((res) => {
        form.setFieldValue('PARTNER_ALIAS', res.data?.PARTNER_ALIAS);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //   表单提交事件
  const onClickFormFinish = () => {
    let settingList = [{ key: 'PARTNER_ALIAS', value: form.getFieldsValue().PARTNER_ALIAS }];
    setPartnerAlias({ settingList })
      .then((res) => {
        message.success('设置合伙人别名成功');
        form.resetFields();
        getPartnerData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getPartnerData();
  }, []);

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <div className="partnerSett">
        <div className="partnerSett-title">
          <div className="title">基本设置</div>
        </div>
        <Form {...formItemLayout} style={{ maxWidth: 600, margin: '20px 0' }} form={form}>
          <Form.Item
            label="合伙人别名"
            name="PARTNER_ALIAS"
            rules={[{ required: true, message: '请输入合伙人别名' }]}
            extra="设置合伙人对外的显示名称。最多5个字"
          >
            <Input maxLength={5} showCount />
          </Form.Item>
          {/* <div className="inp-title">
            <p></p>
          </div> */}
        </Form>
        <div className="form-partnersett-btn">
          <Button type="primary" onClick={() => onClickFormFinish()}>
            保存
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default PartnerSett;
