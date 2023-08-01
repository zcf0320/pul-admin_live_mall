import { request } from '@umijs/max';

// CHECK_IN_RULE: 签到规则
// WITHDRAWAL: 提现设置
// EXPRESS_DELIVERY: 快递发货设置
// TEAM_LEVEL_RULE: 团长等级规则设置
// TEAM_PRODUCT_SETTINGS: 团长设置-商品设置
// TEAM_SETTLEMENT_SETTINGS: 团长设置-结算设置
// SHOP_DECORATION: 店铺装修
// INVITATION_POSTER: 邀请海报
// MINI_PROGRAM_SHARING: 小程序分享
// TEAM_ALIAS: 团长别名
// PARTNER_ALIAS: 合伙人别名

type DiyAppletSettingsKey =
  | 'SHOP_DECORATION'
  | 'INVITATION_POSTER'
  | 'MINI_PROGRAM_SHARING'
  | 'TEAM_LEVEL_RULE'
  | 'TEAM_ALIAS'
  | 'PARTNER_ALIAS';

interface GetAppletSetParams {
  keys: DiyAppletSettingsKey[];
}

export const getDiyAppletSettings = (data: GetAppletSetParams) => {
  return request<API.Response<{ [key in DiyAppletSettingsKey]: string }>>('/v1/setting/get', {
    method: 'POST',
    data,
  });
};

export const setDiyAppletSettings = (data: { settingList: { key: string; value: string }[] }) => {
  return request<API.Response>('/v1/setting/set', {
    method: 'POST',
    data,
  });
};
