import { Button, Card, Form, Spin, message } from 'antd';
import { fetchDetail } from '../LiveList/service';
import { useEffect, useRef, useState } from 'react';
import { TableListItem } from '../LiveList/data';
import {
  PageContainer,
  ProTable,
  ProColumns,
  ActionType,
  ModalForm,
  ProFormRadio,
} from '@ant-design/pro-components';
import queryString from 'query-string';
import { IProduct } from '@/api/type';
import SelectActiveModal from './components/SelectActiveModal';
import SelectedActiveTable from './components/SelectedActiveTable';
import { createLiveActivity, getPage } from './service';
import { TableRequest } from '@/pages/utils/tableRequest';

export default function ProductShowcase() {
  const [loading, setLoading] = useState(true);

  const params = queryString.parse(location.search);

  const [showcaseRecord, setShowcaseRecord] = useState<TableListItem>();

  const [addModalOpen, setAddModalOpen] = useState(false);

  const [selectActiveModalOpen, setSelectActiveModalOpen] = useState(false);
  const [selectActives, setSelectActives] = useState<IProduct[]>([]);

  const [addType, setAddType] = useState<'DIRECT_GET' | 'SIGN'>('DIRECT_GET');

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

  const columns: ProColumns<any>[] = [
    {
      title: '活动名称',
      dataIndex: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      valueEnum: {
        FUDAI: '无门槛福袋',
        SIGN: '签到福袋',
      },
    },
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
      dataIndex: 'name',
    },
    {
      title: '活动奖品',
      dataIndex: 'productList',
      renderText: (text, record) => record.productList[0].name,
    },

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
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
                        setAddModalOpen(true);
                      }}
                      key="button"
                      type="primary"
                    >
                      创建营销活动
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
      <ModalForm
        layout="horizontal"
        title={'创建营销活动'}
        modalProps={{
          destroyOnClose: true,
        }}
        open={addModalOpen}
        onOpenChange={(value) => {
          if (!value) {
            setSelectActives([]);
          }
          setAddModalOpen(value);
        }}
        onFinishFailed={(e) => {
          console.log('e', e);
        }}
        onFinish={async (values) => {
          await createLiveActivity({
            ...values,
            activityId: selectActives[0].id,
            liveRoomId: params.id!,
          });
          reloadTable();
          message.success('创建成功');
          return true;
        }}
      >
        <ProFormRadio.Group
          required
          name={'condition'}
          fieldProps={{
            onChange(e) {
              setAddType(e.target.value);
              setSelectActives([]);
            },
          }}
          label="参与条件"
          initialValue={'DIRECT_GET'}
          options={[
            { label: '直接领取', value: 'DIRECT_GET' },
            { label: '签到', value: 'SIGN' },
          ]}
        ></ProFormRadio.Group>
        <Form.Item shouldUpdate noStyle>
          {({ getFieldValue }) => {
            // setAddType(getFieldValue('method'));
            const isSignIn = getFieldValue('method') === 'SIGN';
            return (
              <Form.Item
                required
                shouldUpdate
                name={'products'}
                rules={[
                  {
                    validator(rule, value, callback) {
                      if (selectActives.length === 0) {
                        callback('请选择适用商品');
                      } else {
                        callback();
                      }
                    },
                  },
                ]}
                label={isSignIn ? '选择签到' : '选择福袋活动'}
              >
                <div>
                  <div>
                    <Button
                      onClick={() => {
                        setSelectActiveModalOpen(true);
                      }}
                      type="link"
                    >
                      选择参与活动
                    </Button>
                  </div>
                  <div>
                    {selectActives.length > 0 ? (
                      <SelectedActiveTable selectRows={selectActives}></SelectedActiveTable>
                    ) : null}
                  </div>
                </div>
              </Form.Item>
            );
          }}
        </Form.Item>
      </ModalForm>
      <SelectActiveModal
        type={addType}
        selectRows={selectActives}
        open={selectActiveModalOpen}
        onCancel={() => {
          setSelectActiveModalOpen(false);
        }}
        onOk={(selectRows) => {
          setSelectActives(selectRows);
          setSelectActiveModalOpen(false);
        }}
      />
    </PageContainer>
  );
}
