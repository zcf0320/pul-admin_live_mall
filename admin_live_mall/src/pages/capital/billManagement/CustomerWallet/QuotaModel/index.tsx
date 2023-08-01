import { FC, memo, useEffect, useState } from 'react';
import { Form, Input, InputNumber, message, Modal, Select } from 'antd';

import { quotAadjustment } from '@/pages/capital/billManagement/CustomerWallet/services';

import styles from '../index.module.less';

interface IProps {
  visible: boolean;
  setShowQuotaModel: () => void;
  id: string;
  readonly userId?: string;
  readonly userName: string;
  readonly balanceMoney: string;
  readonly phone: string;
}

const FormItem = Form.Item;
const { TextArea } = Input;

const QuotaModel: FC<IProps> = (props: IProps) => {
  const {
    visible = false,
    setShowQuotaModel,
    userId = '',
    userName = '',
    phone = '',
    balanceMoney = 0,
  } = props || {};
  const [form] = Form.useForm();
  const [currentAmountType, setCurrentAmountType] = useState<string>('add');

  // 提交表单
  const onSubmitForm = async (): Promise<void> => {
    const { amount = 0 } = form.getFieldsValue() || {};
    try {
      const params: IQuotaParam = {
        ...form.getFieldsValue(),
        amount: `${currentAmountType === 'add' ? '+' : '-'}${amount}`,
        id: userId,
      };
      await quotAadjustment(params);
      message.success('余额调整成功');
      setShowQuotaModel();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    form.resetFields();
    setCurrentAmountType('add');
  }, [visible]);

  return (
    <Modal
      title="调整账户余额"
      open={visible}
      width={600}
      destroyOnClose
      maskClosable={false}
      onCancel={setShowQuotaModel}
      onOk={() => form.validateFields().then(onSubmitForm)}
    >
      <div className={styles.customerInfo}>
        <div>
          <span>客户信息：</span>
          <span>
            昵称：{userName || '-'}（ID：{userId || '-'}）
          </span>
        </div>
        <div className={styles.phone}>
          <span>手机号：{phone || '-'}</span>
        </div>
      </div>
      <div className={styles.amount}>
        <span>当前余额：</span>
        <span>¥ {balanceMoney}</span>
      </div>
      <Form form={form} labelCol={{ span: 5 }}>
        <FormItem
          label="调整余额"
          name="amount"
          required
          rules={[{ required: true, message: '请输入需要调整的余额' }]}
          extra="在当前余额的基础上进行增加或减少"
        >
          <InputNumber
            addonAfter="¥"
            placeholder="调整余额"
            addonBefore={
              <Select
                defaultValue="add"
                style={{ width: 60 }}
                onChange={(value) => setCurrentAmountType(value)}
                options={[
                  {
                    value: 'add',
                    label: '+',
                  },
                  {
                    value: 'minus',
                    label: '-',
                  },
                ]}
              />
            }
            min={0}
            max={currentAmountType === 'add' ? 9999999 : balanceMoney}
            className={styles.amountInput}
            maxLength={7}
          />
        </FormItem>
        <FormItem label="备注" name="remarks">
          <TextArea
            showCount
            maxLength={60}
            style={{ height: 120, marginBottom: 24, width: 250 }}
            autoSize={{ minRows: 4, maxRows: 6 }}
            placeholder="请输入备注"
          />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default memo(QuotaModel);
