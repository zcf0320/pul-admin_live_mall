import React from 'react';
import { Upload, message, Button } from 'antd';
import type { UploadProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { upload } from '@/pages/utils/cos';

interface MultimediaUploadProps extends UploadProps {
  onChange?: (info: any) => void;
}

class MultimediaUpload extends React.Component<MultimediaUploadProps> {
  onChange = (info: any) => {
    const { onChange } = this.props;
    if (info.file.status === 'done') {
      const code = info.file.response.statusCode;
      if (code === 200) {
        message.success(`【${info.file.name}】上传成功`);
        if (onChange) {
          onChange(info.file);
        }
      } else {
        message.error(`【${info.file.name}】上传失败`);
      }
    }
  };

  render() {
    const { ...restProps } = this.props;

    const props = {
      ...restProps,
      // cos上传
      customRequest: upload,
      // 后端上传
      name: 'uploadFile',
      action: '/admin/file/updateLoadAudio',
      onChange: this.onChange,
      showUploadList: { showRemoveIcon: false },
      progress: {
        strokeColor: {
          '0%': '#108ee9',
          '100%': '#87d068',
        },
        strokeWidth: 3,
        format: (percent: any) => `${parseFloat(percent.toFixed(2))}%`,
      },
    };

    return (
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    );
  }
}

export default MultimediaUpload;

export const normMultimedia = (file: any) => {
  console.log('多媒体上传组件的file:', file);
  const newMultimediaUrl = 'https://' + file.response.Location;
  console.log('上传文件的地址:', newMultimediaUrl);
  return newMultimediaUrl;
};
