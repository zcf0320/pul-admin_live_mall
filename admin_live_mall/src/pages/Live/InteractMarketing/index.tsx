import { Button, Card, message, Spin } from 'antd';
import { fetchDetail } from '../LiveList/service';
import { useEffect, useRef, useState } from 'react';
import { TableListItem } from '../LiveList/data';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import queryString from 'query-string';
import SelectActiveModal from './components/SelectActiveModal';
import { createLiveActivity, getPage } from './service';
import { TableRequest } from '@/pages/utils/tableRequest';
import LuckyBagRecord, { LuckyBagRecordInstance } from './components/LuckyBagRecord';
import { ILiveActive } from './data';
import AddCustomerToRecordModal from './components/AddCustomerToRecordModal';
import { history } from '@umijs/max';

export default function ProductShowcase() {
  const [loading, setLoading] = useState(true);

  const params = queryString.parse(location.search);

  const [showcaseRecord, setShowcaseRecord] = useState<TableListItem>();

  const [selectActiveModalOpen, setSelectActiveModalOpen] = useState(false);
  const [luckyBagModalOpen, setLuckyBagModalOpen] = useState(false);
  const [currentActive, setCurrentActive] = useState<ILiveActive>();

  const [addModalOpen, setAddModalOpen] = useState(false);

  const luckyBagRecordRef = useRef<LuckyBagRecordInstance>(null);

  const actionRef = useRef<ActionType>();

  const reloadTable = () => {
    actionRef.current?.reload();
  };

  const loadData = () => {
    fetchDetail({
      id: params.id,
    })
      .then((res) => {
        setShowcaseRecord(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const renderSee = (record: ILiveActive) => {
    if (record.status !== 'RUNNING') return;
    return (
      <a
        onClick={() => {
          setCurrentActive(record);
          setLuckyBagModalOpen(true);
        }}
      >
        查看抽奖名单
      </a>
    );
  };

  const renderSeeList = (record: ILiveActive) => {
    if (record.status !== 'END') return;
    return (
      <a
        onClick={() => {
          // setCurrentActive(record);
          // setLuckyBagModalOpen(true);

          history.push('/Marketing/LuckyBagDetail?id=' + record.activityId);
        }}
      >
        查看中奖名单
      </a>
    );
  };

  const columns: ProColumns<any>[] = [
    {
      title: '活动名称',
      dataIndex: 'name',
    },
    // {
    //   title: '类型',
    //   dataIndex: 'type',
    //   valueEnum: {
    //     FUDAI: '无门槛福袋',
    //     SIGN: '签到福袋',
    //   },
    // },
    {
      title: '活动状态',
      dataIndex: 'status',
      valueEnum: {
        NO_START: '未开始',
        RUNNING: '进行中',
        END: '已结束',
      },
    },
    {
      title: '参与人数',
      dataIndex: 'persons',
    },
    {
      title: '活动奖品',
      dataIndex: 'productList',
      renderText: (text, record) => (record.product ? record.product.name : ''),
    },

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 100,
      align: 'center',
      render: (node, record) => [renderSee(record), renderSeeList(record)],
    },
  ];

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <Card>
        {!loading && showcaseRecord ? (
          <div>
            <div style={{ display: 'flex' }}>
              <img
                style={{ width: 200, height: 150, objectFit: 'contain' }}
                src={showcaseRecord.cover}
              />
              <div style={{ marginLeft: 20 }}>
                <div style={{ fontSize: 16 }}>{showcaseRecord.name}</div>
                <div style={{ marginTop: 10 }}>
                  开播时间：{showcaseRecord.startTime}/{showcaseRecord.endTime}
                </div>
                <div style={{ marginTop: 10, display: 'flex' }}>
                  <span>主播：{showcaseRecord.playerNickname}</span>
                  <span style={{ marginLeft: 10 }}>微信号：{showcaseRecord.playerAccount}</span>
                  <span style={{ marginLeft: 10 }}>状态：{showcaseRecord.liveStatus}</span>
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
                params={{
                  liveRoomId: params.id,
                }}
                columns={columns}
                request={(params) => TableRequest(params, getPage)}
                toolBarRender={() => {
                  return [
                    <Button
                      onClick={() => {
                        setSelectActiveModalOpen(true);
                      }}
                      key="button"
                      type="primary"
                    >
                      投放营销活动
                    </Button>,
                  ];
                }}
              ></ProTable>
            </div>
          </div>
        ) : (
          <Spin />
        )}
      </Card>
      {/* <ModalForm
        layout="horizontal"
        title={'创建营销活动'}
        modalProps={{
          destroyOnClose: true,
        }}
        open={addModalOpen}
        onOpenChange={(value) => {
          setAddModalOpen(value);
        }}
        onFinishFailed={(e) => {
          console.log('e', e);
        }}
        onFinish={async (values) => {
          await createLiveActivity({
            ...values,

            liveRoomId: params.id!,
          });
          reloadTable();
          message.success('创建成功');
          return true;
        }}
      ></ModalForm> */}
      <SelectActiveModal
        open={selectActiveModalOpen}
        onCancel={() => {
          setSelectActiveModalOpen(false);
        }}
        onOk={async (selectActive) => {
          await createLiveActivity({
            activityId: selectActive.id,
            liveRoomId: params.id!,
          });
          setSelectActiveModalOpen(false);
          reloadTable();
          message.success('投放成功');
        }}
      />
      <LuckyBagRecord
        ref={luckyBagRecordRef}
        success={() => {
          setLuckyBagModalOpen(false);
          actionRef.current?.reload();
        }}
        addModalOpen={() => {
          setAddModalOpen(true);
        }}
        tableParams={{
          liveActivityId: currentActive?.id ?? '',
        }}
        title="查看抽奖名单"
        open={luckyBagModalOpen}
        maskClosable={false}
        width={1000}
        onClose={() => {
          setLuckyBagModalOpen(false);
        }}
      />
      <AddCustomerToRecordModal
        success={() => {
          setAddModalOpen(false);
          luckyBagRecordRef.current?.reload();
        }}
        title="导入名单到奖池"
        open={addModalOpen}
        width={1000}
        onCancel={() => {
          setAddModalOpen(false);
        }}
        tableParams={{
          liveActivityId: currentActive?.id ?? '',
        }}
      />
    </PageContainer>
  );
}
