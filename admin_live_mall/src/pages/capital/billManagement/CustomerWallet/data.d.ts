interface IRequestParam {
  pageNo: number;
  pageSize: number;
  customerInfo?: string;
  minValue?: string;
  maxValue?: string;
}

interface ICustomerWalletList {
  userName: string;
  headImage: string;
  userId: string;
  phone: string;
  registerTime: string;
  balanceMoney: string;
}

interface IQuotaParam {
  id: string;
  amount: string;
  remarks: string;
}
