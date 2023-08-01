import { useCallback, useRef, useState } from 'react';
import type { TableListItem } from './data';
import { commissionDistribution, getPage, getPersonnel } from './service';
import { Button, message } from 'antd';
import {
  ActionType,
  ModalForm,
  ProColumns,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import './index.less';

export default () => {
  const ref = useRef<ActionType>();
  const reloadTable = () => {
    ref.current?.reload();
  };

  const [totalRealCommission, setTotalRealCommission] = useState<number>();
  const [userId, setUserId] = useState<number>();

  const distribution = useCallback(
    () => (
      <ModalForm
        width={400}
        key="label"
        title="确定要发放佣金吗?"
        trigger={<Button type="primary">发放佣金</Button>}
        modalProps={{ destroyOnClose: true, maskClosable: false }}
        onFinish={async (v) => {
          const msg = await commissionDistribution({ ...v, id: userId });

          if (msg.code === 0) {
            message.success('成功！');
            reloadTable();
          } else {
            message.error('失败！');
            return false;
          }
          return true;
        }}
      >
        <ProFormText
          name="remark"
          label="备注"
          placeholder="请填写备注"
          rules={[{ required: true }]}
        />
      </ModalForm>
    ),
    [userId],
  );

  //列表
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '渠道',
      width: 90,
      dataIndex: 'channelId',
      align: 'center',
      hideInTable: true,
      valueType: 'select',
      request: async () => {
        const msg = await getPersonnel({ pageNo: 1, pageSize: 10000 });
        const options = msg?.data?.records?.map((item: any) => ({
          value: item.id,
          label: item.name,
          phone: item.phone,
        }));
        return options;
      },
      fieldProps: {
        onChange(e: number) {
          setUserId(e);
        },
      },
    },
    {
      title: '渠道名称',
      width: 120,
      dataIndex: 'channelName',
      align: 'center',
      search: false,
      ellipsis: true,
    },
    { title: '订单编号', width: 230, dataIndex: 'orderNo', align: 'center', copyable: true },
    {
      title: '流水号',
      width: 230,
      dataIndex: 'serialNo',
      align: 'center',
      copyable: true,
    },
    {
      title: '佣金比例',
      width: 100,
      dataIndex: 'commissionRate',
      search: false,
      align: 'center',
      renderText: (_, record) => Number(record.commissionRate) * 100 + '%',
    },
    {
      title: '佣金',
      width: 100,
      dataIndex: 'estimatedCommission',
      align: 'center',
      search: false,
      render: (_, record) => {
        return (
          <span>
            {record.settleFlag === '待结算'
              ? record.estimatedCommission + '(预估)'
              : record.realCommission}
          </span>
        );
      },
    },
    {
      title: '状态',
      width: 90,
      dataIndex: 'settleFlag',
      align: 'center',
      search: false,
      valueEnum: {
        已发放: { text: '已发放', status: 'success' },
        已结算: { text: '已结算', status: 'default' },
        待结算: { text: '待结算', status: 'processing' },
      },
    },
    // 0-待结算 1-已结算 2-已发放
    {
      title: '状态',
      width: 90,
      dataIndex: 'settleFlag',
      align: 'center',
      hideInTable: true,
      valueEnum: {
        2: { text: '已发放', status: 'success' },
        1: { text: '已结算', status: 'default' },
        0: { text: '待结算', status: 'processing' },
      },
    },
    { title: '结算时间', width: 140, dataIndex: 'settleTime', align: 'center', search: false },
    {
      title: '佣金发放时间',
      width: 140,
      dataIndex: 'distributionTime',
      align: 'center',
      search: false,
    },
    {
      title: '备注',
      width: 140,
      dataIndex: 'remark',
      align: 'center',
      search: false,
      ellipsis: true,
    },
  ];
  return (
    <>
      <ProTable<TableListItem>
        columns={columns}
        actionRef={ref}
        scroll={{ x: 1500 }}
        headerTitle="佣金列表"
        search={{
          labelWidth: 'auto',
          span: 6,
          defaultCollapsed: false,
          collapsed: false,
          className: 'search',
          collapseRender: () => {
            return null;
          },
          optionRender: (_searchConfig, _formProps, dom) => {
            return [
              <div key="box" style={{ display: 'flex', alignItems: 'center', gap: 8, width: 800 }}>
                {dom}
                {totalRealCommission && totalRealCommission > 0 ? (
                  <>
                    <div style={{ fontSize: 16, color: '#333', marginRight: 20 }}>
                      <span>总金额：</span>
                      <span style={{ color: '#4190f7', fontWeight: 600 }}>
                        {totalRealCommission}
                      </span>
                    </div>
                    {distribution()}
                  </>
                ) : (
                  <span key="tip" style={{ color: '#666', marginLeft: 10 }}>
                    选择渠道和“已结算”状态搜索后可发放佣金
                  </span>
                )}
              </div>,
            ];
          },
        }}
        request={async (params) => {
          const res = await getPage(params);
          setTotalRealCommission(res.data.totalRealCommission);
          return {
            data: res?.data?.commissionPage?.records?.map((item: any) => ({
              ...item,
              key: item.id,
            })),
            total: res?.page?.data?.total,
          };
        }}
      />
    </>
  );
};
