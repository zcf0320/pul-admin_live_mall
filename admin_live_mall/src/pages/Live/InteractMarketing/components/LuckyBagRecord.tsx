import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Drawer, DrawerProps, InputNumber, message } from 'antd';
import { forwardRef, Ref, useImperativeHandle, useRef, useState } from 'react';
import styles from '../index.module.less';
import { CloseCircleOutlined } from '@ant-design/icons';
import { TableRequest } from '@/pages/utils/tableRequest';
import { fetchPrizeList, postOpenPrize, postRandomSelectUser } from '../service';
import { ActiveUser } from '../data';

type IProps = DrawerProps & {
  tableParams: Record<string, string | number>;
  addModalOpen: () => void;
  success: () => void;
};

export interface LuckyBagRecordInstance {
  reload: () => Promise<void> | undefined;
}

function LuckyBagRecord(props: IProps, ref: Ref<LuckyBagRecordInstance>) {
  const { tableParams, addModalOpen, success } = props;

  const tableActionRef = useRef<ActionType>(null);

  useImperativeHandle(
    ref,
    () => {
      return {
        reload: () => tableActionRef.current?.reload(),
      };
    },
    [],
  );

  const [selectUser, setSelectUser] = useState<ActiveUser[]>([]);

  const renderSelect = (record: ActiveUser) => {
    return (
      <Button
        type="link"
        disabled={selectUser.findIndex((item) => item.userId === record.userId) > -1}
        onClick={() => {
          setSelectUser((user) => {
            const newUserList = [...user];
            newUserList.push(record);
            return newUserList;
          });
        }}
      >
        选择
      </Button>
    );
  };

  const columns: ProColumns<any>[] = [
    {
      hideInTable: true,
      title: '用户信息',
      dataIndex: 'userInfo',
    },
    {
      title: '姓名昵称',
      dataIndex: 'userName',
      search: false,
    },
    {
      title: '头像',
      dataIndex: 'headImage',
      valueType: 'avatar',
      search: false,
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      search: false,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      search: false,
    },
    {
      title: '签到时长',
      dataIndex: 'totalTime',
      search: false,
      renderText: (text) => {
        const seconds = Number(text);
        const second = seconds % 60;
        const minute = Math.floor(seconds / 60) % 60;
        return minute + '分' + second + '秒';
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      search: false,
      render: (node, record) => [renderSelect(record)],
    },
  ];

  const [randomNumber, setRandomNumber] = useState<number>(1);

  const randomSelect = async () => {
    // TODO: 随机选择
    const result = await postRandomSelectUser({
      liveActivityId: tableParams.liveActivityId as string,
      userIdList: selectUser.map((item) => item.userId),
      size: randomNumber,
    });
    setSelectUser((user) => {
      const newUserList = [
        ...user,
        ...result.data.map((item) => ({
          ...item,
          userId: item.id,
        })),
      ];
      return newUserList;
    });
    message.success('选择成功');
    tableActionRef.current?.reload();
  };

  const deleteSelectUser = (record: ActiveUser) => {
    setSelectUser((user) => {
      const newUserList = [...user];
      return newUserList.filter((item) => item.id !== record.id);
    });
  };

  const renderAdd = () => {
    return (
      <Button onClick={addModalOpen} type="primary">
        导入名单到奖池
      </Button>
    );
  };

  const openPrize = async () => {
    await postOpenPrize({
      liveActivityId: tableParams.liveActivityId as string,
      userIdList: selectUser.map((item) => item.userId),
    });
    message.success('开奖成功');
    setSelectUser([]);
    success();
  };

  return (
    <Drawer {...props}>
      <ProTable
        actionRef={tableActionRef}
        toolBarRender={() => [renderAdd()]}
        options={false}
        columns={columns}
        params={tableParams}
        request={(params) => TableRequest(params, fetchPrizeList)}
      ></ProTable>
      <div style={{ width: '100%', justifyContent: 'flex-end', display: 'flex' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #1890ff',
            width: 'fit-content',
            paddingLeft: 20,
            borderRadius: 8,
          }}
        >
          <span>随机选</span>
          <InputNumber
            bordered={false}
            min={1}
            onChange={(value) => {
              setRandomNumber(value ?? 1);
            }}
            value={randomNumber}
            style={{ width: 60, marginInline: 10 }}
            placeholder="输入数字"
          ></InputNumber>
          <span style={{ marginRight: 10 }}>个</span>
          <Button onClick={randomSelect} type="primary">
            确定
          </Button>
        </div>
      </div>
      <div>
        <div>已选中奖用户：{selectUser.length}</div>
        <div className={styles['select-user-container']}>
          {selectUser.map((item) => {
            return (
              <div key={'123'} className={styles['select-user-item']}>
                <div className={styles['select-user-close']}>
                  <CloseCircleOutlined
                    onClick={() => {
                      deleteSelectUser(item);
                    }}
                  />
                </div>
                <img src={item.headImage} alt="" />
                <div
                  style={{
                    marginLeft: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>{item.userName}</div>
                  <div style={{ fontSize: 12 }}>{item.userId}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button onClick={openPrize} type="primary">
          开奖（{selectUser.length}）
        </Button>
      </div>
    </Drawer>
  );
}

export default forwardRef(LuckyBagRecord);
