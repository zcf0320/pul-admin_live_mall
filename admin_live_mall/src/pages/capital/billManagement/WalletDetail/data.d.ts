interface ICustomerInfo {
  balanceMoney: number; // 	总余额
  frozenMoney: number; // 冻结金额
  headImage: string; //	头像
  id: string; //钱包id
  phone: string; //	手机号码
  registerTime: string; //注册时间
  totalMoney: number; //总金额
  userId: string; //	用户ID
  userName: string; //	账户名称
  expenditureAmount: number; //支出金额
  expenditureCount: number; //	支出笔数
  incomeAmount: number; //	收入金额
  incomeCount: number; //	收入笔数
}

interface IWalletDetailList {
  createTime: string;
  type: string;
  balance: string;
  operation: string;
  remarks: string;
}

interface IWalletDetailRequestParam {
  pageNo: number;
  pageSize: number;
  minValue?: string;
  maxValue?: string;
  operation?: number;
}

interface IWalletDetailFormValues {
  type: string;
  minValue: string;
  maxValue: string;
  time: string;
  startTime: string;
  endTime: string;
}
