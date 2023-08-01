import { QuestionCircleOutlined } from '@ant-design/icons';
import {
  FooterToolbar,
  ProForm,
  ProFormCheckbox,
  ProFormDigit,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Form, InputNumber, message, Modal, Popover } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { AddLevel } from './data';
import { addLevel, editLevel } from './service';
import { useLocation } from '@umijs/max';

interface Props {
  children?: React.ReactNode;
  title?: string;
}

interface CheckboxAndDigitProps {
  checkboxText: string;
  name: string;
  label?: string;
  precision?: number;
  formRef: React.MutableRefObject<ProFormInstance | undefined>;
}

const Box: React.FC<Props> = ({ children, title }) => {
  return (
    <div
      style={{
        background: '#fff',
        marginBottom: 14,
      }}
    >
      {title && (
        <div
          style={{
            paddingInline: 24,
            paddingBlock: 20,
            borderBottom: '1px solid #eee',
            fontWeight: 'bold',
          }}
        >
          {title}
        </div>
      )}
      <div
        style={{
          paddingTop: 25,
          paddingBottom: 1,
          paddingInline: 24,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const CheckboxAndDigit: React.FC<CheckboxAndDigitProps> = ({
  checkboxText,
  name,
  label,
  precision,
  formRef,
}) => {
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    const proFormDigitValue = formRef.current?.getFieldValue(name);
    console.log('proFormDigitValue', proFormDigitValue);
    if ((proFormDigitValue || 0) < 1) {
      setDisabled(true);
    } else setDisabled(false);
  }, []);

  useEffect(() => {
    let count = formRef.current?.getFieldValue('condition') || 0;
    if (disabled) {
      formRef.current?.setFieldValue('condition', count > 0 ? --count : 0);
    } else {
      formRef.current?.setFieldValue('condition', ++count);
    }
  }, [disabled]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 320,
      }}
    >
      <ProFormCheckbox
        fieldProps={{
          checked: !disabled,
          onChange: (e) => {
            setDisabled(!e.target.checked);
            if (!e.target.checked) {
              formRef.current?.setFieldValue(name, null);
            }
          },
        }}
      >
        {checkboxText}
      </ProFormCheckbox>

      <ProFormDigit
        width={180}
        name={name}
        label={label}
        disabled={disabled}
        min={0}
        rules={[{ required: !disabled, message: '必填项' }]}
        fieldProps={{
          addonBefore: '达到',
          precision: precision,
          addonAfter: precision ? '元' : '',
        }}
      />
    </div>
  );
};

export default () => {
  const formRef = useRef<ProFormInstance>();
  let { state } = useLocation();
  const pageState = state as AddLevel & { id: string };
  console.log('页面参数', pageState);

  const renderTip = (
    <Popover
      content={
        <div style={{ color: '#666', padding: 10 }}>
          <div> 邀请人数：团长直接发展的一级团长总数</div>
          <div> 累计客户数：团长发展过的直接客户数(含已失效)</div>
          <div> 累计消费额：团长自己消费的总金额</div>
          <div> 分佣订单数：团长参与分佣的订单总数</div>
          <div> 分佣订单额：团长参与分佣的订单总金额</div>
          <div> 已结算佣金额：已结算给团长的佣金总额</div>
        </div>
      }
    >
      <QuestionCircleOutlined />
    </Popover>
  );

  const tip = (
    <div>
      <span style={{ marginRight: 4 }}>可选条件</span>
      {renderTip}
    </div>
  );

  const condition = (_: any, value: number) => {
    if (value > 0) return Promise.resolve();
    return Promise.reject(new Error('此项为必选项'));
  };

  return (
    <>
      <ProForm<AddLevel>
        formRef={formRef}
        layout="horizontal"
        labelCol={{ span: 2 }}
        initialValues={pageState}
        onFinish={async (v) => {
          console.log('表单：', v);
          let res;
          if (pageState) {
            res = await editLevel({ ...v, id: pageState.id });
          } else {
            res = await addLevel(v);
          }
          if (res?.code === 0) {
            message.success('成功！');
            history.back();
          }
        }}
        submitter={{
          resetButtonProps: false,
          render: (_, dom) => (
            <FooterToolbar
              style={{
                left: 0,
                zIndex: 999,
                marginLeft: '110px',
                width: 'calc(100% - 110px)',
              }}
              extra={
                <div
                  style={{
                    width: '100%',
                    paddingBlock: 15,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 20,
                  }}
                >
                  <Button
                    type="default"
                    onClick={() => {
                      Modal.confirm({
                        title: '取消',
                        content: '确定取消' + `${pageState ? '编辑' : '添加'}` + '吗？',
                        onOk: () => {
                          history.back();
                        },
                      });
                    }}
                  >
                    取消
                  </Button>
                  {dom}
                </div>
              }
            />
          ),
        }}
      >
        <Box title={`${pageState ? '编辑' : '添加'}团长等级`}>
          <ProFormText
            name="name"
            label="等级名称"
            width={300}
            fieldProps={{
              maxLength: 6,
              showCount: true,
            }}
            rules={[{ required: true, message: '必填项' }]}
          />
        </Box>

        {/* <Box title="升级条件">
          {pageState && pageState.level === 1 && (
            <div style={{ marginBottom: 18 }}>无，新团长默认为此等级</div>
          )}
          {(!pageState || pageState.level !== 1) && (
            <>
              <ProFormRadio.Group
                name="method"
                label="满足方式"
                initialValue={1}
                options={[
                  {
                    label: '勾选条件满足其一即可',
                    value: 1,
                  },
                  {
                    label: '勾选条件需全部满足',
                    value: 2,
                  },
                ]}
              />
              <Form.Item label={tip} name="condition" rules={[{ validator: condition }]}>
                <CheckboxAndDigit checkboxText="邀请人数" name="inviteCount" formRef={formRef} />
                <CheckboxAndDigit
                  checkboxText="累计客户数"
                  name="customerCount"
                  formRef={formRef}
                />
                <CheckboxAndDigit
                  checkboxText="累计消费额"
                  name="totalAmount"
                  precision={2}
                  formRef={formRef}
                />
                <CheckboxAndDigit
                  checkboxText="分佣订单数"
                  name="commissionOrderCount"
                  formRef={formRef}
                />
                <CheckboxAndDigit
                  checkboxText="分佣订单额"
                  name="commissionOrderAmount"
                  precision={2}
                  formRef={formRef}
                />
                <CheckboxAndDigit
                  checkboxText="已结算佣金额"
                  name="settledCommissionAmount"
                  precision={2}
                  formRef={formRef}
                />
              </Form.Item>
            </>
          )}
        </Box> */}

        <Box title="佣金系数">
          <Form.Item
            label="直推佣金"
            name="directCommissionRate"
            extra=""
            rules={[{ required: true, message: '必填项' }]}
            initialValue={1}
          >
            <InputNumber precision={2} addonBefore={'乘'} style={{ width: 120 }} />
          </Form.Item>
          {/* <Form.Item
            label="邀请奖励"
            name="invitationRewardRate"
            extra="该等级团长的「邀请奖励」 = 基础佣金 * 此系数"
            rules={[{ required: true, message: '必填项' }]}
            initialValue={1}
          >
            <InputNumber precision={2} addonBefore={'乘'} style={{ width: 120 }} />
          </Form.Item> */}
        </Box>
      </ProForm>
    </>
  );
};
