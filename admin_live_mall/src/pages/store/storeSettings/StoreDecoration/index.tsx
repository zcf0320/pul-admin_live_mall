import { Card, ColorPicker, Form, message } from 'antd';
import { FooterToolbar, PageContainer, ProForm, ProFormText } from '@ant-design/pro-components';
import { UploadPhotos, normImage } from '@/pages/components/UploadPhotos/UploadPhotos';
import { getDiyAppletSettings, setDiyAppletSettings } from '@/api/diyAppletSettings';

interface AppletTabbarSet {
  color: string;
  selectedColor: string;
  tabText: string;
  selectedIcon: string;
  icon: string;
}

export default () => {
  const key = 'SHOP_DECORATION';

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <Card>
        <ProForm<AppletTabbarSet>
          layout={'horizontal'}
          request={async () => {
            const res = await getDiyAppletSettings({ keys: [key] });
            if (res.data) {
              const info = JSON.parse(res.data[key]);
              console.log('info', info);
              if (info) return info;
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
          <div style={{ fontWeight: 'bold', marginTop: 15, marginBottom: 10 }}>按钮文字颜色</div>
          <ProForm.Group>
            <Form.Item
              label="按钮上的文字默认颜色"
              name="color"
              getValueFromEvent={(_, hex: string) => hex}
            >
              <ColorPicker />
            </Form.Item>

            <Form.Item
              label="按钮上的文字选中时的颜色"
              name="selectedColor"
              getValueFromEvent={(_, hex: string) => hex}
            >
              <ColorPicker />
            </Form.Item>
          </ProForm.Group>
          {[1, 2, 3, 4, 5].map((i) => {
            return (
              <ProForm.Group key={i}>
                <ProFormText
                  width={150}
                  name={`tabText${i}`}
                  label={`按钮${['一', '二', '三', '四', '五'][i - 1]}的标题`}
                  rules={[{ required: true, message: '必填项' }]}
                  fieldProps={{
                    maxLength: 4,
                    showCount: true,
                  }}
                />
                <ProForm.Group>
                  <Form.Item
                    label="选中时的图标"
                    name={`selectedIcon${i}`}
                    valuePropName="imageUrl"
                    getValueFromEvent={normImage}
                    rules={[{ required: true, message: '请上传' }]}
                  >
                    <UploadPhotos amount={1} />
                  </Form.Item>
                  <Form.Item
                    label="未选中时的图标"
                    name={`icon${i}`}
                    valuePropName="imageUrl"
                    getValueFromEvent={normImage}
                    rules={[{ required: true, message: '请上传' }]}
                  >
                    <UploadPhotos amount={1} />
                  </Form.Item>
                </ProForm.Group>
              </ProForm.Group>
            );
          })}
        </ProForm>
      </Card>
    </PageContainer>
  );
};
