export interface TableListItem {
  id: string; // id
  userId: string | number; // 用户id
  userName: string; // 用户名
  phone: string; // 用户手机号
  orderNo: number; //orderNo	订单号
  endTime: number; //endTime 入账结束时间
  payMethod: number; //payMethod	支付方式
  startTime: string; //startTime	入账开始时间
  tradeType: string; //phone	交易类型
  type: string; //类型 add/收入 reduce/支出
  payOrderNo: string; // 支付订单号
  amount: string; // 收支金额
  transactionId: string;
}

interface IRequestParams {
  pageNo: number;
  pageSize: number;
  startTime?: string;
  endTime?: string;
  type?: string | undefined;
}

interface IActiveTimeObj {
  entryTime?: number | string[];
}
