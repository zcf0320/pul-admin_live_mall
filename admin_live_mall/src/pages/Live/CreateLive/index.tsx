import { Button, Card, DatePicker, Form, Input, message, Radio, Select } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import styles from './index.module.less';
import { useRef, useState, useEffect } from 'react';
import { normImage, UploadPhotos } from '@/pages/components/UploadPhotos/UploadPhotos';
import { FormInstance } from 'antd/lib/form';
import { CopyTwoTone } from '@ant-design/icons';
import { copyToClipboard } from '@/pages/utils';
import { history } from '@umijs/max';
import { createLiveRoomService } from './service';
import dayjs from 'dayjs';
import { generateWxQrCode } from '@/api';
import { downloadImage } from '@/pages/utils/export';
import { TableListItem } from '../Anchor/data';
import { getPage } from '../Anchor/service';

export default function CreateLive() {
  const formRef = useRef<FormInstance>(null);
  const [showResult, setShowResult] = useState(false);

  const [qrCode, setQrCode] = useState('');
  const [generateLoading, setGenerateLoading] = useState(false);

  const [anchorList, setAnchorList] = useState<TableListItem[]>();

  const downloadQrCode = () => {
    downloadImage('直播二维码', qrCode);
  };

  useEffect(() => {
    getPage({
      pageNo: 1,
      pageSize: 10000,
    }).then((res) => {
      setAnchorList(res.data.records);
    });
  }, []);

  const createLiveRoom = () => {
    formRef.current?.validateFields().then((values) => {
      setGenerateLoading(true);
      message.loading('图片生成中');
      createLiveRoomService({
        ...values,
        startTime: dayjs(values.time[0]).format('YYYY-MM-DD HH:mm:ss'),
        endTime: dayjs(values.time[1]).format('YYYY-MM-DD HH:mm:ss'),
      }).then((res) => {
        message.success('创建成功');
        if (formRef.current?.getFieldValue('type') === 'MOBILE') {
          generateWxQrCode({
            scene: 'liveRoomId=' + res.data.id,
            page: 'pages/subPackage/LivePushConfirm/index',
            envVersion: 'release',
          })
            .then((result) => {
              setQrCode(result.data);
            })
            .finally(() => {
              setGenerateLoading(false);
              message.destroy();
            });
        }
        setShowResult(true);
      });
    });
  };

  const CreateInfo = () => (
    <>
      <div className={styles['radio-group-container']}>
        <Form.Item label="直播类型" required name={'type'} initialValue={'MOBILE'}>
          <Radio.Group style={{ marginTop: 5 }}>
            <Radio value={'MOBILE'}>
              <div>
                <div>手机直播</div>
                <div style={{ marginTop: 10, color: '#666', fontSize: 12 }}>
                  适用于带货直播、秀场直播等
                </div>
              </div>
            </Radio>
            <Radio value={'DEVICE'}>
              <div>
                <div>推流设备直播</div>
                <div style={{ marginTop: 10, color: '#666', fontSize: 12 }}>
                  适用于电竞游戏直播、视频教学、在线会议等
                </div>
              </div>
            </Radio>
          </Radio.Group>
        </Form.Item>
      </div>
      <Form.Item
        name="name"
        rules={[{ required: true, message: '请输入直播间标题' }]}
        label="直播间标题"
      >
        <Input
          style={{ width: 500 }}
          showCount
          maxLength={30}
          placeholder="请输入直播间标题"
        ></Input>
      </Form.Item>
      <Form.Item label="直播间封面">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Form.Item
            style={{ marginBottom: 0 }}
            valuePropName="imageUrl"
            getValueFromEvent={normImage}
            name={'cover'}
            rules={[{ required: true, message: '请上传直播间封面' }]}
          >
            <UploadPhotos amount={1}></UploadPhotos>
          </Form.Item>
          <span style={{ fontSize: 12, color: '#999', marginLeft: 20 }}>
            上传直播间封面，格式：png、jpg
            <br />
            {/* 最大1mb,尺寸400*400 */}
            建议比例1:1
          </span>
        </div>
      </Form.Item>
      <Form.Item
        name={'time'}
        rules={[{ required: true, message: '请选择开播时间' }]}
        label="开播时间"
      >
        <DatePicker.RangePicker showTime></DatePicker.RangePicker>
      </Form.Item>
      <Form.Item
        name="anchorName"
        rules={[{ required: true, message: '请输入主播昵称' }]}
        label="主播昵称"
      >
        <Input style={{ width: 300 }} placeholder="请输入主播昵称"></Input>
      </Form.Item>
      <Form.Item name={'anchorId'} label="主播账号">
        <Select
          placeholder="请选择主播"
          style={{ width: 300 }}
          fieldNames={{ value: 'id', label: 'userName' }}
          options={anchorList}
        ></Select>
      </Form.Item>
      {/* <Form.Item name="player" rules={[{ validator: isPhone }]} label="主播手机号">
        <Input style={{ width: 300 }} placeholder="请输入主播手机号"></Input>
      </Form.Item> */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
        <Button onClick={createLiveRoom} type="primary">
          创建直播间
        </Button>
      </div>
    </>
  );

  const Result = () => (
    <>
      <div style={{ marginTop: 20, textAlign: 'center', fontSize: 16 }}>成功创建直播间！</div>
      {formRef.current?.getFieldValue('type') === 'MOBILE' ? (
        <>
          <div style={{ fontSize: 14, color: '#999', textAlign: 'center', marginTop: 20 }}>
            请将此开播码发给主播，主播即可扫码开播
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 20,
            }}
          >
            <div
              style={{
                width: 200,
                height: 200,
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {generateLoading ? null : (
                <img style={{ width: 120, height: 120 }} src={qrCode} alt="" />
              )}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={downloadQrCode} type="link">
              下载
            </Button>
          </div>
        </>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 20,
          }}
        >
          <div
            style={{
              border: '1px solid #e3e3e3',
              width: 300,
              height: 120,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
            }}
          >
            <div>推流地址：</div>
            <div style={{ marginTop: 10 }}>
              https:12312321323132
              <CopyTwoTone
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  copyToClipboard('123123').then(() => {
                    message.success('复制成功');
                  });
                }}
              />
            </div>
          </div>
        </div>
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 60,
        }}
      >
        <Button
          onClick={() => {
            history.push('/Live/LiveList');
          }}
          style={{ width: 80 }}
          type="primary"
        >
          完成
        </Button>
      </div>
    </>
  );

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <Card style={{ marginBottom: 20 }}>
        <Form ref={formRef} labelCol={{ span: 3 }}>
          {showResult ? <Result /> : <CreateInfo />}
        </Form>
      </Card>
    </PageContainer>
  );
}
