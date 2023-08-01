// 导航设置 //store/storeSettings/NavTagSetting
import { FC, useEffect, useState } from 'react';
import { Button, Card, ColorPicker, Form, message, Spin, Tabs } from 'antd';
import { PageContainer, ProFormText } from '@ant-design/pro-components';
import type { FormInstance } from 'antd/es/form';
import { Color } from 'antd/lib/color-picker';

import { normImage, UploadPhotos } from '@/pages/components/UploadPhotos/UploadPhotos';

import { getDiyAppletSettings, setDiyAppletSettings } from '@/api/diyAppletSettings';

import styles from './index.module.less';

const FormItem = Form.Item;
const key = 'SHOP_DECORATION';
// const tabNumRange = {
//   max: 5,
//   min: 1,
// };
const colorList: string[] = ['#3474FF', '#FA4E01', '#000', '#333', '#666', '#999'];
const selectColorList: string[] = [
  '#FB456C',
  '#C3A769',
  '#26B8B1',
  '#FBC600',
  '#3474FF',
  '#FA4E01',
];
const defaultPanes: IPanes[] = [
  {
    key: '1',
    label: '导航1',
    closable: false,
  },
  {
    key: '2',
    label: '导航2',
    closable: false,
  },
  {
    key: '3',
    label: '导航3',
    closable: false,
  },
  {
    key: '4',
    label: '导航4',
    closable: false,
  },
  {
    key: '5',
    label: '导航5',
    closable: false,
  },
];

interface INavPage {
  tabBarList: ITabBarList[]; //tab数组
  activeColor: string; //当前默认文字的颜色
  selectActiveColor: string; // 当前选中的文字颜色
  activeKey: string; //当前选择的tab
  setActiveKey: (activeKey: string) => void;
}

