import { memo, useCallback, useEffect, useState } from 'react';
import { DrawerForm } from '@ant-design/pro-components';
import { Button, Checkbox, Form, Input, InputNumber, message, Tooltip } from 'antd';
import { history } from '@umijs/max';
import { GiftOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

import { getLevelEquityList, setLevel } from '@/pages/Customer/LevelSetting/services';
import { normImage, UploadPhotos } from '@/pages/components/UploadPhotos/UploadPhotos';

import styles from '../index.module.less';

const FormItem = Form.Item;

interface IProps {
  showDraw: boolean;
  setShowDraw: (showDraw: boolean) => void;
  isNoLevel: boolean;
  goRouterLink: (link: string) => void;
  levelInfo: ILevelSource;
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
  levelSource: any;
}

const maxGrowthValue = 99999; // 最大成长值
export default memo((props: IProps) => {
  const {
    showDraw = false,
    setShowDraw,
    isNoLevel = false,
    goRouterLink,
    levelInfo,
    refresh = false,
    setRefresh,
    levelSource,
  } = props || {};

  const [equityGroup, setEquityGroup] = useState<IEquityList[]>([]);
  const [levelForm] = Form.useForm<ILevelForm>();
  const [fileUrl, setFileUrl] = useState<string>('');
  const [checkedEquityIds, setCheckEquityIds] = useState<number[]>([]);
  const [currentFormValue, setCurrentFormValue] = useState<ILevelForm>({
    backImage: '',
    id: undefined,
    name: '',
    peakValue: 0,
    rightsIds: [],
    rightsList: [],
  });
  const [currentLevelInfo, setCurrentLevelInfo] = useState<IcurrentLevelStatusParams>({
    defaultValue: 0,
    isAddOrEditFirstLevel: false,
    isEdit: false,
    maxPeakValue: 0,
    minPeakValue: 0,
    peakValueTip: '',
  });

  const getGrowthValue = (source: ILevelSource[], level: number): IgrowthValues => {
    // 编辑会员时成长值和等级对应关系
    // 此处处理的是等级
    let addNum = {
        minPeakValue: 0,
      },
      editNum = {
        minPeakValue: 0,
        maxPeakValue: 0,
      };
    if (level > 1) {
      let minPeakValue, maxPeakValue;
      minPeakValue =
        source?.find(({ level: currentLevel }) => currentLevel === level - 1)?.peakValue ?? 0;
      maxPeakValue =
        levelSource?.find(({ level: currentLevel }: ILevelSource) => currentLevel === level + 1)
          ?.peakValue ?? -1;
      maxPeakValue = maxPeakValue === -1 ? maxGrowthValue : maxPeakValue - 1;
      minPeakValue = minPeakValue + 1;
      editNum = {
        minPeakValue,
        maxPeakValue,
      };
    } else {
      const peakValueArr = levelSource.map((item: ILevelSource) => item.peakValue);
      const minPeakValue = Math.max(...peakValueArr) + 1;
      addNum = {
        minPeakValue,
      };
    }
    return {
      addNum,
      editNum,
    };
  };

  // 初始化数据
  const initData = useCallback((): void => {
    const {
      id = '',
      rightsList = [],
      backImage = '',
      level = '',
      peakValue,
      name,
    } = levelInfo || {};
    const { editNum, addNum }: IgrowthValues = getGrowthValue(levelSource, Number(level));
    // 如果为编辑，则展示数据，否则清空数据
    if (id) {
      levelForm.setFieldsValue({ backImage, peakValue, name });
      setCheckEquityIds(rightsList?.map((equity: any) => equity.id)); // 设置默认勾选的权益
      setFileUrl(backImage); // 设置背景图片
      setCurrentLevelInfo({
        isEdit: true,
        isAddOrEditFirstLevel: level === 1, // 是否在编辑一级会员
        peakValueTip:
          level === 1
            ? 'VIP1级别开通即享，成长值不可编辑'
            : `当前等级成长值可设置为${editNum?.minPeakValue} - ${editNum?.maxPeakValue}`,
        defaultValue: level === 1 ? 0 : peakValue,
        ...editNum,
      });
    } else {
      // 新增会员
      levelForm.resetFields();
      setFileUrl('');
      setCurrentLevelInfo({
        isEdit: false,
        isAddOrEditFirstLevel: isNoLevel, //是否在新增一级会员
        peakValueTip: isNoLevel // 新增1级会员时，当前无会员等级
          ? 'VIP1级别开通即享，成长值不可编辑'
          : `当前等级成长值可设置为${addNum?.minPeakValue} - ${maxGrowthValue}`,
        defaultValue: isNoLevel ? 0 : '',
        ...addNum,
      });
    }
  }, [levelInfo]);

  // 获取权益列表
  const getEquityList = async (): Promise<void> => {
    try {
      const { data = [] } = await getLevelEquityList();
      setEquityGroup(data.filter((item: IEquityList) => item?.status));
    } catch (e) {
      console.error(e);
    }
  };

  // 获取上传的文件地址
  const setImageUrl = (fileList: File[]): void => {
    if (fileList.length === 0) setFileUrl('');
    const url = normImage(fileList);
    if (url) {
      setFileUrl(url);
    }
  };
  // 提交表单信息
  const onSubmitLevel = async (): Promise<boolean | void> => {
    const { peakValue = 0, name = '' } = levelForm.getFieldsValue();
    let params: ILevelForm = {
      name,
      backImage: fileUrl,
      rightsIds: checkedEquityIds,
      peakValue: Number(peakValue),
    };
    if (levelInfo?.id) {
      params = {
        ...params,
        id: levelInfo?.id,
      };
    }
    delete params.rightsList;
    try {
      await setLevel(params);
      message.success(`${levelInfo?.id ? '会员编辑成功！' : '新增会员成功！'}`);
      setShowDraw(false);
      setRefresh(!refresh);
    } catch (e) {
      console.error(e);
    }
  };

  // 将选中的权益id并入
  const onChangeEquity = (e: CheckboxChangeEvent): void => {
    const { checked = false, value = '' } = e.target || {};
    const newEquityIds = checkedEquityIds || [];
    if (checked) {
      setCheckEquityIds([...newEquityIds, value]);
    } else {
      setCheckEquityIds(checkedEquityIds?.filter((id) => id !== value));
    }
  };

  const onChangeFormValue = (_: ILevelForm, values: ILevelForm) => {
    setCurrentFormValue(values);
  };

  // 获取权益列表
  useEffect(() => {
    if (showDraw) {
      getEquityList().then(() => {
        setCurrentFormValue({
          name: levelInfo?.name,
          peakValue: levelInfo?.peakValue,
        });
      });
    }
  }, [showDraw]);

  useEffect(() => {
    initData();
  }, [levelInfo]);

  return (
    <DrawerForm
      width={1000}
      open={showDraw}
      labelCol={{ span: 6 }}
      title={`${currentLevelInfo?.isEdit ? '编辑' : '新增'}会员等级`}
      drawerProps={{
        destroyOnClose: true,
        maskClosable: false,
        onClose: () => setShowDraw(false),
        footer: null,
      }}
      form={levelForm}
      className={styles.drawerForm}
      layout="horizontal"
      onValuesChange={onChangeFormValue}
      onFinish={() => levelForm.validateFields().then(onSubmitLevel)}
    >
      <div className={styles.level}>
        <span>会员等级：</span>
        <span className={styles.levelNum}>
          VIP{currentLevelInfo?.isEdit ? levelInfo.level : levelSource.length + 1 || 1}
        </span>
      </div>
      <FormItem
        name="name"
        label="等级名称"
        className={styles.formItem}
        rules={[{ required: true }]}
      >
        <Input placeholder="请输入等级名称" showCount maxLength={12} />
      </FormItem>
      <FormItem
        name="backImage"
        getValueFromEvent={normImage}
        className={styles.formItem}
        valuePropName={'imageUrl'}
        label="卡片背景"
        rules={[{ required: true, message: '请上传卡片背景' }]}
      >
        <UploadPhotos amount={1} onChange={setImageUrl} />
      </FormItem>
      <FormItem
        name="peakValue"
        label="获得条件"
        rules={[
          {
            required: !currentLevelInfo?.isAddOrEditFirstLevel,
            message: '请输入成长值',
          },
        ]}
        className={styles.formItem}
        extra={<div className={styles.peakValue}>{currentLevelInfo?.peakValueTip}</div>}
      >
        <InputNumber
          min={currentLevelInfo?.minPeakValue}
          max={currentLevelInfo?.isEdit ? currentLevelInfo?.maxPeakValue : maxGrowthValue}
          disabled={currentLevelInfo?.isAddOrEditFirstLevel}
          defaultValue={currentLevelInfo?.defaultValue}
          className={styles.growthValueNum}
          addonAfter="点成长值"
        />
      </FormItem>
      <div className={styles.peakValueTip}>
        <Tooltip
          color="#fff"
          title={
            <>
              <span style={{ color: '#000' }}>
                成长值为客户行为的量化指标，可在“成长值管理”中进行设置
              </span>
              <span
                style={{ color: '#2e75f5', marginLeft: 10, cursor: 'pointer' }}
                onClick={() => history.push('/Customer/GrowthValueSetting')}
              >
                去设置
              </span>
            </>
          }
        >
          <QuestionCircleOutlined />
        </Tooltip>
      </div>
      {equityGroup?.length ? (
        <FormItem
          name="rightsList"
          label="权益礼包"
          className={styles.formItem}
          extra={
            <div>
              <span>没有想要的权益?</span>
              <Button type="link" onClick={() => goRouterLink('/Customer/EquityManage')}>
                去配置权益
              </Button>
            </div>
          }
        >
          <div className={styles.equityGroup}>
            <Checkbox.Group defaultValue={levelInfo?.rightsList?.map(({ id }) => id)}>
              {equityGroup?.map((item: IEquityList) => {
                const { icon = '', name = '', id = '' } = item || {};
                return (
                  <Checkbox
                    key={id}
                    value={id}
                    className={styles.checkBox}
                    onChange={onChangeEquity}
                  >
                    {icon ? (
                      <img src={icon} alt="" />
                    ) : (
                      <GiftOutlined style={{ fontSize: 32, color: 'red' }} />
                    )}
                    <span>{name}</span>
                  </Checkbox>
                );
              })}
            </Checkbox.Group>
          </div>
        </FormItem>
      ) : (
        <div className={styles.noEquityGroup}>
          <span className={styles.labelName}>权益礼包：</span>
          <span>没有想要的权益?</span>
          <Button type="link" onClick={() => goRouterLink('/Customer/EquityManage')}>
            去配置权益
          </Button>
        </div>
      )}
      {fileUrl && (
        <div className={styles.preview}>
          <div className={styles.previewInfo}>
            <div className={styles.previewName}>{currentFormValue?.name}</div>
            <div className={styles.previewPeakValue}>
              {currentLevelInfo?.defaultValue === 0
                ? '开通会员即享'
                : `成长值达到${currentFormValue?.peakValue || ''}`}
            </div>
            <img src={fileUrl} alt="样式预览背景图" className={styles.background} />
          </div>
          <div className={styles.previewText}>样式预览</div>
        </div>
      )}
    </DrawerForm>
  );
});
