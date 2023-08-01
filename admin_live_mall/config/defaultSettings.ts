import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string | boolean;
} = {
  navTheme: 'light',
  // 拂晓蓝
  colorPrimary: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '健康行九州',
  // title: '满江红',
  pwa: true,
  // logo: '/logo.png', //待初始化（左上角logo图标）
  logo: false, //待初始化（左上角logo图标）
  iconfontUrl: '',
  // token: {
  //   header: {
  //     colorBgHeader: '#292f33',
  //     colorHeaderTitle: '#fff',
  //     colorTextMenu: '#dfdfdf',
  //     colorTextMenuSecondary: '#dfdfdf',
  //     colorTextMenuSelected: '#fff',
  //     colorBgMenuItemSelected: '#22272b',
  //     colorTextMenuActive: 'rgba(255,255,255,0.85)',
  //     colorTextRightActionsItem: '#dfdfdf',
  //   },

  //   // 参见ts声明，demo 见文档，通过token 修改样式
  //   //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
  // },
};

export default Settings;
