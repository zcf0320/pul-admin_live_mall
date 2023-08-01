import { FC, memo, useRef } from 'react';
import { Alert, message, Popover } from 'antd';
import { ModalForm, ProFormInstance, ProFormRadio } from '@ant-design/pro-components';
import { clearPartner } from '@/pages/partner/PartnerManagement/PartnerList/services';
import styles from '../index.module.less';

interface IProps {
  id: string;
  readonly name: string;
  readonly phone: string;
  readonly level: number;
  readonly levelName: string;
  readonly remarkName: string;
  showClearPartner: boolean;
  setShowClearPartner: any;
  setRefresh: any;
}

// 修改备注名
const ClearPartner: FC<IProps> = (props: IProps) => {
  const {
    id = '',
    name = '',
    phone = '',
    remarkName = '',
    setShowClearPartner,
    setRefresh,
    showClearPartner = false,
  } = props || {};

  const formRef = useRef<ProFormInstance>();
  const onEditRemark = async (): Promise<void> => {
    await clearPartner({ id });
    message.success('已清退该合伙人');
    setShowClearPartner(false);
    setRefresh();
  };

  return (
    <ModalForm
      width={480}
      layout="inline"
      title="清退合伙人"
      formRef={formRef}
      open={showClearPartner}
      onFinish={onEditRemark}
      onOpenChange={setShowClearPartner}
      initialValues={{ clearName: '1' }}
    >
      <Alert
        message="清退合伙人后，已产生团队订单会继续结算"
        type="warning"
        showIcon
        style={{ width: '100%' }}
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
            要清退的合伙人：{name}（ID:{id}）
          </div>
        </Popover>
        <ProFormRadio.Group
          name="clearName"
          label="团队成员转移给"
          options={[{ value: '1', label: '总部' }]}
        />
      </div>
    </ModalForm>
  );
};

export default memo(ClearPartner);
