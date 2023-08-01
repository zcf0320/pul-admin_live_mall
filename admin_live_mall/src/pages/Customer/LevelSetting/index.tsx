import { useEffect, useState } from 'react';
import { history } from '@umijs/max';

import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Alert, Button, message, Modal, Spin } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';

import LevelCard from '@/pages/Customer/LevelSetting/LevelCard';
import DrawLevel from '@/pages/Customer/LevelSetting/DrawLevel';

import {
  getGrowthValue,
  getUserLevel,
  setUserStatus,
} from '@/pages/Customer/LevelSetting/services';

import styles from './index.module.less';

export default () => {
  const [modal, contextHolder] = Modal.useModal();

  const [isOpenGrowth, setIsOpenGrowth] = useState<boolean>(false);
  const [levelSource, setLevelSource] = useState<ILevelSource[]>([]);
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [showDraw, setShowDraw] = useState<boolean>(false);
  const [levelInfo, setLevelInfo] = useState<ILevelSource>({
    backImage: '',
    id: '',
    level: 0,
    name: '',
    peakValue: 0,
    status: false,
  }); // 新增/编辑的信息
  const [refresh, setRefresh] = useState<boolean>(false);

  // 新增会员等级
  const addMemberLevel = (): void => {
    setShowDraw(true);
    setLevelInfo({ backImage: '', id: '', level: 0, name: '', peakValue: 0, status: false });
  };

  // 获取等级列表无分页
  const getUserLevelList = async (): Promise<void> => {
    try {
      setShowLoading(true);
      const { data = [] } = await getUserLevel();
      setLevelSource(data);
    } catch (e) {
      console.error(e);
    } finally {
      setShowLoading(false);
    }
  };

  // 启用禁用用户状态 	状态:0-启用 1-禁用
  const onChangeStatus = async (params: any): Promise<void> => {
    const { status = true, level = 1 } = params;
    if (!status && level > 1 && !isOpenGrowth) {
      message.error('您还需要配置成长值之后，才能开启VIP2');
      return;
    }
    const contentText = !status
      ? '停用等级将对已有会员造成影响，请谨慎操作。'
      : '启用等级后，会员等级将重新计算，原会员可能会发生等级变动，变动将在一段时间内完成。';
    const modalWidth = !status ? 400 : 700;

    modal.confirm({
      title: '提示',
      width: modalWidth,
      centered: true,
      icon: <ExclamationCircleOutlined />,
      content: contentText,
      okText: '确认',
      cancelText: '取消',
      onOk: async (): Promise<void> => {
        const { id, backImage, name, peakValue } = params;
        if (!(backImage || name || peakValue)) {
          message.error('请先编辑会员卡信息');
          return;
        }
        try {
          await setUserStatus({ id });
          if (!status) message.success('会员卡启用成功');
          await getUserLevelList();
        } catch (e) {
          console.error(e);
        }
      },
    });
  };

  // 路由跳转
  const goRouterLink = (link: string): void => {
    history.push(link);
  };

  // 获取成长值设置
  const getGrowthValueSet = async (): Promise<void> => {
    const { data = [] } = await getGrowthValue();
    const isOpenGrowthValue = data.every(({ status }: { status: boolean }) => status);
    console.log(isOpenGrowthValue);
    setIsOpenGrowth(!isOpenGrowthValue);
  };

  // 获取用户等级
  useEffect(() => {
    getUserLevelList();
    getGrowthValueSet();
  }, [refresh]);

  return (
    <PageContainer
      header={{
        breadcrumb: undefined,
      }}
      extraContent="主要以用户消费或互动获得成长值并划分相应的会员等级，用户尽享其等级所对应的权益，以此方式刺激用户。"
      className={styles.pageContainer}
    >
      <ProCard className={styles.levelContainer}>
        {showLoading ? (
          <div className={styles.spin}>
            <Spin size="large" className={styles.loading} />
          </div>
        ) : (
          // 没有配置成长值显示Alert警告
          <div>
            {isOpenGrowth ? null : (
              <Alert
                message={`您还需要配置成长值之后，才能开启VIP2`}
                type="warning"
                showIcon
                action={
                  <Button
                    size="small"
                    type="link"
                    onClick={() => goRouterLink('/Customer/GrowthValueSetting')}
                  >
                    立即配置
                  </Button>
                }
              />
            )}
            <div className={styles.levelSource}>
              {levelSource?.map(
                (item: ILevelSource, index: number, levelSource: ILevelSource[]) => {
                  // 是否显示可修改启用禁用的操作
                  let isShowEnableStatus = false;
                  // 当前卡片显示会员等级大于1时，判断前一个的状态是否启用
                  if (item.level > 1) {
                    isShowEnableStatus = levelSource[index - 1].status;
                  } else {
                    isShowEnableStatus = true;
                  }
                  return (
                    <LevelCard
                      key={index}
                      setShowDraw={setShowDraw}
                      setLevelInfo={setLevelInfo}
                      onChangeStatus={onChangeStatus}
                      showEnableLevel={isShowEnableStatus}
                      maxLevel={Math.max(
                        ...levelSource
                          ?.map((item) => (item.status ? item.level : 0))
                          .filter(Boolean),
                      )}
                      {...item}
                    />
                  );
                },
              )}
              <div className={styles.addMemberLevel} onClick={addMemberLevel}>
                <div className={styles.plusOutlined}>
                  <PlusOutlined className={styles.icon} />
                  <span>新增会员等级</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {contextHolder}
        <DrawLevel
          showDraw={showDraw}
          setShowDraw={setShowDraw}
          isNoLevel={levelSource?.length === 0}
          goRouterLink={goRouterLink}
          levelInfo={levelInfo}
          refresh={refresh}
          setRefresh={setRefresh}
          levelSource={levelSource}
        />
      </ProCard>
    </PageContainer>
  );
};
