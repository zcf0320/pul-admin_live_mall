import { FC, useEffect, useState } from 'react';
import { Form, message, Modal, Select } from 'antd';
import { setUserLevel } from '@/pages/Customer/LevelSetting/services';
import { IOption } from '@/pages/Customer/TotalCustomer/data';

const FormItem = Form.Item;

interface IProps {
  levelSource: IOption[];
  id?: string;
  level?: number;
  showLevelModel: boolean;
  setRefresh: () => void;
  setShowLevelModel: () => void;
}

const LevelForm: FC<IProps> = (props: IProps) => {
  const {
    level = '',
    id = '',
    levelSource = [],
    setRefresh,
    showLevelModel = false,
    setShowLevelModel,
  } = props || {};
  const [levelForm] = Form.useForm();
  const [newLevelSource, setNewLevelSource] = useState<IOption[]>([]);
  const [isDisable, setIsDisable] = useState<boolean>(true);

  const onSubmit = async () => {
    const param: { id: string; level: number } = {
      id,
      ...levelForm.getFieldsValue(),
    };
    await setUserLevel(param);
    message.success('等级调整成功');
    setShowLevelModel();
    // 刷新列表
    setRefresh();
  };

  // 初始化数据
  const initData = () => {
    const disableLevelSource: IOption[] = levelSource.map((item: IOption) => ({
      ...item,
      disabled: item.value === level,
    }));

    setIsDisable(true); // 默认禁用按钮
    levelForm.setFieldsValue({ level }); // 设置当前默认的等级
    setNewLevelSource(disableLevelSource);
  };

  useEffect(() => {
    if (showLevelModel) initData();
  }, [showLevelModel]);

  return (
    <Modal
      width={450}
      title="调整当前用户等级"
      centered
      closable
      destroyOnClose
      maskClosable={false}
      onOk={onSubmit}
      open={showLevelModel}
      onCancel={setShowLevelModel}
      okButtonProps={{ disabled: isDisable }}
    >
      <Form form={levelForm} onValuesChange={() => setIsDisable(false)}>
        <FormItem name="level" label="当前用户等级">
          <Select options={newLevelSource} />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default LevelForm;
