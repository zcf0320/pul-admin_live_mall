import { useRef } from 'react';
import { TableRequest } from '@/pages/utils/tableRequest';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import type { TableListItem } from './data';
import { delLevel, getlevelList } from './service';
import { Button, message, Popconfirm } from 'antd';
import { history } from '@umijs/max';

export default () => {
  const ref = useRef<ActionType>();
  const reloadTable = () => {
    ref.current?.reload();
  };

  const renderToolbar = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Button
        onClick={() => {
          history.push('/distribution/settings/AddLevel');
        }}
        type="primary"
      >
        添加等级
      </Button>
    </div>
  );

  const edit = (record: TableListItem) => {
    return (
      <a
        key="edit"
        onClick={() => {
          console.log(record);
          history.push('/distribution/settings/AddLevel', record);
        }}
      >
        编辑
      </a>
    );
  };

  //删除
  const deleteLabel = (record: any) => (
    <Popconfirm
      key="deleteLabel"
      title="确定要删除吗?"
      onConfirm={async () => {
        const res = await delLevel({ id: record.id });
        if (res.code === 0) {
          message.success('删除成功！');
          reloadTable();
        } else {
          message.error('删除失败！');
        }
      }}
    >
      <a>删除</a>
    </Popconfirm>
  );

  // const renderTip = (
  //   <Tooltip
  //     color="#fff"
  //     title={() => {
  //       return (
  //         <div style={{ color: '#666', padding: 10 }}>
  //           <div> 最后添加的，等级最高；</div>
  //           <div>团长触发升级条件时，系统会从高往低检测，将团长升级为满足条件的最高等级。</div>
  //         </div>
  //       );
  //     }}
  //   >
  //     <a>团长等级说明</a>
  //   </Tooltip>
  // );

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '',
      width: 90,
      dataIndex: 'level',
      search: false,
      renderText: (text) => {
        return '等级' + text;
      },
    },

    {
      title: '等级名称',
      width: 90,
      dataIndex: 'name',
      search: false,
    },
    {
      title: '当前人数',
      width: 90,
      dataIndex: 'customerTotal',
      search: false,
    },
    // {
    //   title: '升级条件',
    //   dataIndex: '',
    //   width: 160,
    //   search: false,
    //   render: (node, record) => {
    //     return (
    //       <div style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
    //         {record.level === 1 && <div>无，成为团长默认为此等级</div>}
    //         {record.level !== 1 && (
    //           <>
    //             {record.inviteCount && <div>邀请人数 ≥ {record.inviteCount}人</div>}
    //             {record.customerCount && <div>累计客户数 ≥ {record.customerCount}人</div>}
    //             {record.totalAmount && <div>累计消费额 ≥ ￥{record.totalAmount}</div>}
    //             {record.commissionOrderCount && (
    //               <div>分佣订单数 ≥{record.commissionOrderCount}</div>
    //             )}
    //             {record.commissionOrderAmount && (
    //               <div>分佣订单额 ≥ ￥{record.commissionOrderAmount}</div>
    //             )}
    //             {record.settledCommissionAmount && (
    //               <div>已结算佣金金额 ≥ ￥{record.settledCommissionAmount}</div>
    //             )}
    //           </>
    //         )}
    //       </div>
    //     );
    //   },
    // },
    {
      title: '佣金系数',
      dataIndex: '',
      width: 100,
      search: false,
      render: (node, record) => {
        return (
          <div style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
            <div>直推佣金： ×{record.directCommissionRate}</div>
            {/* <div>邀请奖励： ×{record.invitationRewardRate}</div> */}
          </div>
        );
      },
    },

    {
      title: '操作',
      width: 80,
      fixed: 'right',
      valueType: 'option',
      align: 'center',
      render: (_, record: TableListItem) => (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          {edit(record)}
          {record.level !== 1 && deleteLabel(record)}
        </div>
      ),
    },
  ];

  //const key = 'TEAM_LEVEL_RULE';

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      {/*<Card title="等级规则设置">*/}
      {/*  <ProForm<{ type: string }>*/}
      {/*    layout={'horizontal'}*/}
      {/*    request={async () => {*/}
      {/*      const res = await getDiyAppletSettings({ keys: [key] });*/}
      {/*      if (res.data) return { type: res.data[key] };*/}
      {/*      return {} as any;*/}
      {/*    }}*/}
      {/*    onFinish={async (v) => {*/}
      {/*      console.log('表单', v);*/}
      {/*      const res = await setDiyAppletSettings({*/}
      {/*        settingList: [*/}
      {/*          {*/}
      {/*            key,*/}
      {/*            value: v.type,*/}
      {/*          },*/}
      {/*        ],*/}
      {/*      });*/}
      {/*      if (res.code === 0) message.success('成功！');*/}
      {/*    }}*/}
      {/*    submitter={{ resetButtonProps: false }}*/}
      {/*  >*/}
      {/*    <ProFormRadio.Group*/}
      {/*      name="type"*/}
      {/*      label="交易类条件生效时间"*/}
      {/*      options={[*/}
      {/*        {*/}
      {/*          label: '付款后生效',*/}
      {/*          value: '1',*/}
      {/*        },*/}
      {/*        {*/}
      {/*          label: '交易完成后生效',*/}
      {/*          value: '2',*/}
      {/*        },*/}
      {/*      ]}*/}
      {/*    />*/}
      {/*  </ProForm>*/}
      {/*</Card>*/}
      <br />
      <ProTable<TableListItem>
        columns={columns}
        actionRef={ref}
        // toolBarRender={() => [renderTip]}
        scroll={{ x: 1000 }}
        headerTitle={renderToolbar}
        search={false}
        request={(params) => TableRequest(params, getlevelList)}
      />
    </PageContainer>
  );
};
