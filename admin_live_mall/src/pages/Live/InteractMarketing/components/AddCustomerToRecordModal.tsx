import { TableRequest } from '@/pages/utils/tableRequest';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Modal, ModalFuncProps } from 'antd';
import { useState } from 'react';
import { fetchUserList, postImportUserToPrize } from '../service';

type IProps = ModalFuncProps & {
  tableParams: Record<string, string | number>;
  success: () => void;
};

export default function AddCustomerToRecordModal(props: IProps) {
  const { tableParams, success } = props;

  const [selectRowKeys, setSelectRowKeys] = useState<string[]>([]);

  const columns: ProColumns<any>[] = [
    {
      hideInTable: true,
      title: '用户信息',
      dataIndex: 'id',
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
      dataIndex: 'id',
      search: false,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      search: false,
    },
    {
      title: '是否观看直播',
      dataIndex: 'watched',
      valueEnum: {
        true: '是',
        false: '否',
      },
      search: false,
    },
  ];

  const addCustomer = async () => {
    //TODO
    await postImportUserToPrize({
      liveActivityId: tableParams.liveActivityId as string,
      userIdList: selectRowKeys,
    });
    message.success('导入成功');
    setSelectRowKeys([]);
    success();
  };

  const renderFooter = () => {
    return (
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Button onClick={addCustomer} disabled={selectRowKeys.length === 0} type="primary">
          导入({selectRowKeys.length}人)
        </Button>
      </div>
    );
  };

  return (
    <Modal destroyOnClose {...props} footer={renderFooter()}>
      <ProTable
        rowSelection={{
          selectedRowKeys: selectRowKeys,
          onChange: (selectedRowKeys) => {
            setSelectRowKeys(selectedRowKeys as string[]);
          },
        }}
        rowKey={'id'}
        request={(params) => TableRequest(params, fetchUserList)}
        options={false}
        columns={columns}
        params={tableParams}
      ></ProTable>
    </Modal>
  );
}
