import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Radio,
  Tree,
  message,
} from 'antd';

import { PageContainer } from '@ant-design/pro-components';
import styles from './index.module.less';
import { useEffect, useMemo, useRef, useState } from 'react';
import { addTemplate, editTemplate, getDetail, getRegion } from './service';
import { IRegion } from './data';
import { cloneDeep } from 'lodash';
import EditAbleTable from '@/pages/product/addProduct/View/editAbleTable';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import { history } from '@umijs/max';
import queryString from 'query-string';

interface ITableDataSource {
  area: string;
  areaId: string;
  firstCompany: number;
  firstPrice: number;
  continuedPrice: number;
  key: string;
  continuedCompany: number;
}

interface IProps {
  addTemplateSuccess?: () => void;
}

export default function AddExpressTemplate(props: IProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const formRef = useRef<FormInstance>(null);

  const { addTemplateSuccess } = props;

  let title = addTemplateSuccess ? undefined : '添加运费模板';

  const [treeData, setTreeData] = useState<IRegion[]>([]);
  const [dataSource, setDataSource] = useState<ITableDataSource[]>([]);

  const [baseTitle, setBaseTitle] = useState('件');

  useEffect(() => {
    getRegion().then((res) => {
      setTreeData(res.data);
    });
  }, []);

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const [editKeys, setEditKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const params = queryString.parse(location.search);

  if (params.id) {
    title = '编辑运费模板';
  }

  const [detail, setDetail] = useState<any>();

  useEffect(() => {
    if (params.id) {
      getDetail({
        id: params.id,
      }).then((res) => {
        setDetail(res.data);
        setDataSource(
          res.data.freightTemplateChildList.map((item: any) => ({
            ...item,
            key: item.id,
          })),
        );
        formRef.current?.setFieldsValue({
          ...res.data,
          defaultFirstCompany: Number(res.data.defaultFirstCompany),
          defaultFirstPrice: Number(res.data.defaultFirstPrice),
          defaultContinuedCompany: Number(res.data.defaultContinuedCompany),
          defaultContinuedPrice: Number(res.data.defaultContinuedPrice),
        });
      });
    }
  }, []);

  const resultTreeData = useMemo(() => {
    if (treeData.length > 0 && dataSource.length > 0) {
      const clonedTreeData = cloneDeep(treeData).filter(
        (item) =>
          dataSource.findIndex(
            (data) =>
              data.areaId.split(',').includes(item.id) && data.areaId !== editKeys.join(','),
          ) === -1,
      );
      const result = clonedTreeData.map((item) => {
        return {
          ...item,
          children: item.children.filter(
            (item) =>
              dataSource.findIndex(
                (data) =>
                  data.areaId.split(',').includes(item.id) && data.areaId !== editKeys.join(','),
              ) === -1,
          ),
        };
      });
      return result;
    }
    return treeData;
  }, [treeData, dataSource, editKeys]);

  const columns = useMemo(() => {
    const isNum = baseTitle === '件';
    return [
      {
        title: '指定配送区域',
        dataIndex: 'area',
        render: (node: any, record: any) => {
          return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{record.area}</span>
              <span style={{ marginLeft: 20, flexShrink: 0 }}>
                <EditOutlined
                  onClick={() => {
                    setEditKeys(record.areaId.split(','));
                    setCheckedKeys(record.areaId.split(','));
                    setModalOpen(true);
                  }}
                  style={{ cursor: 'pointer' }}
                />
                <Popconfirm
                  title="是否删除"
                  onConfirm={() => {
                    setDataSource((item) => {
                      const newData = item.filter((data) => {
                        return data.areaId !== record.areaId;
                      });
                      return newData;
                    });
                  }}
                >
                  <DeleteOutlined style={{ marginLeft: 10, cursor: 'pointer' }} />
                </Popconfirm>
              </span>
            </div>
          );
        },
      },
      {
        title: isNum ? '首件（个）' : '首重（kg）',
        dataIndex: 'firstCompany',
        width: 110,
        number: true,
        editable: true,
      },
      {
        title: '运费(元)',
        dataIndex: 'firstPrice',
        width: 110,
        number: true,
        editable: true,
      },
      {
        title: isNum ? '续件(个)' : '续重(kg)',
        dataIndex: 'continuedCompany',
        width: 110,
        number: true,
        editable: true,
      },
      {
        title: '续费(元)',
        dataIndex: 'continuedPrice',
        width: 110,
        price: true,
        editable: true,
      },
    ];
  }, [baseTitle]);

  const onExpand = (expandedKeysValue: React.Key[]) => {
    console.log('onExpand', expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue: React.Key[]) => {
    console.log('onCheck', checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
  };

  const onSelect = (selectedKeysValue: React.Key[], info: any) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };

  const findNameListInTreeData = (keys: string[]) => {
    if (treeData.length > 0) {
      const regionObjectList: IRegion[] = [];
      treeData.forEach((item) => {
        if (keys.includes(item.id)) regionObjectList.push(item);
        item.children.forEach((child) => {
          if (keys.includes(child.id)) regionObjectList.push(child);
        });
      });
      return regionObjectList;
    }
    return [];
  };

  const submit = () => {
    formRef.current?.validateFields().then((values) => {
      if (params.id) {
        editTemplate({
          ...values,
          id: detail.id,
          freightTemplateChildList: dataSource,
        }).then(() => {
          message.success('成功');
          history.back();
        });
      } else {
        addTemplate({
          ...values,
          freightTemplateChildList: dataSource,
        }).then(() => {
          message.success('成功');
          if (addTemplateSuccess) {
            return addTemplateSuccess();
          }
          history.back();
        });
      }
    });
  };

  return (
    <PageContainer header={{ breadcrumb: undefined, title: title }}>
      <Card>
        <Form ref={formRef} colon={false} labelCol={{ span: 3 }}>
          <Form.Item
            rules={[
              {
                required: true,
                message: '请输入模板名称',
              },
            ]}
            label="模板名称："
            name={'name'}
          >
            <Input placeholder="请输入模板名称" style={{ width: 300 }} />
          </Form.Item>
          <Form.Item required initialValue={'NUM'} label="计价方式：" name={'pricingMethod'}>
            <Radio.Group
              onChange={(e) => {
                if (e.target.value === 'NUM') {
                  setBaseTitle('件');
                } else {
                  setBaseTitle('kg');
                }
              }}
            >
              <Radio value={'NUM'}>按件数</Radio>
              <Radio value={'WEIGHT'}>按重量</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="默认运费：">
            <div style={{ display: 'flex' }}>
              <Form.Item
                name="defaultFirstCompany"
                rules={[{ required: true, message: `请输入正确的值`, min: 0, type: 'number' }]}
              >
                <InputNumber style={{ width: 120 }} addonAfter={baseTitle} />
              </Form.Item>
              <span style={{ lineHeight: '30px' }}>内，</span>
              <Form.Item
                name="defaultFirstPrice"
                rules={[{ required: true, message: '请输入正确的值', min: 0, type: 'number' }]}
              >
                <InputNumber style={{ width: 120 }} addonAfter="元" />
              </Form.Item>
              <span style={{ lineHeight: '30px' }}>； 每增加</span>
              <Form.Item
                name="defaultContinuedCompany"
                rules={[{ required: true, message: '请输入正确的值', min: 0, type: 'number' }]}
              >
                <InputNumber style={{ width: 120 }} addonAfter={baseTitle} />
              </Form.Item>
              <span style={{ lineHeight: '30px' }}>， 增加运费</span>

              <Form.Item
                name="defaultContinuedPrice"
                rules={[{ required: true, message: '请输入正确的值', min: 0, type: 'number' }]}
              >
                <InputNumber style={{ width: 120 }} addonAfter="元" />
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item label="指定区域运费：">
            <div className={styles['table-container']}>
              <EditAbleTable
                changeData={setDataSource}
                data={dataSource}
                footer={() => {
                  return (
                    <div>
                      <a
                        onClick={() => {
                          setModalOpen(true);
                        }}
                      >
                        新增可配送区域和运费
                      </a>
                    </div>
                  );
                }}
                columns={columns as any}
              ></EditAbleTable>
            </div>
          </Form.Item>
          {/* <Form.Item label="区域设置：">
            <Checkbox.Group>
              <Checkbox value={1}>指定发货区域</Checkbox>
              <Checkbox value={2}>指定不发货区域</Checkbox>
            </Checkbox.Group>
          </Form.Item> */}
          <Form.Item initialValue={false} valuePropName="checked" name={'isDefault'} label=" ">
            <Checkbox>设为新商品默认模板（新添加的商品支持商家配送时的默认模板）</Checkbox>
          </Form.Item>
          <Form.Item label=" ">
            <Button onClick={submit} type="primary">
              保存
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Modal
        onOk={() => {
          console.log('checkKeys', checkedKeys);
          const selectRegionList = findNameListInTreeData(checkedKeys as string[]);
          if (editKeys.length > 0) {
            setDataSource((item) => {
              const newItem = [...item];
              const index = newItem.findIndex((item) => item.areaId === editKeys.join(','));
              if (index > -1) {
                newItem.splice(index, 1, {
                  key: newItem[index].key,
                  area: selectRegionList.map((item) => item.name).join(','),
                  areaId: selectRegionList.map((item) => item.id).join(','),
                  firstCompany: newItem[index].firstCompany,
                  firstPrice: newItem[index].firstPrice,
                  continuedPrice: newItem[index].continuedPrice,
                  continuedCompany: newItem[index].continuedCompany,
                });
              }
              return newItem;
            });
            setEditKeys([]);
          } else {
            setDataSource((item) => {
              return [
                ...item,
                {
                  area: selectRegionList.map((item) => item.name).join(','),
                  areaId: selectRegionList.map((item) => item.id).join(','),
                  key: Number(item.length > 0 ? item[item.length - 1].key : 0) + 1 + '',
                  firstCompany: 0,
                  firstPrice: 0,
                  continuedPrice: 0,
                  continuedCompany: 0,
                },
              ];
            });
          }
          setCheckedKeys([]);
          setExpandedKeys([]);
          setModalOpen(false);
        }}
        title="选择地区"
        // width={500}
        bodyStyle={{ height: '60vh', overflow: 'auto' }}
        onCancel={() => {
          setEditKeys([]);
          setExpandedKeys([]);
          setModalOpen(false);
        }}
        open={modalOpen}
      >
        <Tree
          checkable
          fieldNames={{
            title: 'name',
            key: 'id',
          }}
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          //@ts-ignore
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          onSelect={onSelect}
          selectedKeys={selectedKeys}
          //@ts-ignore
          treeData={resultTreeData}
        />
      </Modal>
    </PageContainer>
  );
}
