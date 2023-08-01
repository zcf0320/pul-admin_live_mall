import { ProCard } from '@ant-design/pro-components';
import { Button, Image, Tag } from 'antd';

import styles from '../index.module.less';

interface IProps {
  id: string;
  level: number;
  status: boolean;
  backImage: string;
  name: string;
  peakValue: number;
  rightsList?: IEquityList[];
  setShowDraw: (showDraw: boolean) => void;
  setLevelInfo: (levelInfo: any) => void;
  onChangeStatus: (value: any) => void;
  showEnableLevel: boolean;
  maxLevel: number;
}

export default (props: IProps) => {
  const {
    id = '',
    level = 1,
    status = false,
    backImage = '',
    name = '',
    peakValue = '',
    rightsList = [],
    setShowDraw = () => {},
    setLevelInfo = () => {},
    onChangeStatus,
    showEnableLevel = false,
    maxLevel = 1,
  } = props || {};

  // 编辑时传出用户信息
  const postLevelInfo = () => {
    setShowDraw(true);
    setLevelInfo({
      id,
      level,
      status,
      backImage,
      name,
      rightsList,
      peakValue,
    });
  };

  return (
    <ProCard className={styles.levelCard}>
      <div className={styles.Card}>
        <div className={styles.cardHeader}>
          <span className={styles.levelName}>VIP{level}</span>
          <div>
            <Tag color={status ? '#87d068' : '#CCC8C8BE'} className={styles.cardTag}>
              <span className={status ? '' : 'textColor'}>{status ? '已开启' : '已停用'}</span>
            </Tag>
          </div>
        </div>
        <div className={styles.operate}>
          {showEnableLevel && (
            <Button
              type="link"
              onClick={() =>
                onChangeStatus({
                  backImage,
                  name,
                  level,
                  peakValue,
                  id,
                  status,
                })
              }
            >
              {!status && level === 1 ? '启用' : ''}
              {status && level === maxLevel ? '停用' : ''}
              {!status && level === maxLevel + 1 ? '启用' : ''}
            </Button>
          )}
          <Button type="link" onClick={postLevelInfo}>
            编辑
          </Button>
        </div>
        <div className={styles.levelImage}>
          <div className={styles.levelCardName}>{name}</div>
          <Image preview={false} className={styles.cardImg} src={backImage || ''} />
          <div className={styles.describe}>
            {level === 1 ? '开通会员即享' : `成长值达到${peakValue}`}
          </div>
        </div>

        <div className={styles.equity}>
          <div>享受{rightsList?.length || 0}项权益：</div>
          <div className={styles.equityList}>
            {rightsList?.slice(0, 9)?.map((item: { icon: string; name: string }, index: number) => {
              return (
                <span key={index} className={styles.equityInfo}>
                  <img src={item?.icon || ''} alt="icon" />
                </span>
              );
            })}
            {rightsList?.length > 9 ? (
              <span className={styles.circular}>+{rightsList.length - 9}</span>
            ) : null}
          </div>
        </div>
      </div>
    </ProCard>
  );
};
