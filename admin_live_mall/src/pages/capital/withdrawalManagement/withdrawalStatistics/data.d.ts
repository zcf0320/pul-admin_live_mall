interface IWithDrawStatistic {
  applicantCount: number; // 申请人数
  applicationCount: number; // 申请笔数
  failedWithdrawalCount: number; // 提现失败笔数
  successfulWithdrawalCount: number; //	提现成功笔数
  totalFailedWithdrawalAmount: number; // 	提现失败金额总计
  totalSuccessfulWithdrawalAmount: number; // 提现成功金额总计
  totalWithdrawalAmount: number; // 提现金额总计
}
