import { Button, Col, DatePicker, Form, Input, Modal, Radio, Row, Select, Space } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import { getPage } from '@/pages/Order/GroupDealSetting/ExpressDeliver/service';
import styles from '../style/index.module.less';
import AddExpressTemplate from '@/pages/Order/AddExpressTemplate';
import { Step2RefContext } from '../step2';
import { FormInstance } from 'antd/lib/form';

interface IProps {
  validateFormItem: (key: string[]) => void;
}

export default function Other(props: IProps) {
  const { validateFormItem } = props;

  const [expressTemplate, setExpressTemplate] = useState<any[]>();
  const [addTemplateModalOpen, setAddTemplateModalOpen] = useState(false);

  // const [form, setForm] = useState<FormInstance>();
  const formInstance = useRef<FormInstance>();

  const { getForm } = useContext(Step2RefContext);

  useEffect(() => {
    const form = getForm && getForm();

    if (form) formInstance.current = form;
  }, [getForm]);

  const loadExpressTemplate = () => {
    getPage().then((res) => {
      const defaultExpress = res.data.find((item: any) => item.isDefault);
      console.log(
        "form?.getFieldValue('freightTemplateId')",
        formInstance.current?.getFieldValue('freightTemplateId'),
      );

      if (defaultExpress && !formInstance.current?.getFieldValue('freightTemplateId')) {
        formInstance.current?.setFieldValue('freightTemplateId', defaultExpress.id);
      }

      setExpressTemplate(res.data);
    });
  };

  const goExpressTemplate = () => {
    // history.push('/Order/AddExpressTemplate');
    setAddTemplateModalOpen(true);
  };

  useEffect(() => {
    loadExpressTemplate();
  }, []);

  return (
    <>
      <Modal
        footer={null}
        destroyOnClose
        onCancel={() => {
          setAddTemplateModalOpen(false);
        }}
        title="添加运费模板"
        width={1000}
        open={addTemplateModalOpen}
      >
        <AddExpressTemplate
          addTemplateSuccess={() => {
            setAddTemplateModalOpen(false);
            loadExpressTemplate();
          }}
        />
      </Modal>
      <Row>
        <Col span={12}>
          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            name="freightTemplateId"
            label="单品运费模版"
            rules={[{ message: '请选择运费模版', required: true }]}
          >
            <Select
              placeholder="请选择运费模版"
              fieldNames={{
                label: 'name',
                value: 'id',
              }}
              options={expressTemplate}
            />
          </Form.Item>
        </Col>
        <Col>
          <Button onClick={goExpressTemplate} style={{ marginLeft: -40 }} type="link">
            新建运费模版
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <div className={styles['radio-group-container']}>
            <Form.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              name="onType"
              label="上架时间"
              initialValue={1}
              rules={[{ message: '请选择上架时间', required: true }]}
            >
              <Radio.Group
                onChange={(value) => {
                  if (value.target.value !== 3) validateFormItem(['onType']);
                }}
              >
                <Space direction="vertical">
                  <Radio value={1}>立即上架售卖</Radio>
                  <Radio value={2}>暂不售卖，放入仓库</Radio>
                  <Radio value={3}>
                    <div>
                      <div>预约上架时间 (日期时间选择器)</div>
                      <div style={{ marginTop: 10 }}>
                        <Form.Item noStyle shouldUpdate>
                          {({ getFieldValue }) => {
                            const disabled = getFieldValue('onType') !== 3;
                            return (
                              <Form.Item
                                name={'preOnTime'}
                                rules={[{ required: !disabled, message: '请输入上架时间' }]}
                              >
                                <DatePicker disabled={disabled} showTime />
                              </Form.Item>
                            );
                          }}
                        </Form.Item>
                      </div>
                    </div>
                  </Radio>
                </Space>
              </Radio.Group>
              {/* <div style={{ marginTop: 20 }}>

            </div> */}
            </Form.Item>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item
            name={'unit'}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            label="销售单位"
          >
            <Input placeholder="请输入商品销售单位的量词，例如个、件、台等"></Input>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}
