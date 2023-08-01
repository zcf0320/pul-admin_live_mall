import { FC, memo, useEffect, useRef } from 'react';
import { Alert, message, Popover } from 'antd';
import { ModalForm, ProFormInstance, ProFormSelect } from '@ant-design/pro-components';
import styles from '../index.module.less';
import { editPartnerLevel } from '@/pages/partner/PartnerManagement/PartnerList/services';

interface IProps {
  id: string;
  readonly name: string;
  readonly phone: string;
  readonly level: number;
  readonly levelName: string;
  readonly remarkName: string;
  partnerLeveList: IOption[];
  showLevel: boolean;
  setShowLevel: any;
  setRefresh: () => void;
}

// 修改备注名
const EditLevelModel: FC<IProps> = (props: IProps) => {
  const {
    id = '',
    name = '',
    phone = '',
    level = '',
    levelName = '',
    remarkName = '',
    setShowLevel,
    setRefresh,
    showLevel = false,
    partnerLeveList = [],
  } = props || {};
  const formRef = useRef<ProFormInstance>();
  const onEditRemark = async ({ level }: { level: number }): Promise<void> => {
    const params = {
      id,
      level,
    };
    await editPartnerLevel(params);
    message.success('修改成功');
    setRefresh();
    setShowLevel();
  };

  useEffect(() => {
    // formRef.current?.resetFields();
    // 当前合伙人等级是否被禁用
    const status = partnerLeveList.find((partnerLevel) => partnerLevel.value === level)?.status;
    formRef.current?.setFieldValue('level', status ? level : null);
  }, [showLevel]);

  return (
    <ModalForm
      width={480}
      layout="inline"
      title="修改等级"
      formRef={formRef}
      open={showLevel}
      onFinish={onEditRemark}
      onOpenChange={setShowLevel}
    >
      <Alert
        message="修改等级后，新的团队订单才按新等级对应的权益计算收益"
        type="warning"
        showIcon
      />
      <div className={styles.remarkModel}>
        <Popover
          content={
            <div className={styles.popover}>
              <div>昵称：{remarkName || name}</div>
              <div>手机号：{phone || '-'}</div>
            </div>
          }
          title=""
          trigger="hover"
        >
          <div className={styles.remarkModelInfo}>
            合伙人：{name}（ID:{id}）
          </div>
        </Popover>
        <div className={styles.remarkModelInfo}>当前等级：{levelName || '-'}</div>
        <ProFormSelect
          width="sm"
          name="level"
          label="修改等级"
          options={partnerLeveList.map((item: IOption) => ({ ...item, disabled: !item.status }))}
          rules={[{ required: true, message: '请选择合伙人等级' }]}
          placeholder="请选择合伙人等级"
        />
      </div>
    </ModalForm>
  );
};

export default memo(EditLevelModel);
