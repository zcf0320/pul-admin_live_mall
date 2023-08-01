import { getProductDetail } from '@/api/product';
import { IProductDetail } from '@/api/type';
import { allTable } from '@/pages/school/Course/service';
import {
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { history, useLocation } from '@umijs/max';
import { Button, Card, Image, Tag, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';

export default function CommodityDetail() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const id = params.get('id')!;
  // const id = '1646815556176719873';
  const [productInfo, setProductInfo] = useState<IProductDetail | undefined>(undefined);
  // const [brandOptions, setBrandOptions] = useState<any>({});
  const [courseOptions, setCourseOptions] = useState<
    {
      value: number;
      label: string;
    }[]
  >([]);

  const courseObject = useMemo(() => {
    const result: any = {};
    courseOptions.reduce((prev, item) => {
      return (prev[item.value] = item.label);
    }, result);
    console.log('courseObject', result);
    return result;
  }, [courseOptions]);

  const [isVirtual, setIsVirtual] = useState(false);

  const getCourseOptions = () => {
    allTable().then((res) => {
      setCourseOptions(res.data.map((item: any) => ({ value: item.id, label: item.courseTitle })));
    });
  };
  useEffect(() => {
    getProductDetail({ id: id }).then((res) => {
      setProductInfo(res.data);
      setIsVirtual(res.data.isVirtual);
      if (res.data.isVirtual) {
        getCourseOptions();
      }
    });
  }, [search]);

  const basicInfoDesc = useMemo(() => {
    return (
      [
        {
          title: '商品名称',
          dataIndex: 'name',
        },
        {
          title: '商品卖点',
          dataIndex: 'subName',
        },
        {
          title: '分类',
          dataIndex: 'category1Name',
          renderText: (text, record) => record.category1Name + '/' + record.category2Name,
        },
        {
          title: '标签',
          dataIndex: 'labels',
          renderText: (text, record) =>
            record.labelNames?.map((item: any) => <Tag key={item}>{item}</Tag>),
        },
        {
          title: '是否推荐',
          dataIndex: 'isRecommend',
          ellipsis: true,
          render(col: any, item: any) {
            return <span>{item.isRecommend ? '是' : '否'}</span>;
          },
        },
        // {
        //   title: '是否虚拟商品',
        //   dataIndex: 'isVirtual',
        //   ellipsis: true,
        //   render(col: any, item: any) {
        //     return <span>{item.isVirtual ? '是' : '否'}</span>;
        //   },
        // },
        // {
        //   title: '课程',
        //   dataIndex: 'virtualProductId',
        //   ellipsis: true,
        //   // valueEnum: courseObject,
        //   // renderText: (text) => {
        //   //   return courseObject[text];
        //   // },
        //   render: (text, record) => {
        //     return <span>{courseObject[record.virtualProductId]}</span>;
        //   },
        // },
        {
          title: '库存',
          dataIndex: 'stockCount',
          ellipsis: true,
        },
        {
          title: '初始销量',
          dataIndex: 'initialGmv',
          ellipsis: true,
        },
        {
          title: '实际销量',
          dataIndex: 'factGmv',
          ellipsis: true,
        },
        {
          title: '总销量',
          dataIndex: 'sumGmv',
          renderText: (text, record) => record.initialGmv + record.factGmv,
          ellipsis: true,
        },
        {
          title: '状态',
          dataIndex: 'status',
          ellipsis: true,
          render(col: any, item: any) {
            return <span>{item.status === 0 ? '下架中' : '上架中'}</span>;
          },
        },
      ] as ProDescriptionsItemProps[]
    ).filter((item) => {
      if (!isVirtual) {
        return item.dataIndex !== 'virtualProductId';
      }
      return item;
    });
  }, [isVirtual, courseObject]);

  const skuColumns: ProColumns<any>[] = [
    {
      title: '规格图片',
      dataIndex: 'specsPic',
      render(col, item) {
        return <Image src={item.specsPic} width={80} height={80} />;
      },
    },
    {
      title: '规格名称',
      dataIndex: 'specsName',
    },
    {
      title: '规格编码',
      dataIndex: 'skuCode',
    },
    {
      title: '销售价',
      dataIndex: 'salePrice',
      valueType: 'money',
    },
    {
      title: '划线价',
      dataIndex: 'marketPrice',
      valueType: 'money',
    },
    {
      title: '成本价',
      dataIndex: 'costPrice',
      valueType: 'money',
    },
    {
      title: '库存',
      width: 100,
      ellipsis: true,
      dataIndex: 'stock',
    },
    {
      title: '重量（kg）',
      dataIndex: 'weight',
      valueType: 'digit',
    },
  ];

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <Card bodyStyle={{ padding: '30px' }}>
        <ProDescriptions
          column={2}
          columns={basicInfoDesc}
          colon={true}
          title="基础信息"
          request={() => getProductDetail({ id })}
          labelStyle={{
            textAlign: 'right',
            // paddingLeft: '36px',
            paddingRight: '36px',
          }}
        />
        <div style={{ display: 'flex' }}>
          <span>商品主图：</span>
          <div>
            <div style={{ marginTop: '20px', marginLeft: '40px' }}>
              {productInfo?.mainPic?.map((item, index) => {
                return <Image key={index} width={80} height={80} src={item} />;
              })}
            </div>
          </div>
        </div>
        {!productInfo?.isVirtual ? (
          <div>
            <Typography.Title
              style={{
                marginTop: '20px',
              }}
              level={5}
            >
              SKU信息
            </Typography.Title>
            <div>
              {productInfo ? (
                <ProTable
                  search={false}
                  toolBarRender={false}
                  scroll={{ x: 1000 }}
                  dataSource={productInfo.specsList}
                  columns={skuColumns}
                  pagination={false}
                ></ProTable>
              ) : null}
            </div>
          </div>
        ) : null}
        <div>
          <Typography.Title
            style={{
              marginTop: '20px',
            }}
            level={5}
          >
            图文信息
          </Typography.Title>
          <div>
            <div style={{ display: 'flex', marginTop: '20px' }}>
              <span>商品详情描述：</span>
              <div>
                <div
                  style={{
                    backgroundColor: '#fafafc',
                    padding: '16px',
                    width: '800px',
                    height: '400px',
                    overflow: 'scroll',
                  }}
                >
                  <div dangerouslySetInnerHTML={{ __html: productInfo?.detail ?? '' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <ProDescriptions
            column={2}
            columns={[
              {
                title: '单位',
                dataIndex: 'unit',
              },
              {
                title: '物流模板Id',
                dataIndex: 'freightTemplateId',
                copyable: true,
              },
            ]}
            colon={true}
            title="其他"
            request={() => getProductDetail({ id })}
            labelStyle={{
              textAlign: 'right',
              // paddingLeft: '36px',
              paddingRight: '36px',
            }}
          />
        </div>

        <Button
          style={{ marginTop: 20 }}
          type="primary"
          onClick={() => {
            history.back();
          }}
        >
          返回
        </Button>
      </Card>
    </PageContainer>
  );
}
