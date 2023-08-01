import { outLogin } from '@/services/ant-design-pro/api';
import {
  FileProtectOutlined,
  LogoutOutlined,
  RetweetOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Avatar, Menu, Spin } from 'antd';
import queryString from 'query-string';
import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
export const loginOut = async () => {
  await outLogin();
  const { search, pathname } = history.location;
  const query = queryString.parse(search);
  const { redirect } = query;
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/Login' && !redirect) {
    history.replace({
      pathname: '/Login',
      search: stringify({
        redirect: pathname + search,
      }),
    });
  }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({}) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [loginOutModal, setLoginOutModal] = useState<boolean>(false);
  // const [form] = Form.useForm();
  const [open] = useState(false);

  // const showDrawer = () => {
  //   setOpen(true);
  // };

  // const onClose = () => {
  //   setOpen(false);
  // };

  useEffect(() => {
    const layoutDom = document.querySelector('.ant-layout.ant-layout-has-sider');
    if (layoutDom) {
      console.log('layoutDom.classList', layoutDom.classList);
      if (open) {
        layoutDom.classList.add('open');
      } else {
        if (layoutDom.classList.contains('open')) {
          layoutDom.classList.remove('open');
        }
      }
    }
  }, [open]);

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        setLoginOutModal(true);

        return;
      }
      // if (key === 'updatePassword') {
      //   setModalVisible(true);
      //   return;
      // }
      if (key === 'userInfo') {
        history.push(`/Setting/basic/UserInfo`);
        return;
      }
      if (key === 'loginLog') {
        history.push(`/Setting/basic/LoginLog`);
        return;
      }
      if (key === 'operationLog') {
        history.push(`/Setting/basic/OperationLog`);
        return;
      }
      history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.userName) {
    return loading;
  }

  // const submitForm = async (value: any) => {
  //   const result = await request('/admin/system/updatePsw', { data: { ...value }, method: 'POST' });
  //   if (result.code === 0) {
  //     message.success('修改成功!');
  //     history.replace({
  //       pathname: '/login',
  //     });
  //   }
  // };
  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item style={{ paddingBlock: 8 }} key="userInfo">
        <UserOutlined />
        &nbsp; 账户信息
      </Menu.Item>
      <Menu.Item style={{ paddingBlock: 8 }} key="loginLog">
        <FileProtectOutlined />
        &nbsp; 登录日志
      </Menu.Item>
      <Menu.Item style={{ paddingBlock: 8 }} key="operationLog">
        <FileProtectOutlined />
        &nbsp; 操作日志
      </Menu.Item>
      {/* <Menu.Item style={{ paddingBlock: 8 }} key="changeStore">
        <RetweetOutlined />
        &nbsp; 切换店铺
      </Menu.Item> */}
      {/* <Modal
      title="修改密码"
      visible={modalVisible}
      onCancel={() => {
        setModalVisible(false);
      }}
      onOk={() => {
        form.submit();
      }}
    >
      <Form name="basic" labelCol={{ span: 4 }} form={form} onFinish={submitForm}>
        <Form.Item label="旧密码:" name="oldPsw">
          <Input.Password placeholder="请输入旧的密码" />
        </Form.Item>
        <Form.Item label="新密码:" name="newPsw">
          <Input.Password placeholder="请输入新的密码" />
        </Form.Item>
      </Form>
    </Modal> */}

      <Menu.Item style={{ paddingBlock: 8 }} key="logout">
        <LogoutOutlined /> &nbsp;退出登录
      </Menu.Item>
    </Menu>
  );

  const renderServiceAndHelp = open ? (
    <div
      style={{
        width: 200,
        background: 'white',
        // position: 'relative',
        position: 'fixed',
        height: '100vh',
        top: 55,
        right: 0,
      }}
    >
      <div style={{ fontSize: 13, padding: 15 }}>
        {/* <p>如何设置企业名片？</p>
        <p>如何认证企业信息？</p>
        <p>如何分配权限？</p>
        <a href="">了解更多</a> */}
        {/* <div
          style={{
            position: 'absolute',
            bottom: 40,
            height: 100,
            left: -3,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #f0f0f0',
              width: 152,
              height: 30,
            }}
          >
            <MailOutlined style={{ fontSize: '15px' }} />
            <span style={{ fontSize: '14px', marginLeft: '10px', lineHeight: '17px' }}>
              意见反馈
            </span>
          </div>
          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 13, lineHeight: '17px' }}>客服热线:0571-85178220</span>
          </p>
        </div> */}
      </div>
    </div>
  ) : null;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div
        style={{ marginRight: 20, cursor: 'pointer' }}
        onClick={() => {
          history.push(`/SelectStore`);
        }}
      >
        <RetweetOutlined />
        &nbsp; 切换店铺
      </div>
      <HeaderDropdown menu={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={currentUser.headImage} alt="avatar" />
          {/* <span className={`${styles.name} anticon`}>{currentUser.userName}</span> */}
          <span className={`${styles.name} anticon`}>
            {currentUser.realName ?? currentUser.userName}
          </span>
          <UnorderedListOutlined style={{ marginLeft: 10 }} />
        </span>
      </HeaderDropdown>
      {/* <div
        style={{
          cursor: 'pointer',
          color: '#2a2b2e',
          fontSize: '14px',
          fontWeight: '700',
          width: 200,
          paddingInline: 20,
          display: 'flex',
          justifyContent: 'space-between',
          borderLeft: '1px solid #f2f2fa',
        }}
        onClick={() => {
          // showDrawer();
          setOpen((open) => !open);
        }}
      >
        <span>帮助与服务</span>
        {open ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
      </div> */}
      {document.querySelector('.ant-layout.ant-layout-has-sider')
        ? createPortal(
            renderServiceAndHelp,
            document.querySelector('.ant-layout.ant-layout-has-sider')!,
          )
        : null}
      {/* <Drawer title="帮助与服务" placement={'right'} width={500} onClose={onClose} open={open}>
        <p>如何设置企业名片？</p>
        <p>如何认证企业信息？</p>
        <p>如何分配权限？</p>
        <a href="">了解更多</a>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'absolute',
            bottom: 0,
            width: '100%',
            paddingRight: '50px',
            boxSizing: 'border-box',
            borderTop: '1px solid #f0f0f0',
          }}
        >
          <p style={{ display: 'flex', alignItems: 'center' }}>
            <PhoneOutlined style={{ fontSize: '18px' }} />
            <span style={{ fontSize: '15px', marginLeft: '10px', lineHeight: '17px' }}>
              客服热线：0571-85178220
            </span>
          </p>
          <p style={{ display: 'flex', alignItems: 'center' }}>
            <MailOutlined style={{ fontSize: '18px' }} />
            <span style={{ fontSize: '15px', marginLeft: '10px', lineHeight: '17px' }}>
              意见反馈
            </span>
          </p>
        </div>
      </Drawer> */}
      <ModalForm<any>
        key="updateRealName"
        width={375}
        title={'提示'}
        open={loginOutModal}
        onOpenChange={setLoginOutModal}
        modalProps={{ destroyOnClose: true, maskClosable: false }}
        initialValues={currentUser}
        onFinish={async () => {
          setInitialState((s) => ({ ...s, currentUser: undefined }));
          loginOut();
        }}
      >
        确定要退出登录吗?
      </ModalForm>
    </div>
  );
};

export default AvatarDropdown;
