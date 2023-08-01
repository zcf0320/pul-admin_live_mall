import { FC, memo, useEffect, useState } from 'react';
import { Form, message, Modal, Select } from 'antd';
import { updateUserTags } from '@/pages/Customer/TotalCustomer/services';
import { IOption } from '@/pages/Customer/TotalCustomer/data';
import { isArrEqual } from '@/pages/utils/ObjectIsSame';

interface IProps {
  showTagModel: boolean;
  tagsList: IOption[];
  labels?: Array<{ id: string }>;
  id?: string;
  setRefresh: () => void;
  setShowTagModel: () => void;
}

const TagModel: FC<IProps> = (props: IProps) => {
  const {
    showTagModel = false,
    tagsList = [],
    setShowTagModel,
    labels = [],
    id = '',
    setRefresh,
  } = props || {};

  const [form] = Form.useForm();
  const [isDisable, setIsDisable] = useState<boolean>(true); // 是否禁止按钮点击

  const onUpdateUserTags = async (): Promise<void> => {
    const params: {
      id: string;
      labelIds: string[];
    } = {
      id,
      ...form.getFieldsValue(),
    };
    try {
      await updateUserTags(params);
      setShowTagModel();
      message.success('更新成功！');
      setRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!showTagModel) return;
    form.setFieldValue(
      'labelIds',
      labels?.map(({ id }: { id: string }) => id),
    );
  }, [showTagModel]);

  return (
    <Modal
      centered
      destroyOnClose
      maskClosable={false}
      open={showTagModel}
      title="当前标签"
      onCancel={setShowTagModel}
      onOk={onUpdateUserTags}
      okButtonProps={{ disabled: isDisable }}
    >
      <Form
        form={form}
        onValuesChange={(_, { labelIds }) => {
          const oldIds = labels.map((item: any) => item.id);
          setIsDisable(isArrEqual(oldIds, labelIds));
        }}
      >
        <Form.Item
          label="用户标签"
          name="labelIds"
          rules={[{ required: true, message: '请选择标签' }]}
        >
          <Select options={tagsList} mode="multiple" placeholder="请选择标签" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default memo(TagModel);
