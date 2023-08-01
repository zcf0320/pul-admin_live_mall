import { FC, memo } from 'react';
import { Avatar, Drawer } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import styles from '@/pages/Customer/TotalCustomer/index.module.less';

interface IProps {
  showDetail: boolean;
  setShowDetail: () => void;
  id?: string;
  headImage?: string;
  userName?: string;
  phone?: string;
  registerTime?: string;
  consumptionAmount?: number;
  consumptionNum?: number;
  consumptionTime?: string;
}

const DetailDrawer: FC<IProps> = (props: IProps) => {
  const {
    showDetail = false,
    setShowDetail,
    headImage = '',
    userName = '-',
    phone = '-',
    registerTime = '-',
    consumptionAmount = 0,
    consumptionNum = 0,
    consumptionTime = '-',
  } = props || {};
  return (
    <Drawer
      open={showDetail}
      title="客户详情"
      width={800}
      onClose={setShowDetail}
      className={styles.customerDetail}
    >
      <div className={styles.customerInfo}>
        <h3>基本信息</h3>
        <div className={styles.firstColumn}>
          <Avatar size={50} icon={<UserOutlined />} src={headImage} className={styles.avatar} />
        </div>
        <div className={styles.secondColumn}>
          <p>
            客户姓名：
            <span>{userName ?? '-'}</span>
          </p>
          <p>
            手机号：<span>{phone ?? '-'}</span>
          </p>
        </div>
        <div className={styles.secondColumn}>
          <p>
            成为客户时间：<span>{registerTime ?? '-'}</span>
          </p>
          {/*<p>*/}
          {/*  签到天数：<span>{signInDays ?? 0} 天</span>*/}
          {/*</p>*/}
        </div>
      </div>
      <div className={styles.statistics}>
        <h3>交易统计</h3>
        <div className={styles.firstColumn}>
          <p>
            累计消费金额(元)：
            <span>{consumptionAmount ?? 0}元</span>
          </p>
          <p>累计消费次数：{consumptionNum ?? 0}次</p>
        </div>
        <div className={styles.secondColumn}>
          <p>客单价：{Number(consumptionAmount / consumptionNum) || 0}元</p>
          <p>最近交易时间：{consumptionTime ?? '-'}</p>
        </div>
      </div>
    </Drawer>
  );
};

export default memo(DetailDrawer);
