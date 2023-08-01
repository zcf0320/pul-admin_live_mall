import { useEffect, useRef, useState } from 'react';
import { history } from '@umijs/max';
import dayjs from 'dayjs';
import { exportExcelBlob } from '@/pages/utils/export';
import { TableRequest } from '@/pages/utils/tableRequest';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, Image, message, Typography } from 'antd';
import type { TableListItem, TableListItemDetail } from './data';
import { getDetail, getPage, postDeliver, postExport } from './service';
import { desensitizedPhone } from '@/pages/utils';
import { getSelectedDeliverCompany } from '../../GroupDealSetting/ExpressDeliver/service';
import { IDeliverCompany } from '../../GroupDealSetting/ExpressDeliver/data';
import { ExportTypeClassName } from '@/pages/components/ExportFieldsModel/exportType';
import ExportFieldsModel from '@/pages/components/ExportFieldsModel';

export enum OrderStatus {
  'CLOSE' = 'CLOSE',
  'WAIT_PAY' = 'WAIT_PAY',
  'TO_SHIP' = 'TO_SHIP',
  'TO_RECEIVE' = 'TO_RECEIVE',
  'FINISH' = 'FINISH',
  'AFTER_SALES' = 'AFTER_SALES',
  'REFUND' = 'REFUND',
}

export const orderStatusObject: { [key: string]: string } = {
  WAIT_PAY: '待付款',
  TO_SHIP: '待发货',
  TO_RECEIVE: '已发货',
  FINISH: '已完成',
  CLOSE: '已取消',
  AFTER_SALES: '售后中',
  REFUND: '已退款',
};

const statusTabItems = Object.entries(orderStatusObject).map((item) => {
  return {
    label: item[1],
    key: item[0],
  };
});

statusTabItems.unshift({
  label: '全部',
  key: '',
});

