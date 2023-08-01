import { getDiyAppletSettings, setDiyAppletSettings } from '@/api/diyAppletSettings';
import { UploadPhotos, normImage } from '@/pages/components/UploadPhotos/UploadPhotos';
import { FooterToolbar, ProForm, ProFormInstance, ProFormText } from '@ant-design/pro-components';
import { Form, message } from 'antd';
import { useRef, useState } from 'react';

interface AppletShareSet {
  shareImg: string;
  shareText: string;
}

export default () => {
  const formRef = useRef<ProFormInstance>();
  const key = 'MINI_PROGRAM_SHARING';

  const [bgImg, setBgImg] = useState<string>();
  const [text, setText] = useState<string>();

  return (
    <>
      <div style={{ display: 'flex' }}>
        <div
          style={{
            position: 'relative', //必须设置，不然 bounds="parent" 无法生效
            marginRight: 40,
            border: '1px solid #d9d9d9',
            boxSizing: 'content-box',
            borderRadius: 15,
            padding: 20,
            background: 'rgb(245, 246, 247)',
            height: 521, // 完全使用图片背景时，不设高度
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 15,
              padding: 14,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: '#8f8f8f',
                marginBottom: 8,
              }}
            >
              小程序名称
            </div>
            <div
              style={{
                fontSize: 16,
                color: '#212121',
                marginBottom: 8,
              }}
            >
              {text}
            </div>
            {/* 微信分享，显示图片长宽比是 5:4 */}
            <img src={bgImg} style={{ width: 250, height: 200, objectFit: 'cover' }} />
            <div
              style={{
                borderTop: '1px solid #e5e5e5',
                fontSize: 14,
                color: 'grey',
                paddingTop: 8,
                display: 'flex',
                alignItems: 'center',
                marginTop: 8,
              }}
            >
              <img
                src={'https://img.xiaokeduo.com/xkdnewyun/systemfile/store/icon/newlive5.png'}
                style={{ width: 20, height: 20, marginRight: 6 }}
              />

              <div>小程序</div>
            </div>
          </div>
        </div>

        <ProForm<AppletShareSet>
          formRef={formRef}
          request={async () => {
            const res = await getDiyAppletSettings({ keys: [key] });
            if (res.data) {
              const info: AppletShareSet = JSON.parse(res.data[key]);
              console.log('info', info);
              if (info) {
                setBgImg(info.shareImg);
                setText(info.shareText);
                return info;
              }
            }
            return {} as any;
          }}
          onFinish={async (v) => {
            console.log('表单', v);
            const value = JSON.stringify(v);
            console.log('value', value);

            const res = await setDiyAppletSettings({
              settingList: [
                {
                  key,
                  value,
                },
              ],
            });
            if (res.code === 0) {
              message.success('成功！');
            }
          }}
          submitter={{
            resetButtonProps: false,
            render: (_, dom) => (
              <FooterToolbar
                style={{
                  left: 0,
                  zIndex: 999,
                  marginLeft: '110px',
                  width: 'calc(100% - 110px)',
                }}
                extra={
                  <div
                    style={{
                      width: '100%',
                      paddingBlock: 15,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {dom}
                  </div>
                }
              />
            ),
          }}
        >
          <ProFormText
            name="shareText"
            label="分享描述"
            fieldProps={{
              onChange: (e) => {
                setText(e.target.value);
              },
            }}
          />
          <Form.Item
            label="分享图片"
            name="shareImg"
            valuePropName="imageUrl"
            getValueFromEvent={normImage}
          >
            <UploadPhotos
              amount={1}
              onChange={(e) => {
                const url = normImage(e);
                setBgImg(url);
              }}
            >
              <div style={{ fontSize: 12, color: '#999' }}>建议尺寸：500*400</div>
              <div style={{ fontSize: 12, color: '#999' }}>
                用于小程序转发的自定义图片，如果不设置，则默认使用页面截图
              </div>
            </UploadPhotos>
          </Form.Item>
        </ProForm>
      </div>
    </>
  );
};