const NavPage = (props: INavPage) => {
  const {
    tabBarList = [],
    activeColor = '',
    selectActiveColor = '',
    activeKey = 1,
    setActiveKey,
  } = props || {};

  return (
    <div className={styles.navPage}>
      <img src={require('@/assets/navPageHeader.png')} alt="" className={styles.navHeader} />
      <div className={styles.pageBody} />
      <div className={styles.pageTabbar}>
        {tabBarList?.map((item: ITabBarList, index: number) => {
          const currentIconUrl =
            +activeKey === index + 1
              ? item.selectIconUrl || item.iconUrl
              : item.iconUrl || item.selectIconUrl;
          return (
            <a
              key={item.key}
              // href={item.link}
              className={styles.tabBarItem}
              onClick={() => setActiveKey(`${index + 1}`)}
              style={{
                left: `${(index / tabBarList.length) * 100}%`,
              }}
            >
              <div style={{ color: +activeKey === index + 1 ? selectActiveColor : activeColor }}>
                {item.iconUrl || item.selectIconUrl ? (
                  <img src={currentIconUrl} alt="" className={styles.iconUrl} />
                ) : null}

                <div className={item.title ? styles.tabBarTitle : styles.noneTitle}>
                  {item.title}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

interface ITabContent {
  form: FormInstance;
  activeKey: string;
  tabBarList: ITabBarList[];
  setTabBarList: (arr: ITabBarList[]) => void;
}

const TabContent = (props: ITabContent) => {
  const { form, activeKey = '', tabBarList = [], setTabBarList } = props || {};
  const setImageUrl = (fileList: File[], iconType: string): void => {
    const url = normImage(fileList);
    const arr = tabBarList.map((item: ITabBarList) => {
      let newItem = item;
      if (item.key === activeKey) {
        newItem = {
          ...item,
          [iconType]: url,
        };
      }
      return newItem;
    });
    setTabBarList(arr);
  };

  const onChangeFormValue = (value: string, values: ITabBarList) => {
    const newTabBarList = tabBarList.map((item: ITabBarList) => {
      let newItem = item;
      if (newItem.key === activeKey) {
        newItem = {
          ...item,
          ...values,
        };
      }
      return newItem;
    });
    setTabBarList(newTabBarList);
  };

  useEffect(() => {
    const activeTabBar = tabBarList.find((item: ITabBarList) => item.key === activeKey) || {};
    const { iconUrl = '', selectIconUrl = '' } = activeTabBar as ITabBarList;
    form.setFieldsValue({
      ...activeTabBar,
      [activeKey + 'iconUrl']: iconUrl,
      [activeKey + 'selectIconUrl']: selectIconUrl,
    });
  }, [tabBarList, activeKey]);

  return (
    <div>
      <Form form={form} labelWrap onValuesChange={onChangeFormValue}>
        <ProFormText
          label="导航名称"
          name="title"
          rules={[{ required: true, message: '请输入导航名称' }]}
        />
        <div style={{ display: 'flex' }}>
          <FormItem
            style={{ marginRight: 30 }}
            name={`${activeKey}iconUrl`}
            getValueFromEvent={normImage}
            valuePropName={'imageUrl'}
            label="未选中状态图标"
            rules={[{ required: true, message: '请上传图标' }]}
            className={styles.uploadPhotos}
          >
            <UploadPhotos
              amount={1}
              onChange={(fileList: File[]) => setImageUrl(fileList, 'iconUrl')}
            />
          </FormItem>
          <FormItem
            name={`${activeKey}selectIconUrl`}
            getValueFromEvent={normImage}
            valuePropName={'imageUrl'}
            label="选中状态图标"
            rules={[{ required: true, message: '请上传图标' }]}
            className={styles.uploadPhotos}
          >
            <UploadPhotos
              amount={1}
              onChange={(fileList: File[]) => setImageUrl(fileList, 'selectIconUrl')}
            />
          </FormItem>
        </div>
        {/*<ProFormText label="链接" name="link" rules={[{ required: true, message: '请输入链接' }]} />*/}
      </Form>
    </div>
  );
};
const NavTagSetting: FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string>(defaultPanes[0].key);
  // const [tabItems, setTabItems] = useState(defaultPanes);
  const [activeColor, setActiveColor] = useState<string>(colorList[0]);
  const [selectActiveColor, setSelectActiveColor] = useState<string>(selectColorList[0]);
  const [tabBarList, setTabBarList] = useState<ITabBarList[]>([]);

  const onChange = (key: string) => {
    form.validateFields().then(() => {
      setLoading(true);
      setActiveKey(key);
      setTimeout(() => {
        setLoading(false);
      }, 200);
    });
  };

  // const addTab = () => {
  //   const currentKey = tabItems.length + 1;
  //   let lastTabItem: any[] = [];
  //   // if (currentKey > tabNumRange.min) {
  //   //   lastTabItem = [
  //   //     {
  //   //       ...tabItems.splice(-1)[0],
  //   //       closable: false,
  //   //     },
  //   //   ];
  //   // }
  //   setTabItems([
  //     ...tabItems,
  //     ...lastTabItem,
  //     {
  //       key: `${currentKey}`,
  //       label: `导航${currentKey}`,
  //       closable: false,
  //     },
  //   ]);
  //   setActiveKey(currentKey + '');
  //   setTabBarList([
  //     ...tabBarList,
  //     {
  //       key: `${currentKey}`,
  //       title: '',
  //       // link: '',
  //       iconUrl: '',
  //       selectIconUrl: '',
  //     },
  //   ]);
  // };
  //
  // // 删除
  // const removeTab = (targetKey: string) => {
  //   const targetIndex = tabItems.findIndex((pane) => pane.key === targetKey);
  //   const newPanes = tabItems.filter((pane) => pane.key !== targetKey);
  //   if (newPanes.length) {
  //     form.resetFields();
  //     const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
  //     setActiveKey(key);
  //     setTabBarList(tabBarList.filter((item) => item.key !== targetIndex + 1 + ''));
  //     // let lastTabItem: any = [];
  //     // if (targetIndex > tabNumRange.min) {
  //     //   lastTabItem = [
  //     //     {
  //     //       ...newPanes.splice(-1)[0],
  //     //       closable: true,
  //     //     },
  //     //   ];
  //     // }
  //     setTabItems(newPanes);
  //   }
  // };

  // const onEdit = (targetKey: any, action: 'add' | 'remove') => {
  //   if (action === 'add') {
  //     addTab();
  //   } else {
  //     removeTab(targetKey);
  //   }
  // };

  const setNavTagSetting = async () => {
    form.validateFields().then(async () => {
      let values = {};
      tabBarList?.forEach((item, index) => {
        values = {
          ...values,
          ['icon' + (index + 1)]: item.iconUrl,
          ['selectedIcon' + (index + 1)]: item.selectIconUrl,
          ['tabText' + (index + 1)]: item.title,
        };
      });
      const params: string = JSON.stringify({
        color: activeColor,
        selectedColor: selectActiveColor,
        ...values,
        tabBarList,
      });
      await setDiyAppletSettings({
        settingList: [
          {
            key,
            value: params,
          },
        ],
      });
      message.success('设置成功！');
    });
  };
  const getNavTagSetting = async () => {
    const res = await getDiyAppletSettings({ keys: [key] });
    const { color = '', selectedColor = '', tabBarList = [] } = JSON.parse(res.data[key]);
    setActiveColor(color);
    setSelectActiveColor(selectedColor);
    // console.log(tabBarList);
    if (tabBarList?.length) {
      setTabBarList(tabBarList);
    } else {
      setTabBarList(
        defaultPanes.map((item) => ({
          key: item.key,
          title: item.label,
          // link: '',
          iconUrl: '',
          selectIconUrl: '',
        })),
      );
    }
  };

  // 获取设置信息
  useEffect(() => {
    getNavTagSetting();
  }, []);

  return (
    <PageContainer header={{ breadcrumb: undefined, title: '导航设置' }}>
      <Card>
        <div className={styles.pageContainer}>
          <NavPage
            tabBarList={tabBarList}
            activeKey={activeKey}
            setActiveKey={setActiveKey}
            activeColor={activeColor}
            selectActiveColor={selectActiveColor}
          />
          <div className={styles.pageRight}>
            <Form form={form}>
              <div className={styles.colorBox}>
                <span>导航默认文字颜色：</span>
                {colorList.map((color) => {
                  return (
                    <div key={color}>
                      <div
                        className={styles.colorSelect}
                        style={{ borderColor: activeColor === color ? '#16adff' : '#e8e8e8' }}
                        onClick={() => setActiveColor(color)}
                      >
                        <div
                          className={styles.color}
                          style={{
                            backgroundColor: color,
                          }}
                        />
                      </div>
                      <div className={styles.colorText}>{color}</div>
                    </div>
                  );
                })}
                <div className={styles.colorCustom}>
                  <span>自定义：</span>
                  <ColorPicker
                    value={activeColor}
                    onChange={(_: Color, hex) => {
                      setActiveColor(hex);
                    }}
                  />
                </div>
              </div>
              <div className={styles.colorBox}>
                <span>导航选中文字颜色：</span>
                {selectColorList.map((color) => {
                  return (
                    <div key={color}>
                      <div
                        className={styles.colorSelect}
                        style={{ borderColor: selectActiveColor === color ? '#16adff' : '#e8e8e8' }}
                        onClick={() => setSelectActiveColor(color)}
                      >
                        <div
                          className={styles.color}
                          style={{
                            backgroundColor: color,
                          }}
                        />
                      </div>
                      <div className={styles.colorText}>{color}</div>
                    </div>
                  );
                })}
                <div className={styles.colorCustom}>
                  <span>自定义：</span>
                  <ColorPicker
                    value={selectActiveColor}
                    onChange={(_: Color, hex: string) => {
                      setSelectActiveColor(hex);
                    }}
                  />
                </div>
              </div>
            </Form>
            <div className={styles.tabContainer}>
              <span>导航设置：</span>
              <div>
                <Tabs
                  key="key"
                  type="editable-card"
                  activeKey={activeKey}
                  items={defaultPanes}
                  // onEdit={onEdit}
                  onChange={onChange}
                  hideAdd
                  // hideAdd={tabItems.length >= tabNumRange.max}
                />
                <Spin spinning={loading}>
                  <TabContent
                    form={form}
                    activeKey={activeKey}
                    tabBarList={tabBarList}
                    setTabBarList={setTabBarList}
                  />
                </Spin>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.saveBtn}>
          <Button type="primary" onClick={setNavTagSetting}>
            保存设置
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
};

export default NavTagSetting;
