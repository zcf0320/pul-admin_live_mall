import { useRef, useState } from 'react';
import styles from './style/index.module.less';
import Step2, { Step2Instance } from './step2';
import { history, useLocation } from '@umijs/max';
import { Button, Card, Divider } from 'antd';
import { PageContainer } from '@ant-design/pro-components';

export default function AddProduct() {
  const step2Ref = useRef<Step2Instance>(null);
  const [loading, setLoading] = useState(false);

  const handleStep2 = () => {
    console.log('step1');
    step2Ref.current?.nextStep().finally(() => {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    });
  };

  const { search } = useLocation();
  const editId = new URLSearchParams(search).get('id')!;
  const type = new URLSearchParams(search).get('type')!;

  const title = editId && type !== 'copy' ? '编辑商品' : '新增商品';

  const handleNextStep = () => {
    setLoading(true);
    handleStep2();
  };

  return (
    <PageContainer header={{ breadcrumb: undefined, title: title }}>
      <Card className={styles['card']} bodyStyle={{ position: 'relative' }}>
        {/* <Steps
    current={step}
    style={{ width: '780px', margin: '20px auto' }}
  ></Steps>
  {step === 1 ? <Step2 ref={step2Ref} /> : null} */}

        <Step2 ref={step2Ref} />
        <div
          style={{
            height: '60px',
            position: 'sticky',
            backgroundColor: 'white',
            bottom: 0,
            left: 0,
          }}
        >
          <Divider />
          <div style={{ display: 'flex', justifyContent: 'end', width: '100%' }}>
            <Button
              onClick={() => {
                history.back();
              }}
              style={{ marginRight: '10px' }}
            >
              返回
            </Button>
            <Button loading={loading} onClick={handleNextStep} type="primary">
              提交
            </Button>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}
