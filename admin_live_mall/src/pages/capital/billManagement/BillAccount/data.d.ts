interface IRequestParams {
  pageNo: number;
  pageSize: number;
  total: number;
  pay?: string;
  payMethod?: string;
  payMethodLabel?: string;
  month?: string;
  key?: string;
  startTime?: string;
  endTime?: string;
}

interface IBillAccountDetail {
  totalExpenditure: string | number;
  totalIncome: string | number;
  totalIncomeCount: string | number;
  totalExpenditureCount: string | number;
}

interface IBillDetail {
  addCount: number;
  addTotal: string;
  reduceCount: number;
  reduceTotal: string;
}

interface IBillAccountList {
  createDate: string;
  payMethod: string;
  pay: string;
  incomeAmount: string;
  incomeCount: string;
  expenditureAmount: string;
  expenditureCount: string;
}
