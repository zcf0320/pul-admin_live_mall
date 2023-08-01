import { ProTable, ProColumns } from '@ant-design/pro-components';
import { IProduct } from '@/api/type';

interface IProps {
  selectRows: IProduct[];
}

export default function SelectedActiveTable(props: IProps) {
  const { selectRows } = props;

  const columns: ProColumns<any>[] = [
    {
      title: '活动id',
      dataIndex: 'id',
    },
    {
      title: '活动名称',
      dataIndex: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      search: false,
      ellipsis: true,
      valueEnum: {
        true: '已绑定',
        false: '未绑定',
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 160,
      search: false,
      ellipsis: true,
      align: 'center',
    },
  ];

  return (
    <div>
      <ProTable
        pagination={{ defaultPageSize: 10, showSizeChanger: true }}
        columns={columns}
        rowKey={'id'}
        search={false}
        dataSource={selectRows}
        // request={(params) => {
        //   return TableRequest({ ...params }, getProductList);
        // }}
      ></ProTable>
    </div>
  );
}
