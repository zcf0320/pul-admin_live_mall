export type TableListItem = {
  commissionTotal: number; //结算总佣金	number
  orderAmount: number; //结算订单额	number
  orderCount: string; //结算订单数	integer
  perCapitaIncome: number; //人均收益	number
  settleDay?: string; //结算时间	string
  settleMonthly?: string; //结算时间（月份）	string
  userCount: string; //结算人数	integer
};
export interface SettlementDataType {
  commissionTotal: string;
  orderAmount: string;
  orderCount: number;
  perCapitaIncome: string;
  userCount: number;
}
