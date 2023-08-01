// import { getCompanyInfo } from '@/api/pallet';
// import { EmitListener } from '@/pages/utils/emitListener';
import { MenuDataItem } from '@ant-design/pro-components';
import { history, useLocation } from '@umijs/max';
import { Modal } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './index.less';
import { indexPathPart1 } from '@/pages/utils/constants';
import useStore from '@/hooks/useStore';

interface IMenuProps {
  menuData?: MenuDataItem[];
}

export const IMenu: React.FC<IMenuProps> = (props) => {
  const { menuData } = props;
  const [selected, setSelected] = useState(-1);
  const [slideWidth, setSlideWidth] = useState(0);
  const [mainMenuWidth, setMainMenuWidth] = useState(0);
  const [subMenu, setSubMenu] = useState<MenuDataItem[] | undefined>(undefined);
  const location = useLocation();
  // const [logo, setLogo] = useState<string>();
  const [menuHover, setMenuHover] = useState(-1);

  // 店铺信息
  const store = useStore();
  // useEffect(() => {
  //   store.refreshStore();
  // }, []);

  // console.log('menuData', menuData);

  // let menuData: MenuDataItem[] = [];
  // if (oldMenuData) {
  //   menuData = filterIgnoreMenu(oldMenuData);
  // }
  // const updateCompanyInfo = () => {
  //   getCompanyInfo().then((res) => {
  //     console.log(res.data);
  //     localStorage.setItem('companyLogo', res.data.logo);
  //     EmitListener.update();
  //   });
  // };

  // useEffect(() => {
  //   updateCompanyInfo();
  // }, []);

  useEffect(() => {
    // EmitListener.add(() => {
    //   console.log(
    //     "localStorage.getItem('companyLogo') ?? ''",
    //     localStorage.getItem('companyLogo') ?? '',
    //   );
    //   setLogo(localStorage.getItem('companyLogo') ?? '');
    // });
  }, []);

  const getSlideWidth = () => {
    return document.querySelectorAll('#aSlide')[0]?.clientWidth;
  };
  useEffect(() => {
    //应用flex-direction: row;
    const obj = document.getElementsByClassName('ant-layout')[0];
    obj.classList.add('ant-layout-has-sider');
  }, []);

  useEffect(() => {
    const update = () => {
      const mainMenuWidth = document.querySelector('#menu_list')?.clientWidth;
      // console.log('mainMenuWidth', mainMenuWidth);
      const domHeader = document.querySelector('.ant-pro-layout-header') as HTMLElement;
      if (!domHeader) return;
      domHeader.style.marginLeft = `${mainMenuWidth}px`;
      domHeader.style.left = '0';
      domHeader.style.width = `calc(100% - ${mainMenuWidth}px)`;
      if (mainMenuWidth) {
        setMainMenuWidth(mainMenuWidth);
      }
    };
    // update();
    setTimeout(() => {
      update();
    }, 0);
  }, []);

  const selectMainMenu = useMemo(() => {
    // console.log('menuData', menuData, selected);
    if (menuData && selected !== -1) {
      return menuData[selected];
    }
    return null;
  }, [menuData, selected]);

  useEffect(() => {
    setSlideWidth(getSlideWidth());
  }, [subMenu]);

  const changePath = (location: { pathname: string }) => {
    console.log('location.pathname', location.pathname);
    const path = location.pathname;
    let subMenuIndex;

    const menuIndex = menuData?.findIndex((item) => {
      // console.log('item', item);
      const result =
        -1 !==
        (item.children?.findIndex((item, index) => {
          if (item.path === path) {
            subMenuIndex = index;
            return true;
          }
          return false;
        }) ?? -1);
      // console.log('result', result);
      return result;
    });
    //  console.log('menuIndex', menuIndex, subMenuIndex);
    if (
      menuIndex !== undefined &&
      subMenuIndex !== undefined &&
      menuIndex !== -1 &&
      subMenuIndex !== -1
    ) {
      // console.log('menuIndex', menuIndex, subMenuIndex);
      setSelected(menuIndex);
      setSubMenu(menuData![menuIndex].children);
    } else {
      if (!menuData) return;
      const menuIndex = menuData.findIndex((item) => {
        const menuPathList = item.path?.split('/');
        const pathList = path.split('/');
        if (pathList && pathList.length >= 2 && menuPathList && menuPathList.length >= 2) {
          return pathList[0] + pathList[1] === menuPathList[0] + menuPathList[1];
        }
        return false;
      });
      setSelected(menuIndex);
      if (menuData && menuData[menuIndex]) {
        setSubMenu(menuData[menuIndex].children);
      }
    }
  };

  useEffect(() => {
    if (location.pathname === indexPathPart1) {
      setSelected(-1);
      setSubMenu(undefined);
    } else {
      changePath(location);
    }
  }, [location, menuData]);

  const handleSubMenuClick = (item: MenuDataItem) => {
    setMenuHover(-1);

    function goPath() {
      if (item.path) {
        history.push(item.path);
      }
    }

    if (location.pathname === '/product/addProduct' && location.search === '') {
      const modal = Modal.confirm({
        title: '还未添加成功，是否放弃添加',
        onOk: () => {
          goPath();
          modal.destroy();
        },
        onCancel: () => {
          modal.destroy();
        },
      });
    } else {
      goPath();
    }
  };

  const handleMainMenuClick = (item: MenuDataItem, index: number) => {
    setMenuHover(-1);

    function goPath(path: string) {
      if (path) {
        history.push(path);
      }
      setSelected(index);
      setSubMenu(item.children);
    }

    if (selected !== index) {
      if (item.children && item.children?.length > 0) {
        if (location.pathname === '/product/addProduct' && location.search === '') {
          const modal = Modal.confirm({
            title: '还未添加成功，是否放弃添加',
            onOk: () => {
              if (item.children![0].menuType === 2) {
                goPath(item.children![0].children![0].path ?? '');
              } else {
                goPath(item.children![0].path ?? '');
              }
              // goPath(item.children![0].path ?? '');
              modal.destroy();
            },
            onCancel: () => {
              modal.destroy();
            },
          });
        } else {
          if (item.children![0].menuType === 2) {
            goPath(item.children![0].children![0].path ?? '');
          } else {
            goPath(item.children![0].path ?? '');
          }
        }
        // history.push(item.children[0].path ?? '');
      }
    } else {
      if (!subMenu) {
        setSubMenu(item.children);
      }
      // else {
      //   setSubMenu(undefined);
      // }
    }
  };

  const renderSubMenu = (type: 'normal' | 'hover') => {
    let currentMenu: MenuDataItem[] | undefined;
    if (menuHover >= 0 && menuData) {
      currentMenu = menuData[menuHover].children;
    } else {
      currentMenu = subMenu;
    }
    const menu = menuData ? menuData[menuHover] : undefined;
    // debugger;
    let hasGroup = false;
    if ((currentMenu?.findIndex((item) => item.menuType === 2) ?? -1) > -1) {
      hasGroup = true;
    }

    const renderSubItem = (v: MenuDataItem, subIndex: number, isThree = false) => {
      return (
        <span
          // to={v.path ?? ''}
          key={v.path}
          className={
            styles['submenu_item'] +
            ' ' +
            // ((selected2 === subIndex || v.path === location.pathname) && type !== 'hover'
            //   ? styles.selected
            //   : '')
            (v.path === location.pathname && type !== 'hover' ? styles.selected : '')
          }
          onClick={(e) => {
            e.stopPropagation();
            handleSubMenuClick(v);
          }}
        >
          <span
            style={{
              paddingLeft: isThree ? 20 : '10px',
              paddingRight: '10px',
              fontWeight: 'normal',
            }}
          >
            {v.name}
          </span>
        </span>
      );
    };

    return (
      <div
        className={styles['submenu_list']}
        style={{
          padding: currentMenu ? '0 10px' : 0,
          position: type === 'hover' ? 'absolute' : 'relative',
          top: type === 'hover' ? 0 : undefined,
          left: type === 'hover' ? mainMenuWidth : undefined,
          zIndex: type === 'hover' ? 2001 : undefined,
          minHeight: type === 'hover' ? '100vh' : undefined,
          width: '140px',
        }}
      >
        {currentMenu && !hasGroup ? (
          <div className={styles['submenu_title']}>{menu?.name || selectMainMenu?.name}</div>
        ) : null}
        {hasGroup ? <div style={{ height: 20 }}></div> : null}

        {currentMenu
          ?.filter((item) => !item.hidden)
          ?.map((v, subIndex: number) => {
            if (v.menuType === 2) {
              return (
                <div key={v.name}>
                  <span style={{ marginLeft: 10, fontWeight: 'bold', color: '#333' }}>
                    {v.name}
                  </span>
                  {v.children?.map((menuItem: MenuDataItem, index: number) => {
                    // const newMenuItem = {
                    //   ...menuItem,
                    //   path: menuItem.path?.replace('/systemGroup', ''),
                    // };

                    return renderSubItem(menuItem, index, true);
                  })}
                </div>
              );
            }
            return renderSubItem(v, subIndex);
          })}
      </div>
    );
  };

  const handleMouseOver = (index: number) => {
    if (selected !== index) {
      setMenuHover(index);
    } else {
      setMenuHover(-1);
    }
  };

  const handleMouseLeave = () => {
    setMenuHover(-1);
  };

  return (
    <>
      <div
        style={{
          width: '0 0 ' + slideWidth + 'px',
          overflow: 'hidden',
          flex: '0 0 ' + slideWidth + 'px',
          transition:
            'background-color 0.3s ease 0s, min-width 0.3s ease 0s, max-width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) 0s ,flex 0.4s ease 0s',
        }}
      />
      <div
        id="aSlide"
        className={styles['slide_container']}
        // style={{
        //   fontSize: '16px',
        // }}
      >
        <div className={styles['menu_list']} id="menu_list">
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '20px',
              paddingBottom: '20px',
            }}
          >
            <img src={store.storeLogo ?? '/logo.png'} alt="" style={{ width: 50 }} />
          </div>
          {menuData?.map((v, i: number) => (
            <div
              onMouseLeave={handleMouseLeave}
              onClick={() => {
                handleMainMenuClick(v, i);
              }}
              onMouseEnter={() => {
                handleMouseOver(i);
              }}
              key={v.path}
              className={styles['menu_item_container']}
            >
              <div className={styles['menu_item'] + ' ' + (selected === i ? styles.selected : '')}>
                <>
                  {v.icon}
                  <span className={styles['menu_name']}>{v.name}</span>
                </>
                {menuHover === i && renderSubMenu('hover')}
              </div>
            </div>
          ))}
        </div>
        {renderSubMenu('normal')}
      </div>
    </>
  );
};
