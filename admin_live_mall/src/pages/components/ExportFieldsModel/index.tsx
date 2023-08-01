import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ModalForm, ProFormCheckbox } from '@ant-design/pro-components';
import { getExportFields } from '@/pages/components/ExportFieldsModel/services';
import { Form, message } from 'antd';

interface IProps {
  showExportModel: boolean;
  setShowExportModel: Dispatch<SetStateAction<boolean>>;
  fieldType: string;
  setSelectFields: (arr: any[]) => void;
}

const ExportFieldsModel = (props: IProps) => {
  const {
    showExportModel = false,
    setShowExportModel,
    fieldType = '',
    setSelectFields,
  } = props || {};
  const [form] = Form.useForm();
  const [fieldData, setFileData] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    if (showExportModel) {
      getExportFields(fieldType).then(({ data }) => {
        const arr: any = Object.entries(data)?.map(([value, label]) => ({ value, label }));
        setFileData(arr);
      });
    }
    form.resetFields();
  }, [showExportModel]);

  return (
    <ModalForm
      form={form}
      open={showExportModel}
      onOpenChange={setShowExportModel}
      title="选择导出字段"
      // @ts-ignore
      onFinish={({ fields }) => {
        if (fields === undefined) {
          message.error('请选择需要导出的字段');
          return;
        }
        setSelectFields(
          fieldData
            .filter(({ value }: { value: string }) => !fields?.includes(value))
            ?.map(({ value: field }: { value: string }) => field),
        );
        return true;
      }}
    >
      <ProFormCheckbox.Group name="fields" label="需要导出的字段" options={fieldData} />
    </ModalForm>
  );
};

export default ExportFieldsModel;
