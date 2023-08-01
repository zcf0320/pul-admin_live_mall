import { getDiyAppletSettings, setDiyAppletSettings } from '@/api/diyAppletSettings';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { Card, message } from 'antd';

export default () => {
  const key = 'TEAM_ALIAS';
  return (
    <Card title="团长设置">
      <ProForm<{ name: string }>
        layout={'horizontal'}
        request={async () => {
          const res = await getDiyAppletSettings({ keys: [key] });
          if (res.data) return { name: res.data[key] };
          return {} as any;
        }}
        onFinish={async (v) => {
          const res = await setDiyAppletSettings({
            settingList: [
              {
                key,
                value: v.name,
              },
            ],
          });
          if (res.code === 0) message.success('成功！');
        }}
        submitter={{ resetButtonProps: false }}
      >
        <ProFormText
          name="name"
          label="团长名称"
          width={300}
          fieldProps={{
            maxLength: 6,
            showCount: true,
          }}
          rules={[{ required: true, message: '必填项' }]}
          extra="可自定义团长的名称。如：分销员、代理等，最多6个字"
        />
      </ProForm>
    </Card>
  );
};
