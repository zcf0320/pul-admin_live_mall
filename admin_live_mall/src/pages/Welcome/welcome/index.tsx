import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import React from 'react';
// import styles from './index.less';
// import product from '@/assets/产品.png';
// import brand from '@/assets/品牌.png';
// import pallet from '@/assets/货盘.png';
// import channel from '@/assets/渠道.png';
const Welcome: React.FC = () => {
  // const [indexData, setIndexData] = useState<any>();
  // useEffect(() => {
  //   // getSystemIndexData().then((res) => {
  //   //   setIndexData(res.data);
  //   // });
  // }, []);
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <Card />
      {/* <div className={styles['section-box']}>
        <div className={styles['section-title']}>数据概况</div>
        <div className={styles['inner-box']}>
          <div>
            <Statistic
              title="产品数量"
              value={indexData?.goodsCount}
              valueStyle={{ textAlign: 'center' }}
            />
          </div>
          <div>
            <Statistic
              title="货盘数量"
              value={indexData?.palletCount}
              valueStyle={{ textAlign: 'center' }}
            />
          </div>
          <div>
            <Statistic
              title="分享次数"
              value={indexData?.shareCount}
              valueStyle={{ textAlign: 'center' }}
            />
          </div>
          <div>
            <Statistic
              title="查看人数"
              value={indexData?.viewMembers}
              valueStyle={{ textAlign: 'center' }}
            />
          </div>
          <div>
            <Statistic
              title="渠道数量"
              value={indexData?.channelCount}
              valueStyle={{ textAlign: 'center' }}
            />
          </div>
        </div>
      </div>
      <p></p>
      <div className={styles['section-box']}>
        <div className={styles['section-title']}>待办</div>
        <div className={styles['inner-box']}>
          <div className={styles['item']}>
            <Progress
              type="dashboard"
              percent={Math.floor(
                ((Number(indexData?.setEntInfo) + Number(indexData?.authEnt)) / 3) * 100,
              )}
            />
            <p></p>
            {((Number(indexData?.setEntInfo) + Number(indexData?.authEnt)) / 2) * 100 !== 100 ? (
              <Button
                type={'primary'}
                onClick={() => {
                  if (!indexData?.setEntInfo) {
                    history.push('/Store/BusinessCard');
                    return;
                  }
                  if (!indexData?.authEnt) {
                    history.push('/Store/Auth');
                    return;
                  }
                  history.push('/Store/Customer');
                }}
              >
                去处理
              </Button>
            ) : null}
          </div>
          <div
            className={classNames(
              styles['item-card'],
              indexData?.setEntInfo ? styles['active'] : null,
            )}
          >
            <div className={styles['title']}>设置企业名片</div>
            <p className={styles['sub-title']}>可以让更多渠道记住</p>
            <div
              className={styles['action']}
              onClick={() => {
                history.push('/Store/BusinessCard');
              }}
            >
              {indexData?.setEntInfo ? '已设置' : '去设置'}
            </div>
          </div>
          <div
            className={classNames(
              styles['item-card'],
              indexData?.authEnt ? styles['active'] : null,
            )}
          >
            <div className={styles['title']}>认证企业信息</div>
            <p className={styles['sub-title']}>体验更全面的功能</p>
            <div
              className={styles['action']}
              onClick={() => {
                history.push('/Store/Auth');
              }}
            >
              {indexData?.authEnt ? '已认证' : '去认证'}
            </div>
          </div>
          <div className={classNames(styles['item-card'])}>
            <div className={styles['title']}>设置客服</div>
            <p className={styles['sub-title']}>对接客户，提高服务质量</p>
            <div
              className={styles['action']}
              onClick={() => {
                history.push(`/Store/Customer`);
              }}
            >
              去设置
            </div>
          </div>
        </div>
      </div>
      <p></p>
      <div className={styles['section-box']}>
        <div className={styles['section-title']}>常用功能</div>
        <div className={styles['inner-box']}>
          <div
            className={styles['item']}
            onClick={() => {
              history.push(`/pallet/manager/palletListImport`);
            }}
          >
            <Image src={pallet} width={50} height={50} preview={false}></Image>
            <div className={styles['title']}>货盘管理</div>
          </div>
          <div
            className={styles['item']}
            onClick={() => {
              history.push(`/product/productList`);
            }}
          >
            <Image src={product} width={50} height={50} preview={false}></Image>
            <div className={styles['title']}>产品管理</div>
          </div>
          <div
            className={styles['item']}
            onClick={() => {
              history.push(`/brand/brandManagement`);
            }}
          >
            <Image src={brand} width={50} height={50} preview={false}></Image>
            <div className={styles['title']}>品牌管理</div>
          </div>
          <div
            className={styles['item']}
            onClick={() => {
              history.push(`/channel/ChannelManagement`);
            }}
          >
            <Image src={channel} width={50} height={50} preview={false}></Image>
            <div className={styles['title']}>渠道管理</div>
          </div>
        </div>
      </div> */}
    </PageContainer>
  );
};

export default Welcome;