export default function PageSpecification() {
  const ref = useRef<ActionType>();
  const [currentItem, setCurrentItem] = useState<TableListItem>();
  const [deliverModalOpen, setDeliverModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [currentDetail, setCurrentDetail] = useState<TableListItemDetail>();
  const [templateParams, setTemplateParams] = useState<any>();

  const [selectedCompany, setSelectedCompany] = useState<IDeliverCompany[]>([]);

  const [activeKey, setActiveKey] = useState('');
  const [showExportModel, setShowExportModel] = useState(false);

  const reloadTable = () => {
    ref.current?.reload();
  };

  //导出列表
  const onExportList = (excludeColumnFieldNames: string[]) => {
    postExport({ ...templateParams, excludeColumnFieldNames }).then((res) => {
      exportExcelBlob(`订单列表-${dayjs().format('YYYY-MM-DD HH_mm')}`, res);
      message.success('导出成功');
    });
  };

  useEffect(() => {
    if (currentItem) {
      getDetail({ id: currentItem.id }).then((res) => {
        setCurrentDetail(res.data);
      });
    }
  }, [currentItem]);

  const renderDeliver = (item: TableListItem) => {
    if (item.status !== OrderStatus.TO_SHIP) return;
    return (
      <a
        onClick={() => {
          setCurrentItem(item);
          setDeliverModalOpen(true);
        }}
      >
        发货
      </a>
    );
  };

  const renderDetail = (item: TableListItem) => {
    return (
      <a
        onClick={() => {
          // setCurrentItem(item);
          // setDetailModalOpen(true);
          history.push('/Order/OrderManagement/OrderDetail', { orderId: item?.id });
        }}
      >
        详情
      </a>
    );
  };

  const renderExport = () => {
    return (
      <Button onClick={() => setShowExportModel(true)} type="primary">
        导出
      </Button>
    );
  };

  const descColumns: ProDescriptionsItemProps<TableListItem>[] = [
    { title: '订单号', dataIndex: 'orderNo', ellipsis: true },
    // { title: '购买人手机号', dataIndex: 'userPhone', ellipsis: true },
    { title: '总价', dataIndex: 'totalPrice', ellipsis: true },
    { title: '买家手机号', dataIndex: 'phone', ellipsis: true },
    { title: '买家姓名', dataIndex: 'userName', ellipsis: true },
    { title: '收货人', dataIndex: 'receiveName', ellipsis: true },
    { title: '收货手机号', dataIndex: 'receivePhone', ellipsis: true },
    { title: '运费', dataIndex: 'freight', ellipsis: true },
    // {
    //   title: '是否虚拟商品',
    //   dataIndex: 'isVirtual',
    //   ellipsis: true,
    //   renderText: (text) => (text ? '是' : '否'),
    // },
    { title: '购买数量', dataIndex: 'buyCount', ellipsis: true },
    { title: '下单时间', dataIndex: 'createTime', ellipsis: true },
    { title: '支付时间', dataIndex: 'payTime', ellipsis: true },
    {
      title: '收货地址',
      dataIndex: 'receiveAddress',

      ellipsis: true,
      renderText: (_, record) => {
        if (record.isVirtual) return '';
        return (
          record.receiveProvince +
          record.receiveCity +
          record.receiveArea +
          record.receiveStreet +
          record.receiveAddress
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      ellipsis: true,
      renderText: (_, record) => orderStatusObject[record.status],
    },
    { title: '备注', dataIndex: 'remark', ellipsis: true },
  ];

  const orderItemColumns: ProColumns[] = [
    {
      title: '商品名称',
      dataIndex: 'productName',
      ellipsis: true,
    },
    {
      title: '商品图片',
      dataIndex: 'coverPic',
      ellipsis: true,
      valueType: 'image',
    },
    {
      title: '规格名称',
      dataIndex: 'specsName',
      ellipsis: true,
    },
    {
      title: '规格图片',
      dataIndex: 'specsPic',
      ellipsis: true,
      valueType: 'image',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      ellipsis: true,
    },
    {
      title: '购买数量',
      dataIndex: 'num',
      ellipsis: true,
    },
  ];

  //常量列表
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '下单时间',
      dataIndex: 'createTime',
      valueType: 'dateTimeRange',
      search: {
        transform: (record) => {
          return {
            orderStartTime: record[0],
            orderEndTime: record[1],
          };
        },
      },
      hideInTable: true,
    },
    { title: '订单编号', width: 120, align: 'center', dataIndex: 'orderNo' },
    {
      title: '商品',
      dataIndex: 'orderNo',
      search: false,
      align: 'center',
      width: 200,
      render: (node, record) => {
        const product = record?.orderItems[0];
        return (
          <div>
            <Image style={{ width: 80, height: 80 }} src={product?.coverPic} />
            <div>{product?.productName}</div>
          </div>
        );
      },
    },
    // { title: '购买人手机号', dataIndex: 'userPhone', search: false, ellipsis: true },
    {
      title: '单价/数量',
      dataIndex: 'totalPrice',
      search: false,
      ellipsis: true,
      align: 'center',
      width: 80,
      render: (node, record) => {
        return (
          <div>
            <div style={{ textAlign: 'center' }}>{'¥' + record.orderItems[0]?.amount}</div>
            <div style={{ textAlign: 'center' }}>{'x' + record?.buyCount}</div>
          </div>
        );
      },
    },
    {
      title: '买家信息',
      search: false,
      align: 'center',
      width: 120,
      dataIndex: 'receiveName',
      render: (node, record) => {
        return (
          <div>
            <div>{record?.userName}</div>
            <div>{desensitizedPhone(record?.phone)}</div>
          </div>
        );
      },
    },
    {
      title: '收货信息',
      search: false,
      align: 'left',
      width: 250,
      ellipsis: true,
      dataIndex: 'receiveName',
      render: (node, record) => {
        return (
          <div>
            <div>收货人姓名：{record.receiveName}</div>
            <div>联系电话:{desensitizedPhone(record.receivePhone)}</div>
            <div>
              收货地址:
              {(record.receiveProvince ?? '') +
                (record.receiveCity ?? '') +
                (record.receiveArea ?? '') +
                (record.receiveStreet ?? '') +
                (record.receiveAddress ?? '-')}
            </div>
          </div>
        );
      },
    },

    {
      title: '配送方式',
      dataIndex: 'receivePhone',
      align: 'center',
      width: 120,
      search: false,
      render: (node, record) => {
        return (
          <div>
            <div>{record?.logisticsName || '-'}</div>
            <div>{record?.logisticsNo || '-'}</div>
          </div>
        );
      },
      // ellipsis: true,
    },
    {
      title: '物流名称',
      hideInTable: true,
      dataIndex: 'logisticsName',
    },
    {
      title: '买家',
      hideInTable: true,
      dataIndex: 'userName',
    },
    {
      title: '买家电话',
      hideInTable: true,
      dataIndex: 'phone',
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      hideInTable: true,
    },
    {
      title: '收货人电话',
      hideInTable: true,
      dataIndex: 'receivePhone',
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      align: 'center',
      width: 80,
      search: false,
      valueEnum: orderStatusObject,
      ellipsis: true,
    },
    {
      title: '下单时间',
      dataIndex: 'orderTime',
      // ellipsis: true,
      search: false,
      align: 'center',
      width: 140,
    },

    {
      title: '实收金额',
      width: 100,
      dataIndex: 'receiveAddress',
      align: 'center',
      search: false,
      ellipsis: true,
      render: (node, record) => {
        return (
          <div>
            <div style={{ textAlign: 'center' }}>{'¥' + record.payAmount}</div>
            <div style={{ textAlign: 'center', fontSize: 12, color: '#666' }}>
              ({'含运费¥' + record.freight})
            </div>
          </div>
        );
      },
    },

    {
      title: '操作',
      width: 80,
      fixed: 'right',
      align: 'left',
      valueType: 'option',
      render: (_: any, record: any) => [renderDeliver(record), renderDetail(record)],
    },
  ];
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <ProTable<TableListItem>
        columns={columns}
        actionRef={ref}
        scroll={{ x: 1000 }}
        search={{
          span: 6,
          collapsed: false,
          labelWidth: 'auto',
        }}
        toolbar={{
          menu: {
            type: 'tab',
            activeKey: activeKey,
            items: statusTabItems,
            onChange: (key) => {
              setActiveKey(key as string);
            },
          },
        }}
        toolBarRender={() => [renderExport()]}
        params={{ status: activeKey }}
        request={(params) => {
          setTemplateParams(params);
          return TableRequest(params, getPage);
        }}
      />
      <ModalForm
        width={500}
        title="发货"
        modalProps={{
          destroyOnClose: true,
        }}
        onFinish={async (formData) => {
          await postDeliver({
            ...formData,
            id: currentItem?.id,
            logisticsName: selectedCompany.find(
              (item) => formData.logisticsCode === item.deliveryCode,
            )?.deliveryName,
          });
          reloadTable();
          return true;
        }}
        onOpenChange={setDeliverModalOpen}
        open={deliverModalOpen}
      >
        {/* <ProFormText
          rules={[{ required: true, message: '请输入物流名称' }]}
          label="物流名称"
          name="logisticsName"
        ></ProFormText> */}
        <ProFormSelect
          request={async () => {
            const result = (await getSelectedDeliverCompany()).data;
            setSelectedCompany(result);
            return result.map((item) => {
              return {
                label: item.deliveryName,
                value: item.deliveryCode,
              };
            });
          }}
          rules={[{ required: true, message: '请输入物流名称' }]}
          label="物流名称"
          name="logisticsCode"
        ></ProFormSelect>

        <ProFormText
          rules={[{ required: true, message: '物流单号' }]}
          label="物流单号"
          name="logisticsNo"
        ></ProFormText>
      </ModalForm>
      <Drawer
        title="订单详情"
        width={1000}
        open={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
        }}
      >
        {currentItem && currentDetail ? (
          <>
            <ProDescriptions
              column={3}
              columns={descColumns}
              dataSource={currentItem}
            ></ProDescriptions>
            <div>
              <Typography.Title
                style={{
                  marginTop: '20px',
                }}
                level={5}
              >
                订单商品信息
              </Typography.Title>
              <div>
                {currentItem ? (
                  <ProTable
                    search={false}
                    toolBarRender={false}
                    scroll={{ x: 1000 }}
                    dataSource={currentDetail.orderItems}
                    columns={orderItemColumns}
                    pagination={false}
                  ></ProTable>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </Drawer>
      <ExportFieldsModel
        showExportModel={showExportModel}
        setShowExportModel={setShowExportModel}
        fieldType={ExportTypeClassName.OrderToExcel}
        setSelectFields={(values) => onExportList(values)}
      />
    </PageContainer>
  );
}
