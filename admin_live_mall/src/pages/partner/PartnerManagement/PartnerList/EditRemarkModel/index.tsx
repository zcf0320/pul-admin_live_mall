import { FC, memo } from 'react';
import { editRemarkValue } from '@/pages/partner/PartnerManagement/PartnerList/services';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import styles from '../index.module.less';

interface IProps {
  id: string;
  name: string;
  phone: string;
  remarkName: string;
  showRemark: boolean;
  setShowRemark: any;
  setRefresh: () => void;
}

// 修改备注名
const EditRemarkModel: FC<IProps> = (props: IProps) => {
  const {
    id = '',
    name = '',
    phone = '',
    remarkName = '',
    showRemark = false,
    setShowRemark,
    setRefresh,
  } = props || {};

  const onEditRemark = async ({ remarkName }: { remarkName: string }): Promise<void> => {
    const params = {
      id,
      remarkName,
    };
    await editRemarkValue(params);
    message.success('修改成功');
    setRefresh();
    setShowRemark();
  };

  return (
    <ModalForm
      width={450}
      layout="inline"
      title="修改备注名"
      open={showRemark}
      onFinish={onEditRemark}
      onOpenChange={setShowRemark}
      initialValues={{ remarkName }}
    >
      <div className={styles.remarkModel}>
        <div className={styles.remarkModelInfo}>
          昵称/手机号：{name}（{phone}）
        </div>
        <ProFormText
          width="sm"
          name="remarkName"
          label="备注名"
          placeholder={remarkName ?? '请输入备注名'}
          extra="设置后优先展示备注名，仅后台可见"
          fieldProps={{
            showCount: true,
            maxLength: 16,
          }}
        />
      </div>
    </ModalForm>
  );
};

export default memo(EditRemarkModel);
