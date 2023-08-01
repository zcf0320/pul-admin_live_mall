import React, { Ref, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import styles from './style/index.module.less';
import SkuInfo, { SkuInfoInstance } from './View/skuInfo';
import {
  Button,
  Cascader,
  Col,
  Form,
  FormInstance,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Typography,
  Checkbox,
} from 'antd';
import { history, useLocation } from '@umijs/max';
import { addProduct, editProduct, getProductDetail } from '@/api/product';
import ImageAndText, { ImageAndTextInstance } from './View/imageAndText';
import { getSubPage } from '../ProductManagement/Category/service';
import { getPage } from '../ProductManagement/Tag/service';
import Other from './View/Other';
import { normImage, UploadPhotos } from '@/pages/components/UploadPhotos/UploadPhotos';
import dayjs from 'dayjs';

export interface Step2Instance {
  nextStep: () => Promise<boolean>;
}

interface IStep2RefContext {
  getForm?: () => FormInstance | null;
}

const maxNum = 99999999;
export const Step2RefContext = React.createContext<IStep2RefContext>({});
const options = [
  { label: '团长', value: 'divideTeam' },
  { label: '合伙人', value: 'dividePartner' },
];
function Step2(props: any, ref: Ref<Step2Instance>) {
  const step2FormRef = useRef<FormInstance>(null);
  const skuInfoRef = useRef<SkuInfoInstance>(null);
  const imageAndTextRef = useRef<ImageAndTextInstance>(null);

  const { search } = useLocation();
  const editId = new URLSearchParams(search).get('id')!;
  const type = new URLSearchParams(search).get('type')!;

  const validateFormItem = (key: string[]) => {
    console.log('123123123', key);
    step2FormRef.current?.validateFields(key);
  };

  const [category, setCategory] = useState<{
    category1: undefined | string;
    category2: undefined | string;
  }>({
    category1: undefined,
    category2: undefined,
  });

  const [labelOptions, setLabelOptions] = useState<
    {
      value: number;
      label: string;
    }[]
  >([]);
  //const [maxSalesPrice, setMaxSalesPrice] = useState<any>(null);

  useEffect(() => {
    getPage({ pageNo: 1, pageSize: 100000 }).then((res) => {
      setLabelOptions(
        res.data.records.map((item) => ({
          label: item.name,
          value: item.id,
        })),
      );
    });
  }, []);

  // const [courseOptions, setCourseOptions] = useState<
  //   {
  //     value: number;
  //     label: string;
  //   }[]
  // >([]);
  // const [isVirtual, setIsVirtual] = useState(false);

  // const getCourseOptions = () => {
  //   allTable().then((res) => {
  //     setCourseOptions(res.data.map((item: any) => ({ value: item.id, label: item.courseTitle })));
  //   });
  // };

  // useEffect(() => {
  //   if (isVirtual) {
  //     getCourseOptions();
  //   }
  // }, [isVirtual]);

  useEffect(() => {
    // getPage({ pageNo: 1, pageSize: 1000000 }).then((res) => {
    //   setCategoryOptions(
    //     res.data.records.map((item) => {
    //       return {
    //         value: item.id,
    //         label: item.name,
    //       };
    //     }),
    //   );
    // });
  }, []);

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (editId) {
      if (type !== 'copy') {
        setIsEdit(true);
      }
      getProductDetail({ id: editId }).then((res) => {
        const result = res.data;
        setCategory({
          category1: result.category1,
          category2: result.category2,
        });
        step2FormRef.current?.setFieldsValue({
          ...result,
          labels: result.labelIds,
          category: [result.category1, result.category2],
          mainPic: result.mainPic.join(','),
          preOnTime: result.preOnTime ? dayjs(result.preOnTime) : undefined,
          commission: [
            result.dividePartner ? 'dividePartner' : null,
            result.divideTeam ? 'divideTeam' : null,
          ],

          // ringPic: result.ringPic.join(','),
        });
        imageAndTextRef.current?.setEditValue(result.detail);

        skuInfoRef.current?.setFiledValues('skuList', {
          skuList: result.specsList,
          specList: result.spec,
        });
        // setMaxSalesPrice(+result?.marketPrice);
      });
    }
  }, [editId]);

  const getForm = () => step2FormRef.current;

  const uploadDataTransform = (res: any) => {
    const result = {
      ...res[0],
      category1: res[0].category[0],
      category2: res[0].category[1],
      specsList: res[1].skuData,
      spec: res[1].specList,
      preOnTime:
        res[0].onType === 3 ? dayjs(res[0].preOnTime).format('YYYY-MM-DD HH:mm:ss') : undefined,
      mainPic: res[0].mainPic.split(','),
      isVirtual: false,
      divideTeam: !!res[0].commission?.includes('divideTeam'),
      dividePartner: !!res[0].commission?.includes('dividePartner'),
    };
    delete result.commission;

    return result;
  };

  useImperativeHandle(
    ref,
    () => {
      return {
        nextStep: () => {
          return new Promise((resolve, reject) => {
            try {
              Promise.all([step2FormRef.current?.validateFields(), skuInfoRef.current?.validate()])
                .then((res) => {
                  const result = uploadDataTransform(res);
                  if (editId && type !== 'copy') {
                    editProduct({ ...result, id: editId, initialGmv: Number(result.initialGmv) })
                      .then(() => {
                        resolve(true);
                        message.success('编辑成功');
                        setTimeout(() => {
                          history.back();
                        }, 1000);
                      })
                      .catch((err) => {
                        reject(err);
                      });
                  } else {
                    addProduct({ ...result, initialGmv: Number(result.initialGmv) })
                      .then(() => {
                        message.success('添加成功');
                        resolve(true);
                        setTimeout(() => {
                          history.back();
                        }, 1000);
                      })
                      .catch((err) => {
                        reject(err);
                      });
                  }
                })
                .catch((err) => {
                  reject();
                  console.log('err', err);
                });
            } catch (err) {
              console.log(err);
              reject();
            }
          });
        },
      };
    },
    [editId, history],
  );

  const [treeData, setTreeData] = useState<any>([]);

  const [generateTreeDataSuccess, setGenerateTreeDataSuccess] = useState(false);

  const setChildren = (treeData: any[], key: any, children: any[]) => {
    return treeData.map((item) => {
      if (item.key === key) {
        return {
          ...item,
          children: children,
        };
      }
      return item;
    });
  };

  //获取固定格式子分类列的方法
  const getCategoryAsync = async (parentId: string) => {
    const res = await getSubPage({ parentId });
    return res.data
      .filter((item) => !item.isBottom || item.level !== 1)
      .map((v: any) => {
        console.log(v.level);

        return {
          key: v.id,
          title: v.name,
          isLeaf: v.isBottom,
          disabled: parentId === '0' && v.isBottom,
        };
      });
  };

  const generateCategoryTree = useCallback(async () => {
    if (category.category2 && category.category1 && !generateTreeDataSuccess) {
      const categoryLevel2 = await getCategoryAsync(category.category1);
      // const categoryLevel3 = await getCategoryAsync(Number(category.category2));

      setTreeData((treeData: any) => {
        // const level2Tree = setChildren(categoryLevel2, category.category2, categoryLevel3);
        const result = setChildren(treeData, category.category1, categoryLevel2);
        setGenerateTreeDataSuccess(true);
        return result;
      });
    }
  }, [category.category1, category.category2, generateTreeDataSuccess]);

  useEffect(() => {
    // getBrandList({ pageNo: 1, pageSize: 10000 }).then((res) => {
    //   setBrandList(res.data.records);
    getCategoryAsync('0').then((res) => {
      setTreeData(res);
    });
  }, [editId]);

  useEffect(() => {
    if (editId && treeData.length > 0) {
      generateCategoryTree();
    }
  }, [editId, generateCategoryTree, treeData.length]);

  // 动态加载树选择的子列的方法;
  const loadMore = async (selectedOptions: any[]) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    const children = await getCategoryAsync(targetOption.key);
    targetOption.children = children;
    setTreeData([...treeData]);
  };

  return (
    <Step2RefContext.Provider value={{ getForm }}>
      <div className={styles['step2']}>
        <Form ref={step2FormRef} labelAlign="left" labelCol={{ span: 3 }} colon>
          <div style={{ padding: '0 16px', marginTop: '20px' }}>
            <Typography.Title level={5}>基本信息</Typography.Title>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                  name={'name'}
                  rules={[{ message: '请输入商品名称', required: true }]}
                  label="商品名称"
                >
                  <Input showCount placeholder="请输入商品名称" maxLength={60} allowClear />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                  name={'subName'}
                  rules={[{ message: '请输入商品卖点', required: true }]}
                  label="商品卖点"
                >
                  <Input maxLength={36} showCount placeholder="请输入商品卖点" allowClear />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                  name={'category'}
                  rules={[
                    { message: '请输入商品类目', required: true },
                    {
                      validator(rule, value, callback) {
                        if (category.category2 === undefined && category.category1 !== undefined) {
                          callback('请选择二级分类');
                        } else {
                          callback();
                        }
                      },
                    },
                  ]}
                  label="商品分类"
                >
                  {/* <Input placeholder="请输入商品类目" /> */}
                  <Cascader
                    options={treeData}
                    placeholder="请选择..."
                    allowClear
                    fieldNames={{
                      label: 'title',
                      value: 'key',
                    }}
                    onChange={(value, option) => {
                      if (value) {
                        setCategory({
                          category1: value[0] as string,
                          category2: value[1] as string,
                          // category3: value[2] as string,
                        });
                      } else {
                        setCategory({
                          category1: undefined,
                          category2: undefined,
                          // category3: undefined,
                        });
                      }
                      console.log('value', value, option);
                    }}
                    loadData={loadMore}
                  />
                  {/* <Select placeholder="请输入商品类目" options={categoryOptions} /> */}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Button
                  onClick={() => {
                    history.push('/product/ProductManagement/Category');
                  }}
                  style={{ marginLeft: -40 }}
                  type="link"
                >
                  新建商品分类
                </Button>
              </Col>

              {/* <Col span={12}>
                <Form.Item
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                  name={'status'}
                  label="状态"
                  initialValue={1}
                  rules={[{ message: '请输入状态', required: true }]}
                >
                  <Select
                    options={[
                      {
                        value: 1,
                        label: '上架',
                      },
                      {
                        value: 0,
                        label: '下架',
                      },
                    ]}
                  />
                </Form.Item>
              </Col> */}
              <Col span={12}>
                <Form.Item
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                  name={'goodsCode'}
                  label="商品编码"
                >
                  <Input placeholder="请输入商品编码"></Input>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                  name={'isRecommend'}
                  label="设为推荐"
                  initialValue={true}
                  rules={[{ message: '请输入是否推荐', required: true }]}
                >
                  <Select
                    options={[
                      {
                        value: true,
                        label: '是',
                      },
                      {
                        value: false,
                        label: '否',
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                  name={'isVipDiscount'}
                  label="会员折扣"
                  initialValue={true}
                  rules={[{ message: '请输入会员折扣', required: true }]}
                >
                  <Select
                    options={[
                      {
                        value: true,
                        label: '是',
                      },
                      {
                        value: false,
                        label: '否',
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                  name="type"
                  label="商品用途"
                  initialValue="PRIVATE"
                  rules={[{ message: '请输入商品用途', required: true }]}
                >
                  <Select
                    disabled={isEdit}
                    options={[
                      {
                        value: 'PRIVATE',
                        label: '私域',
                      },
                      {
                        value: 'LIVE',
                        label: '直播',
                      },
                    ]}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                  name={'labels'}
                  label="商品标签"
                >
                  <Select mode="multiple" placeholder={'请输入商品标签'} options={labelOptions} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                  name={'initialGmv'}
                  label="基础销量"
                  initialValue={0}
                >
                  <InputNumber style={{ width: '100%' }} max={maxNum} placeholder="起始销量" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name={'mainPic'}
                  getValueFromEvent={normImage}
                  valuePropName="imageUrl"
                  tooltip="建议尺寸800*800像素，第一张默认为商品主图，最多上传15张"
                  rules={[{ required: true, message: '请上传商品主图' }]}
                  label="商品主图"
                >
                  {/* <div> */}
                  {/* <span style={{ color: 'rgb(153, 153, 153)', marginBottom: '10px' }}>
                    建议尺寸800*800像素，第一张默认为商品主图，最多上传15张
                  </span> */}
                  <UploadPhotos amount={15}></UploadPhotos>
                  {/* <Form.Item>
            {({ getFieldValue }) => {
              const mainPic = getFieldValue('mainPic');
              return (
                <Upload
                  // imagePreview
                  fileList={mainPic}
                  customRequest={upload}
                  listType="picture-card"
                  multiple
                  maxCount={1}
                  // onChange={(fileList, file) => {
                  //   form.setFieldValue('mainPic', fileList);
                  // }}
                  accept="image/*"
                >

                </Upload>
              );
            }}
          </Form.Item> */}
                  {/* </div> */}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                  name={'commission'}
                  label="参与分佣"
                >
                  <Checkbox.Group options={options} />
                </Form.Item>
              </Col>
              <Col span={12}></Col>
            </Row>
          </div>
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              if (!getFieldValue('isVirtual')) {
                return (
                  <div style={{ padding: '0 16px', marginTop: '20px' }}>
                    <Typography.Title level={5}>商品参数</Typography.Title>
                    <SkuInfo ref={skuInfoRef} />
                  </div>
                );
              }
              return;
            }}
          </Form.Item>
          <div style={{ padding: '0 16px', marginTop: '20px' }}>
            <Typography.Title level={5}>商品详情描述</Typography.Title>
            <ImageAndText ref={imageAndTextRef} />
          </div>
          <div style={{ padding: '0 16px', marginTop: '20px' }}>
            <Typography.Title level={5}>其他</Typography.Title>
            <Other validateFormItem={validateFormItem} />
          </div>
        </Form>
      </div>
    </Step2RefContext.Provider>
  );
}

export default React.forwardRef(Step2);
