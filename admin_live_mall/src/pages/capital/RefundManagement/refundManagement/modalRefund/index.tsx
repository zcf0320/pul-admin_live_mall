import { FC, memo, useState } from 'react';
import type { TabsProps } from 'antd';
import { Form, Input, Modal, Tabs } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface propsType {
  modalFlag: boolean;
  setModalFlag: () => void;
}

const items: TabsProps['items'] = [
  {
    key: '1',
    label: `原路退回`,
  },
  {
    key: '2',
    label: `标记退款`,
  },
];

const ModalRefund: FC<propsType> = (props) => {
  const { modalFlag, setModalFlag } = props || {};

  const [tabIndex, setTabIndex] = useState<string>('1');
  const [modalForm] = Form.useForm();

  // tab切换
  const onChangeTab = (key: string) => {
    setTabIndex(key);
  };
  // 发放退款
  //   const showModalRefund = () => {
  //     modalForm.resetFields();
  //     setTabIndex('1');
  //     setIsModalOpen(true);
  //   };
  // 确认退款方式
  const handleOk = () => {
    setTabIndex('1');
    // setIsModalOpen(false);
    setModalFlag();
  };
  // 取消
  const handleCancel = () => {
    setTabIndex('1');
    // setIsModalOpen(false);
    setModalFlag();
  };

  const RenderModel = () => {
    return (
      <div className="form-model">
        <div
          className="form-header-title"
          style={{
            width: '100%',
            height: '60px',
            background: '#fff9e6',
            border: '1px solid #ffd77a',
            padding: '6px 12px',
            display: 'flex',
          }}
        >
          <div style={{ height: '100%' }}>
            <ExclamationCircleOutlined style={{ color: 'orange', margin: '0 10px 0 0 ' }} />
          </div>

          <span style={{ height: '100%' }}>
            标记退款后，维权单将标记为已退款状态；请确认已通过其他方式退款后再进行操作，系统将只做记录，不处理退款流程。
          </span>
        </div>

        <div style={{ margin: '20px 0 0 0' }}>
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            // disabled={componentDisabled}
            form={modalForm}
            style={{ maxWidth: 600 }}
          >
            <Form.Item name="way" label="转账方式">
              <Input />
            </Form.Item>
            <Form.Item name="name" label="收款人姓名">
              <Input />
            </Form.Item>
            <Form.Item name="account" label="收款人账户">
              <Input />
            </Form.Item>
            <Form.Item name="serial" label="支付流水号">
              <Input />
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  };
  return (
    <Modal title="发放退款" open={modalFlag} onOk={handleOk} onCancel={handleCancel}>
      <Tabs defaultActiveKey="1" items={items} onChange={(key) => onChangeTab(key)} />
      {tabIndex === '1' ? <div>收款方式: 微信支付-小程序</div> : <RenderModel />}
    </Modal>
  );
};

export default memo(ModalRefund);
