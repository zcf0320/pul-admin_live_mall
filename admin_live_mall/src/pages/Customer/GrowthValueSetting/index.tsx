import { useEffect, useState } from 'react';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import {
  Alert,
  Button,
  Checkbox,
  Form,
  InputNumber,
  message,
  notification,
  Select,
  Spin,
  Tooltip,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import {
  GROWTH_ACTION_TYPE,
  IGrowthValueForm,
  ILockUpParam,
  IRequireParam,
} from '../GrowthValueSetting/data.d';
import { getGrowthValue, growthValueSetting } from '@/pages/Customer/GrowthValueSetting/services';
import { isObjectChanged } from '@/pages/utils/ObjectIsSame';
import type { NotificationPlacement } from 'antd/es/notification/interface';

import { getUserLevel } from '@/pages/Customer/LevelSetting/services';

import styles from './index.module.less';

const FormItem = Form.Item;

const selectOption = [
  {
    value: 1,
    label: '天',
  },
  {
    label: '周',
    value: 2,
  },
];
// 成长值设置false勾选复选框，true不勾选复选框
const GrowthValueSetting = () => {
  const [growthForm] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [isDisable, setIsDisable] = useState<boolean>(true); // 是否禁止按钮
  const [lockUpParam, setLockUpParam] = useState<ILockUpParam>({
    isLockUp: false,
    status: false,
  }); // 是否彻底禁用按钮（当会员等级2开启时，必须设置成长值）
  const [requireParam, setRequireParam] = useState<IRequireParam>();
  const [growthValues, setGrowthValues] = useState<IGrowthValueForm>();
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [contextHolderStatus, setContextHolderStatus] = useState({
    secondLevelStatus: false,
    noTrue: false,
  });
  // 获取成长值设置
  const getGrowthValueSet = async (): Promise<void> => {
    try {
      const { data = [] } = await getGrowthValue();
      let newGrowthValues: any = {};
      let newRequireParam = {};
      data.forEach(({ actionType, conditions, id, status, value }: any) => {
        switch (actionType) {
          case GROWTH_ACTION_TYPE.BUY_PRODUCT:
            newGrowthValues = {
              buy_product_amount: JSON.parse(conditions)?.amount,
              buy_product_value: value,
              buy_product_id: id,
              BUY_PRODUCT: !status,
            };
            break;
          case GROWTH_ACTION_TYPE.PLACE_ORDER:
            newGrowthValues = {
              ...newGrowthValues,
              PLACE_ORDER: !status,
              place_order_count: JSON.parse(conditions)?.count,
              place_order_id: id,
              place_order_value: value,
            };
            break;
          case GROWTH_ACTION_TYPE.VISIT:
            newGrowthValues = {
              ...newGrowthValues,
              VISIT: !status,
              access_count: JSON.parse(conditions)?.count,
              access_time_unit: JSON.parse(conditions)?.timeUnit,
              access_id: id,
              access_value: value,
            };
            break;
          case GROWTH_ACTION_TYPE.SHARE:
            newGrowthValues = {
              ...newGrowthValues,
              SHARE: !status,
              share_count: JSON.parse(conditions)?.count,
              share_time_unit: JSON.parse(conditions)?.timeUnit,
              share_id: id,
              share_value: value,
            };
            break;
          case GROWTH_ACTION_TYPE.EVALUATE:
            newGrowthValues = {
              ...newGrowthValues,
              EVALUATE: !status,
              evaluate_value1: JSON.parse(conditions)?.value1,
              evaluate_value2: JSON.parse(conditions)?.value2,
              evaluate_id: id,
            };
            break;
          default:
        }
        newRequireParam = {
          ...newRequireParam,
          [actionType]: !status,
        };
      });
      setRequireParam(newRequireParam);
      setGrowthValues(newGrowthValues);
    } catch (e) {
      console.error(e);
    }
  };

  // 提交成长值数据
  const onSubmit = (values: IGrowthValueForm) => {
    growthForm.validateFields().then(async (): Promise<void> => {
      const {
        BUY_PRODUCT = true,
        PLACE_ORDER = true,
        SHARE = true,
        EVALUATE = true,
        VISIT = true,
        buy_product_amount = '',
        buy_product_value = '',
        place_order_count = '',
        place_order_value = '',
        access_time_unit = '',
        access_count = '',
        access_value = '',
        share_count = '',
        share_time_unit = '',
        share_value = '',
        evaluate_value1 = '',
        evaluate_value2 = '',
      } = values || {};

      const {
        buy_product_id = '',
        place_order_id = '',
        access_id = '',
        share_id = '',
        evaluate_id = '',
      } = growthValues || {};
      try {
        setShowLoading(true);
        const params = [
          {
            id: buy_product_id,
            actionType: 'BUY_PRODUCT',
            conditions: JSON.stringify({
              amount: buy_product_amount,
            }),
            status: !BUY_PRODUCT,
            value: buy_product_value,
          },
          {
            id: place_order_id,
            actionType: 'PLACE_ORDER',
            conditions: JSON.stringify({
              count: place_order_count,
            }),
            status: !PLACE_ORDER,
            value: place_order_value,
          },
          {
            id: access_id,
            actionType: 'VISIT',
            conditions: JSON.stringify({
              count: access_count,
              timeUnit: access_time_unit,
            }),
            status: !VISIT,
            value: access_value,
          },
          {
            id: share_id,
            actionType: 'SHARE',
            conditions: JSON.stringify({
              count: share_count,
              timeUnit: share_time_unit,
            }),
            status: !SHARE,
            value: share_value,
          },
          {
            id: evaluate_id,
            actionType: 'EVALUATE',
            conditions: JSON.stringify({
              value1: evaluate_value1,
              value2: evaluate_value2,
            }),
            status: !EVALUATE,
          },
        ];
        await growthValueSetting({ configRequestList: params });
        await getGrowthValueSet();
        setIsDisable(true);
        message.success('成长值设置成功！');
      } catch (err) {
        console.error(err);
      } finally {
        setShowLoading(false);
      }
    });
  };

  // 当表单值改变时
  const onChangeFormValues = (changValue: IGrowthValueForm, values: IGrowthValueForm): void => {
    const paramName: string = Object.keys(changValue)[0];
    // 如果改变复选框状态，则根据复选框状态判断是否开启表单验证
    if (Object.keys(GROWTH_ACTION_TYPE).includes(paramName)) {
      setRequireParam({
        ...requireParam,
        [paramName]: !requireParam?.[paramName],
      });
    }
    const {
      evaluate_id = '',
      share_id = '',
      access_id = '',
      place_order_id = '',
      buy_product_id = '',
    } = growthValues || {};

    const isChange = isObjectChanged(growthValues, {
      ...values,
      evaluate_id,
      share_id,
      access_id,
      place_order_id,
      buy_product_id,
    });
    // 设置提交按钮状态
    setIsDisable(!isChange);
    const {
      BUY_PRODUCT = true,
      EVALUATE = true,
      PLACE_ORDER = true,
      SHARE = true,
      VISIT = true,
    } = values;
    setContextHolderStatus({
      ...contextHolderStatus,
      noTrue: !(BUY_PRODUCT || EVALUATE || PLACE_ORDER || SHARE || VISIT),
    });
  };

  const openNotification = (placement: NotificationPlacement): void => {
    api.warning({
      message: (
        <span style={{ color: 'red', fontWeight: 500, fontSize: 14 }}>
          当前等级已启用VIP2，请至少设置勾选一个成长值设置
        </span>
      ),
      duration: null,
      placement,
      style: {
        marginTop: 50,
        width: 450,
      },
    });
  };

  // 获取成长值数据
  const getUserLevelList = async (): Promise<void> => {
    try {
      setShowLoading(true);
      const { data = [] } = await getUserLevel();
      const secondLevelStatus = data.find(({ level }: { level: number }) => level >= 2)?.status;
      setLockUpParam({
        ...lockUpParam,
        status: secondLevelStatus,
      });
      // 启用VIP2后
      if (secondLevelStatus) {
        setContextHolderStatus({
          ...contextHolderStatus,
          secondLevelStatus: true,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setShowLoading(false);
    }
  };

  useEffect(() => {
    // 获取用户等级列表
    getUserLevelList().then(async () => {
      // 获取成长值设置数据
      await getGrowthValueSet();
    });
  }, []);

  // 设置表单数据为初始值
  useEffect(() => {
    growthForm.setFieldsValue({ ...growthValues });
  }, [growthValues]);

  // 根据修改的值匹配执行验证
  useEffect(() => {
    growthForm
      .validateFields()
      .then(() => {
        // 如果会员2被启用，则如果不开启成长值就锁死禁用按钮
        if (lockUpParam.status) {
          setLockUpParam({
            ...lockUpParam,
            isLockUp: !Object.values(requireParam as IRequireParam).some(Boolean),
          });
        }
      })
      .catch(({ errorFields }) => {
        // 验证不通过禁止按钮点击
        setIsDisable(errorFields?.length > 0);
      });
  }, [requireParam]);

  useEffect(() => {
    if (contextHolderStatus.noTrue && contextHolderStatus.secondLevelStatus) {
      // 开启提示
      openNotification('topRight');
    }
  }, [contextHolderStatus]);
  // 成长值设置false勾选复选框，true不勾选复选框
  return (
    <PageContainer
      header={{
        breadcrumb: undefined,
      }}
      extraContent="可以激励买家做任务，快速提高忠诚度，提升会员活跃和复购率；勾选后会在个人中心出现相关任务。"
      className={styles.pageContainer}
    >
      {contextHolderStatus.secondLevelStatus && contextHolderStatus.noTrue ? contextHolder : null}
      {showLoading ? (
        <div className={styles.spin}>
          <Spin size="large" className={styles.loading} />
        </div>
      ) : (
        <ProCard style={{ maxWidth: '100%', minHeight: '78vh' }}>
          <Alert message="请在编辑后保存，否则可能会丢失修改！" type="warning" showIcon />
          <Form
            form={growthForm}
            className={styles.form}
            onFinish={onSubmit}
            initialValues={{
              access_time_unit: 1,
              share_time_unit: 1,
            }}
            onValuesChange={onChangeFormValues}
          >
            <div>
              <h4>消费价值</h4>
              <div className={styles.consumerValue}>
                <FormItem
                  name={GROWTH_ACTION_TYPE.BUY_PRODUCT}
                  className={styles.formItem}
                  valuePropName="checked"
                >
                  <Checkbox>购买商品</Checkbox>
                </FormItem>
                <Tooltip
                  title="订单交易成功后，立即发放成长值。买家申请退款，商家确认退款后，扣减该笔订单获取的成长值。成长值项取消后已发放的成长值不做收回。"
                  className={styles.tooltip}
                >
                  <QuestionCircleOutlined />
                </Tooltip>
                <div className={styles.formItem}>
                  <span>每消费</span>
                  <FormItem
                    name="buy_product_amount"
                    className={styles.formItem}
                    rules={[
                      {
                        required: requireParam?.['BUY_PRODUCT'],
                        message: '请输入消费金额',
                      },
                    ]}
                  >
                    <InputNumber placeholder="金额" min={0} />
                  </FormItem>
                  <span>元，</span>
                </div>
                <div className={styles.formItem}>
                  <span>获得</span>
                  <FormItem
                    name="buy_product_value"
                    className={styles.formItem}
                    rules={[
                      {
                        required: requireParam?.['BUY_PRODUCT'],
                        message: '请输入成长值',
                      },
                    ]}
                  >
                    <InputNumber placeholder="次数" min={0} />
                  </FormItem>
                  <span>成长值</span>
                </div>
              </div>
              <div className={styles.consumerValue}>
                <FormItem
                  name={GROWTH_ACTION_TYPE.PLACE_ORDER}
                  className={styles.formItem}
                  valuePropName="checked"
                >
                  <Checkbox>完成下单</Checkbox>
                </FormItem>
                <Tooltip
                  title="订单交易成功后，立即发放成长值。买家申请退款，商家确认退款后，扣减该笔订单获取的成长值。成长值项取消后已发放的成长值不做收回。"
                  className={styles.tooltip}
                >
                  <QuestionCircleOutlined />
                </Tooltip>
                <div className={styles.formItem}>
                  <span>每完成</span>
                  <FormItem
                    name="place_order_count"
                    className={styles.formItem}
                    rules={[
                      {
                        required: requireParam?.['PLACE_ORDER'],
                        message: '请输入下单数量',
                      },
                    ]}
                  >
                    <InputNumber placeholder="次数" min={0} />
                  </FormItem>
                  <span>笔订单，</span>
                </div>
                <div className={styles.formItem}>
                  <span>获得</span>
                  <FormItem
                    name="place_order_value"
                    className={styles.formItem}
                    rules={[
                      {
                        required: requireParam?.['PLACE_ORDER'],
                        message: '请输入成长值',
                      },
                    ]}
                  >
                    <InputNumber placeholder="数值" min={0} />
                  </FormItem>
                  <span>成长值</span>
                </div>
              </div>
            </div>
            <div>
              <h4>活跃价值</h4>
              <div className={styles.consumerValue}>
                <FormItem
                  name={GROWTH_ACTION_TYPE.VISIT}
                  className={styles.formItem}
                  valuePropName="checked"
                >
                  <Checkbox>访问</Checkbox>
                </FormItem>
                <Tooltip
                  title="你可以设置奖励对用户的访问商城行为进行激励"
                  className={styles.tooltip}
                >
                  <QuestionCircleOutlined />
                </Tooltip>
                <div className={styles.formItem}>
                  <span>每</span>
                  <FormItem name="access_time_unit" className={styles.formItem}>
                    <Select options={selectOption} className={styles.selectWidth} />
                  </FormItem>
                  <span>访问商城</span>
                </div>
                <div className={styles.formItem}>
                  <FormItem
                    name="access_count"
                    className={styles.formItem}
                    rules={[
                      {
                        required: requireParam?.['VISIT'],
                        message: '请输入访问次数',
                      },
                    ]}
                  >
                    <InputNumber placeholder="次数" min={0} />
                  </FormItem>
                  <span>次，</span>
                </div>
                <div className={styles.formItem}>
                  <span>获得</span>
                  <FormItem
                    name="access_value"
                    className={styles.formItem}
                    rules={[
                      {
                        required: requireParam?.['VISIT'],
                        message: '请输入成长值',
                      },
                    ]}
                  >
                    <InputNumber placeholder="数值" min={0} />
                  </FormItem>
                  <span>成长值</span>
                </div>
              </div>
              <div className={styles.consumerValue}>
                <FormItem
                  name={GROWTH_ACTION_TYPE.SHARE}
                  className={styles.formItem}
                  valuePropName="checked"
                >
                  <Checkbox>分享</Checkbox>
                </FormItem>
                <Tooltip
                  title="你可以设置奖励对用户的分享商城行为进行激励"
                  className={styles.tooltip}
                >
                  <QuestionCircleOutlined />
                </Tooltip>
                <div className={styles.formItem}>
                  <span>每</span>
                  <FormItem name="share_time_unit" className={styles.formItem}>
                    <Select options={selectOption} className={styles.selectWidth} />
                  </FormItem>
                  <span>分享页面</span>
                </div>
                <div className={styles.formItem}>
                  <FormItem
                    name="share_count"
                    className={styles.formItem}
                    rules={[
                      {
                        required: requireParam?.['SHARE'],
                        message: '请输入分享次数',
                      },
                    ]}
                  >
                    <InputNumber placeholder="次数" min={0} />
                  </FormItem>
                  <span>次，</span>
                </div>
                <div className={styles.formItem}>
                  <span>获得</span>
                  <FormItem
                    name="share_value"
                    className={styles.formItem}
                    rules={[
                      {
                        required: requireParam?.['SHARE'],
                        message: '请输入成长值',
                      },
                    ]}
                  >
                    <InputNumber placeholder="数值" min={0} />
                  </FormItem>
                  <span>成长值</span>
                </div>
              </div>
              <div className={styles.consumerValue}>
                <FormItem
                  name={GROWTH_ACTION_TYPE.EVALUATE}
                  className={styles.formItem}
                  valuePropName="checked"
                >
                  <Checkbox>评价</Checkbox>
                </FormItem>
                <Tooltip
                  title="你可以设置奖励对用户的晒单评价行为进行激励"
                  className={styles.tooltip}
                >
                  <QuestionCircleOutlined />
                </Tooltip>
                <div className={styles.formItem}>
                  <span>每次评价带文字，获得</span>
                  <FormItem
                    name="evaluate_value1"
                    className={styles.formItem}
                    rules={[
                      {
                        required: requireParam?.['EVALUATE'],
                        message: '请输入成长值',
                      },
                    ]}
                  >
                    <InputNumber placeholder="数值" min={0} />
                  </FormItem>
                  <span>成长值，每次评价带图片，</span>
                </div>
                <div className={styles.formItem}>
                  <span>获得</span>
                  <FormItem
                    name="evaluate_value2"
                    className={styles.formItem}
                    rules={[
                      {
                        required: requireParam?.['EVALUATE'],
                        message: '请输入成长值',
                      },
                    ]}
                  >
                    <InputNumber placeholder="数值" min={0} />
                  </FormItem>
                  <span>成长值</span>
                </div>
              </div>
              <FormItem className={styles.formItem}>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={lockUpParam.isLockUp || isDisable}
                >
                  保存
                </Button>
              </FormItem>
            </div>
          </Form>
        </ProCard>
      )}
    </PageContainer>
  );
};

export default GrowthValueSetting;
