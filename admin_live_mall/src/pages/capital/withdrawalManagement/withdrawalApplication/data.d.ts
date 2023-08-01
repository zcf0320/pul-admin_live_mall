interface IRecord {
  id: string;
  headImage: string;
  userName: string;
  userPhone: string;
  createTime: string;
  passTime: string;
  time: string;
  dealChannel: number;
  amount: string;
  charge: string;
  account: string;
  name: string;
  remark: string;
}

interface IColumnRecord {
  operateMethod?: string;
  selectArr?: IRecord[];
  operateType?: string;
}

interface IParams {
  pageNo: number;
  pageSize: number;
  customerInfo?: string;
  startTime?: string;
  endTime?: string;
  dealChannel?: string;
  payee?: string;
  afterSaleStatus?: number;
  excludeColumnFieldNames?: string[];
}
