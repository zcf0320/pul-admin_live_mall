import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { message, Modal, Upload } from 'antd';
import type { UploadProps } from 'antd/lib/upload';
import { upload } from '@/pages/utils/cos';

interface UploadPhotosProps extends UploadProps {
  imageUrl?: string;
  amount: number; //可上传图片的张数，默认为1张
  onChange?: (info: any) => void;
}

const getBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const UploadPhotos: React.FC<UploadPhotosProps> = (props) => {
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const [fileList, setFileList] = useState<any>([]);
  const [max, setMax] = useState<number>(1);
  const { amount, imageUrl, onChange, beforeUpload } = props;

  useEffect(() => {
    if (amount) setMax(amount);
    if (imageUrl) {
      if (amount <= 1) {
        const newFileList = [{ url: imageUrl }];

        setFileList(newFileList);
      } else {
        const newFileList: any = [];
        imageUrl.split(',').forEach((items) => {
          newFileList.push({ url: items });
        });
        setFileList(newFileList);
      }
    }
  }, [imageUrl, amount]);

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleChange = (info: any) => {
    setFileList(info.fileList);
    if (info.file.status === 'done') {
      message.success('文件上传成功！');
      if (onChange) onChange(info.fileList);
    } else if (info.file.status === 'error') {
      message.error('文件上传失败，请重新上传！');
    } else if (info.file.status === 'removed') {
      message.warning('文件已删除！');
      if (onChange) onChange(info.fileList);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        上传图片
      </div>
    </div>
  );
  return (
    <>
      <Upload
        // cos上传
        customRequest={upload}
        // 后端上传
        name="uploadFile"
        action="/admin/file/updateLoadImage"
        method="POST"
        headers={{ token: localStorage.getItem('token') || '' }}
        accept={'image/*'}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={beforeUpload}
      >
        {fileList.length >= max ? null : uploadButton}
      </Upload>

      {props.children}

      <Modal open={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img
          alt="img"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>
    </>
  );
};

export const normImage = (fileList: any[]) => {
  console.log('图片上传组件的fileList:', fileList);
  const newImageUrlList = fileList.map((item) => {
    if (item?.response?.Location) return 'https://' + item.response.Location;
    return item.url;
  });
  const newImageUrl = newImageUrlList.join(',');
  // console.log('上传文件的地址:', newImageUrl);
  return newImageUrl;
};
