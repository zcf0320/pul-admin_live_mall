// 批量导入弹窗
import { FC, MouseEvent, useEffect, useState } from 'react';
import { Alert, Button, Form, message, Modal, Select, Upload } from 'antd';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';

import { exportExcelBlob } from '@/pages/utils/export';
import { IOption } from '@/pages/Customer/TotalCustomer/data';
import { downTemplate, uploadCustomerExcel } from '@/pages/Customer/CustomerImport/service';
import { getClientTagList } from '@/pages/Customer/TotalCustomer/services';

import styles from '../index.module.less';

const { Dragger } = Upload;

interface IProps {
  showModal: boolean;
  setShowModal: () => void;
  onRefresh: () => void;
}

const fileType = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
];
const maxSize = 20;

const UploadModel: FC<IProps> = (props: IProps) => {
  const { showModal = false, setShowModal, onRefresh } = props || {};
  const [form] = Form.useForm();
  const [file, setFile] = useState<FormData | any>();
  const [isUploadSuccess, setIsUploadSuccess] = useState<boolean>(false);
  const [clientTagList, setClientTagList] = useState<IOption[]>([]);
  // 下载模版
  const onDownTemplate = async (): Promise<void> => {
    try {
      exportExcelBlob('批量导入客户模版', await downTemplate());
      message.success('下载成功！');
    } catch (e) {
      console.log(e);
    }
  };

  const onBeforeUpload = (file: File) => {
    // 允许上传的类型
    const allowFormat = fileType.includes(file.type);
    // 最大量
    const maxFileSize = file.size / 1024 / 1024 < maxSize;

    if (!allowFormat) {
      message.error('只允许上传.xlsx,.xls格式');
    }
    if (!maxFileSize) {
      message.error('最大支持20M');
    }
    return allowFormat && maxFileSize;
  };

  // 提交表单
  const onSubmit = async (): Promise<void> => {
    try {
      const formData: FormData = new FormData();
      formData.append('file', file);
      formData.append('labelIds', form.getFieldsValue().labelIds);
      await uploadCustomerExcel(formData);
      // message.success('客户列表批量导入成功！');
      setShowModal();
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };
  // 上传后转换formData
  const customRequest = async (option: any): Promise<void> => {
    setIsUploadSuccess(option.file);
    setFile(option.file);
  };

  // 删除上传的文件
  const onDeleteFile = (e: MouseEvent<HTMLParagraphElement>) => {
    // 阻止冒泡
    e.stopPropagation();
    setIsUploadSuccess(false);
  };

  // 获取标签列表
  const getClientTagsList = async (): Promise<void> => {
    const {
      data: { records = [] },
    } = await getClientTagList({ pageSize: 999, pageNo: 1 });
    setClientTagList(
      records?.map(({ id, name }: { id: number; name: string }) => ({
        value: id,
        label: name,
      })),
    );
  };

  useEffect(() => {
    if (showModal) getClientTagsList();
  }, [showModal]);
  return (
    <Modal
      width={650}
      title="批量导入"
      open={showModal}
      closable
      onCancel={setShowModal}
      footer={[
        <Button type="default" onClick={setShowModal} key="default">
          取消
        </Button>,
        <Button
          type="primary"
          disabled={!isUploadSuccess}
          onClick={() => form.validateFields().then(onSubmit)}
          key="submit"
        >
          提交
        </Button>,
      ]}
    >
      <Alert
        message="请严格按照模版中说明进行填写表格，否则将可能导致更新数据失败及用户数据异常！"
        type="warning"
        showIcon
        className={styles.mb20}
      />
      <Dragger
        className={styles.mt20}
        beforeUpload={onBeforeUpload}
        showUploadList={false}
        customRequest={customRequest}
      >
        {isUploadSuccess ? (
          <div className={styles.uploadSucc}>
            <p>
              <CheckCircleOutlined className={styles.checkCircleOutlined} />
            </p>
            <div className={styles.file}>
              <p className={styles.fileName}>{file?.name}</p>
              <p className={styles.uploadSuccText}>上传成功，可拖拽文件或点击重新上传</p>
            </div>
            <p className={styles.deleteIcon} onClick={onDeleteFile}>
              <DeleteOutlined className={styles.DeleteOutlined} />
            </p>
          </div>
        ) : (
          <>
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">将文件拖到此处，或点击上传</p>
          </>
        )}
      </Dragger>
      <div className={styles.mt20}>单次批量操作最多支持导入10000条数据，最大20MB .xlsx格式</div>
      <Form className={styles.mt20} form={form}>
        <Form.Item
          name="labelIds"
          label="客户标签"
          rules={[{ required: true, message: '请至少选择一项客户标签' }]}
          className={styles.uploadModelInput}
        >
          <Select placeholder="请选择客户标签" mode="multiple" options={clientTagList} />
        </Form.Item>
      </Form>
      <div className={styles.downLoadBtn}>
        <Button type="link" onClick={onDownTemplate}>
          <DownloadOutlined />
          <span>下载模版</span>
        </Button>
      </div>
    </Modal>
  );
};

export default UploadModel;
