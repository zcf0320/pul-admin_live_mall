import { Card, message, Modal, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import queryString from 'query-string';
import { TableRequest } from '@/pages/utils/tableRequest';
import { fetchGetPrizeList, getDetail, getPage, postSendPrize } from './service';
import { ILuckyBagDetail, TableListItem } from './data';

export default function ProductShowcase() {
  const [loading, setLoading] = useState(false);

  const params = queryString.parse(location.search);

  // const [showcaseRecord, setShowcaseRecord] = useState<LiveListItem>({});
  const [luckyBagDetail, setLuckyBagDetail] = useState<ILuckyBagDetail>();

  const [seeModalOpen, setSeeModalOpen] = useState(false);
  const [grantModalOpen, setGrantModalOpen] = useState(false);
  const [remarkModalOpen, setRemarkModalOpen] = useState(false);

  const [currentItem, setCurrentItem] = useState<TableListItem>();
  const [currentSendItem, setCurrentSendItem] = useState<any>();

  const actionRef = useRef<ActionType>();

  const prizeActionRef = useRef<ActionType>();

  const loadData = () => {
    getDetail({
      id: params.id,
    })
      .then((res) => {
        setLuckyBagDetail(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const reloadTable = () => {
    actionRef.current?.reload();
  };

  const renderGrant = () => {
    return <a>发放</a>;
  };

  const renderRemark = () => {
    return <a>备注</a>;
  };

  const renderSee = (record: TableListItem) => {
    if (record.status !== 'END') return;
    return (
      <a
        onClick={() => {
          setSeeModalOpen(true);
          setCurrentItem(record);
        }}
      >
        查看中奖名单
      </a>
    );
  };

  const renderSend = (record: any) => {
    if (record.send) return;
    return (
      <a
        onClick={() => {
          setGrantModalOpen(true);
          setCurrentSendItem(record);
        }}
      >
        发放
      </a>
    );
  };

  const modalColumns: ProColumns<any>[] = [
    {
      title: '用户ID',
      dataIndex: 'userId',
    },
    {
      title: '用户昵称',
      dataIndex: 'userName',
    },
    {
      title: '用户手机号',
      dataIndex: 'phone',
    },
    {
      title: '发放状态',
      dataIndex: 'send',
      valueEnum: {
        false: '未发放',
        true: '已发放',
      },
    },
    {
      title: '物流信息',
      dataIndex: 'logisticsNo',
      render: (node, record) => {
        return (
          <div>
            <div>{record.logisticsName}</div>
            <div>{record.logisticsNo}</div>
          </div>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (node, record) => [renderSend(record)],
    },
  ];

  const columns: ProColumns<any>[] = [
    {
      title: '已关联直播间',
      dataIndex: 'liveRoomId',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        RUNNING: '进行中',
        END: '已结束',
      },
    },
    {
      title: '参与人数',
      dataIndex: 'persons',
    },
    {
      title: '中奖人数',
      dataIndex: 'lotteryPersons',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (node, record) => [renderSee(record)],
    },
  ];

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <Card>
        {!loading && luckyBagDetail ? (
          <div>
            <div style={{ display: 'flex' }}>
              {/* <img
                style={{ width: 200, height: 150, objectFit: 'contain' }}
                src={showcaseRecord.cover}
              /> */}
              <div style={{ marginLeft: 20 }}>
                <div style={{ fontSize: 16 }}>{luckyBagDetail.name}</div>
                <div style={{ marginTop: 10 }}>创建时间{luckyBagDetail.createTime}</div>
                <div style={{ marginTop: 10, display: 'flex' }}>
                  <span>已关联直播间：{luckyBagDetail.liveRooms}个</span>
                  <span style={{ marginLeft: 10 }}>参与人数：{luckyBagDetail.persons ?? 0}人</span>
                  <span style={{ marginLeft: 10 }}>
                    中奖人数：{luckyBagDetail.lotteryPersons ?? 0}人
                  </span>
                  <span style={{ marginLeft: 10 }}>奖品名称：{luckyBagDetail.goodsName}</span>
                </div>
              </div>
            </div>
            {/* <div style={{ marginTop: 10 }}>
              <Button type="primary">导入商品</Button>
            </div> */}
            <div>
              <ProTable
                actionRef={actionRef}
                search={false}
                columns={columns}
                params={{ id: params.id! }}
                request={(params) => TableRequest(params, getPage)}
              ></ProTable>
            </div>
          </div>
        ) : (
          <Spin />
        )}
      </Card>
      <Modal
        width={1000}
        title="查看中奖名单"
        open={seeModalOpen}
        footer={null}
        onCancel={() => {
          setSeeModalOpen(false);
        }}
        destroyOnClose
      >
        <ProTable
          actionRef={prizeActionRef}
          params={{ fuDaiId: params.id!, liveActivityId: currentItem?.id }}
          request={(params) => TableRequest(params, fetchGetPrizeList)}
          search={false}
          options={false}
          columns={modalColumns}
        ></ProTable>
      </Modal>
      <ModalForm
        modalProps={{
          zIndex: 1001,
        }}
        onFinish={async (values) => {
          await postSendPrize({
            id: currentSendItem.id,
            ...values,
          });
          message.success('奖品发放成功');
          prizeActionRef.current?.reload();
          return true;
        }}
        width={500}
        title="奖品发放"
        open={grantModalOpen}
        onOpenChange={setGrantModalOpen}
      >
        {/* <ProFormText label="备注" name={'remark'}></ProFormText> */}
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入物流名称',
            },
          ]}
          label="物流名称"
          name={'logisticsName'}
          placeholder={'请输入物流名称'}
        ></ProFormText>
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入物流单号',
            },
          ]}
          label="物流单号"
          name={'logisticsNo'}
          placeholder={'请输入物流单号'}
        ></ProFormText>
      </ModalForm>
    </PageContainer>
  );
}
