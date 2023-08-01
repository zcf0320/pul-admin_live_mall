import { ReactComponent as product } from '@/assets/icon/商品管理.svg';
import { ReactComponent as storeSvg } from '@/assets/icon/商家.svg';
import { ReactComponent as info } from '@/assets/icon/概况.svg';
import { ReactComponent as setting } from '@/assets/icon/设置.svg';
import Icon, {
  AreaChartOutlined,
  ControlOutlined,
  DeploymentUnitOutlined,
  PayCircleOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import {
  MenuDataItem,
  PageLoading,
  SettingDrawer,
  Settings as LayoutSettings,
} from '@ant-design/pro-components';
import { history, RunTimeLayoutConfig } from '@umijs/max';
import { message } from 'antd';
import React, { useEffect } from 'react';
import defaultSettings from '../config/defaultSettings';
import Footer from './components/Footer';
import { IMenu } from './components/IMenu/IMenu';
import GlobalHeaderRight from './components/RightContent';
import { indexPath } from './pages/utils/constants';
import { errorConfig } from './requestErrorConfig';
import { queryCurrentUser } from './services/ant-design-pro/api';
import { Provider } from 'react-redux';
import { store } from './store';
import useStore from './hooks/useStore';

const isDev = process.env.NODE_ENV === 'development';

const loginPath = '/Login';

const whitePath = ['/ShareLogin', '/PalletSharePage'];
let extraRoutes: any[];

document.title = '健康行九州';

const Wrapper = ({ children }: any) => <React.Suspense>{children}</React.Suspense>;

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  menuTree?: API.IMenuTree[]; // 菜单权限
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.ISystemIndexResponse | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const { location } = history;
  // if (location.pathname !== loginPath) {
  if (![loginPath, ...whitePath].includes(location.pathname)) {
    const userInfo = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser: userInfo?.backUser,
      menuTree: userInfo?.menuTree,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

/**
 * patchRoutes 和 render 配置配合使用，请求服务端根据响应动态更新路由
 * @see https://umijs.org/zh-CN/docs/runtime-config#patchroutes-routes
 */
export async function render(oldRender: () => void) {
  if (![loginPath, ...whitePath].includes(history.location.pathname)) {
    const { data } = await queryCurrentUser();
    extraRoutes = data?.menuTree;
  }
  oldRender();
}

export async function patchClientRoutes({ routes }: any) {
  console.log('routes', routes);

  // 只调用两次(目前只有两层);
  // function buildRoutesTwo(authRoutes1: any[], parentUrl: string | undefined) {
  //   return (authRoutes1 || []).map((item) => {
  //     console.log(
  //       `@/pages/${parentUrl}/${item.menuUrl}/index.tsx`,
  //       '/' + parentUrl + '/' + item.menuUrls,
  //     );
  //     const Component = React.lazy(() => import(`@/pages/${parentUrl}/${item.menuUrl}/index.tsx`));
  //     const wrapperComponent = (
  //       <Wrapper>
  //         <Component />
  //       </Wrapper>
  //     );
  //     return {
  //       path: '/' + parentUrl + '/' + item.menuUrl,
  //       name: item.menuName,
  //       // component: dynamic({
  //       //   component: () => import(`@/pages/${parentUrl}/${item.menuUrl}/index.tsx`),
  //       // }),import GlobalHeaderRight from './components/RightContent/index';

  //       element: wrapperComponent,
  //     };
  //   });
  // }
  // function buildRoutes(authRoutes1: any[]): any {
  //   return (authRoutes1 || []).map((item) => {
  //     return {
  //       path: '/' + item.menuUrl,
  //       name: item.menuName,
  //       children: buildRoutesTwo(item.subMenus, item.menuUrl),
  //     };
  //   });
  // }
  function buildRoutes(authRoutes1: any[], parentUrl = ''): any {
    const result = (authRoutes1 || []).map((item) => {
      if (item.menuType === 1) {
        return null;
      }
      if (item.subMenus && item.subMenus.length > 0 && item.subMenus[0].menuType !== 1) {
        const path = parentUrl + '/' + item.menuUrl;
        return {
          path: path,
          name: item.menuName,
          children: buildRoutes(item.subMenus, path),
        };
      } else {
        // console.log(
        //   '@/pages/${parentUrl}/${item.menuUrl}/index.tsx',
        //   `@/pages${parentUrl}/${item.menuUrl}/index.tsx`,
        //   parentUrl + '/' + item.menuUrl,
        // );
        const Component = React.lazy(() => import(`@/pages${parentUrl}/${item.menuUrl}/index.tsx`));
        const wrapperComponent = (
          <Wrapper>
            <Component />
          </Wrapper>
        );
        return {
          path: parentUrl + '/' + item.menuUrl,
          name: item.menuName,
          // children: buildRoutes(item.subMenus, item.menuUrl === 'group' ? parentUrl : item.menuUrl),
          element: wrapperComponent,
        };
      }
    });
    return result.filter((item) => item !== null);
    // .map((item) => {
    //   if (item?.children?.length === 0) {
    //     const result = { ...item };
    //     delete result.children;
    //     return result;
    //   }
    //   return item;
    // });
  }

  // function groupRoutes(route: any[]) {
  //   route.forEach((item: any) => {
  //     item.children.forEach((item2: any, index: number) => {
  //       if (item2.path.includes('systemGroup')) {
  //         item.children.splice(index, 1, ...item2.children);
  //       }
  //     });
  //   });
  // }

  // console.log('extraRoutes', extraRoutes);

  if (extraRoutes) {
    // 保证当前只有一个路由表（开发环境下会有两个，清除第一个）
    // if (routes.length > 1) routes.splice(0, routes.length - 1);
    const route = buildRoutes(extraRoutes);
    // debugger;
    // groupRoutes(route);

    route.forEach((item: any) => {
      routes[routes.length - 1].routes.unshift(item);
    });
  }
}

const filterIgnoreMenu = (menu: MenuDataItem[]): MenuDataItem[] => {
  return menu
    .map((item) => {
      if (item.children) {
        return {
          ...item,
          children: filterIgnoreMenu(item.children),
        };
      }
      return item;
    })
    .filter((item) => !item.hidden);
};

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  // if (!sessionStorage.getItem('headImage')) {
  //   sessionStorage.setItem('headImage', JSON.stringify(?.headImage));
  // }
  /**
   * 导航图标
   * @see https://ant.design/components/icon-cn/
   */
  const IconMap = {
    user: <TeamOutlined />, // 用户中心
    configuration: <ControlOutlined />, //配置管理

    // store: <ShopOutlined />,
    Store: <Icon component={storeSvg} />,

    Order: <ShoppingCartOutlined />,

    product: <Icon component={product} />,
    //概况
    // Welcome: <DashboardOutlined />,
    general: <Icon component={info} />,

    // 数据
    Data: <AreaChartOutlined />,

    //客户
    Customer: <UserOutlined />,

    // 直播
    Live: <VideoCameraOutlined />,

    // 营销
    Marketing: <PayCircleOutlined />,

    //设置
    // Setting: <SettingOutlined />,
    Setting: <Icon component={setting} />,

    // 店铺
    store: <ShopOutlined />,

    // 资金
    capital: <PayCircleOutlined />,

    // 团长
    distribution: <DeploymentUnitOutlined />,
    // 合伙人
    partner: <UsergroupAddOutlined />,
  };

  const menuTreeFormat = (menuTree: API.IMenuTree[]): MenuDataItem[] =>
    menuTree?.map(({ subMenus, menuName, menuUrl, ...item }) => {
      if (!menuUrl) {
        return [];
      }
      return {
        ...item,
        children: menuTreeFormat(subMenus),
        name: menuName,
        path: menuUrl,
        layout: subMenus?.length > 0 && subMenus[0].menuType !== 1 ? item.layout : undefined,
        icon: (IconMap as any)[menuUrl],
      };
    });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const store = useStore();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    store.refreshStore();
    store.refreshUser(initialState?.currentUser);
  }, []);

  return {
    title: store.storeName,
    menu: {
      locale: false,
      params: {
        userId: initialState?.currentUser?.id,
      },
      onLoadingChange() {},
      request: (_params: any, defaultMenuData: any) => {
        // 动态菜单
        const menu = initialState?.menuTree
          ? menuTreeFormat(initialState?.menuTree)
          : defaultMenuData;
        return menu;
      },
    },

    menuRender: (props) => {
      if (!props.menuData) return null;
      const menuData = props.menuData;
      const newMenuData = filterIgnoreMenu(menuData);

      return <IMenu menuData={newMenuData} />;
    },

    // menuItemRender: (menuItemProps: any, defaultDom: any) => {
    //   if (menuItemProps.isUrl || !menuItemProps.path) {
    //     return defaultDom;
    //   }
    //   // 支持二级菜单显示icon
    //   return (
    //     <Link style={{ display: 'flex' }} key={menuItemProps.path} to={menuItemProps.path}>
    //       {menuItemProps.pro_layout_parentKeys &&
    //         menuItemProps.pro_layout_parentKeys.length > 0 &&
    //         menuItemProps.icon}
    //       <span style={{ marginLeft: '10px' }}>{defaultDom}</span>
    //     </Link>
    //   );
    // },
    rightContentRender: () => <GlobalHeaderRight />,
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      console.log('--当前用户信息--', initialState?.currentUser);
      // if (!initialState?.currentUser && location.pathname !== loginPath) {
      if (!initialState?.currentUser && ![...whitePath, loginPath].includes(location.pathname)) {
        history.push(loginPath);
        if (location.pathname !== indexPath) message.error('登录已过期');
      }
      if (location.pathname === '/') {
        history.push(indexPath);
      }
      // store.refreshUser(initialState?.currentUser);
    },
    links: isDev ? [] : [],
    menuHeaderRender: false,
    // headerContentRender: <span>aaa</span>,
    // bgLayoutImgList: [
    //   {
    //     src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
    //     left: 85,
    //     bottom: 100,
    //     height: '303px',
    //   },
    //   {
    //     src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
    //     bottom: -68,
    //     right: -45,
    //     height: '303px',
    //   },
    //   {
    //     src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
    //     bottom: 0,
    //     left: 0,
    //     width: '331px',
    //   },
    // ],
    // actionsRender: () => [<Question key="doc" />, <SelectLang key="SelectLang" />],
    // avatarProps: {
    //   src: initialState?.currentUser?.avatar,
    //   title: <AvatarName />,
    //   render: (_, avatarChildren) => {
    //     return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
    //   },
    // },
    // waterMarkProps: {
    //   content: initialState?.currentUser?.name,
    // },
    // footerRender: () => <Footer />,
    // onPageChange: () => {
    //   const { location } = history;
    //   // 如果没有登录，重定向到 login
    //   if (!initialState?.currentUser && location.pathname !== loginPath) {
    //     history.push(loginPath);
    //   }
    // },
    // layoutBgImgList: [
    //   {
    //     src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
    //     left: 85,
    //     bottom: 100,
    //     height: '303px',
    //   },
    //   {
    //     src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
    //     bottom: -68,
    //     right: -45,
    //     height: '303px',
    //   },
    //   {
    //     src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
    //     bottom: 0,
    //     left: 0,
    //     width: '331px',
    //   },
    // ],
    // links: isDev
    //   ? [
    //       <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
    //         <LinkOutlined />
    //         <span>OpenAPI 文档</span>
    //       </Link>,
    //     ]
    //   : [],
    // menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    // childrenRender: (children) => {
    //   // if (initialState?.loading) return <PageLoading />;
    //   return (
    //     <>
    //       {children}
    //       <SettingDrawer
    //         disableUrlParams
    //         enableDarkTheme
    //         settings={initialState?.settings}
    //         onSettingChange={(settings) => {
    //           setInitialState((preInitialState) => ({
    //             ...preInitialState,
    //             settings,
    //           }));
    //         }}
    //       />
    //     </>
    //   );
    // },
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children: any, props: any) => {
      if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/Login') && (
            <SettingDrawer
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

// https://umijs.org/docs/api/runtime-config
// 在这里处理content等全局需要的Provider
export function rootContainer(container: any) {
  return <Provider store={store}>{container}</Provider>;
}

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};
