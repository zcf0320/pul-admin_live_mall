import { normImage, UploadPhotos } from '@/pages/components/UploadPhotos/UploadPhotos';
import { EditOutlined } from '@ant-design/icons';
import { ModalForm, PageContainer, ProFormText } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Card, Image, message } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import React, { useState } from 'react';
import styles from './index.less';
import { updateAccount, updatePassword } from './service';

const UserInfo: React.FC = () => {
  const [headImgModal, setHeadImgModal] = useState<boolean>(false);
  const [userModal, setUserModal] = useState<boolean>(false);
  const [pwdModal, setPwdModal] = useState<boolean>(false);
  // const [roleModal, setRoleModal] = useState<boolean>(false);
  const [realNameModal, setRealNameModal] = useState<boolean>(false);
  const { initialState, setInitialState } = useModel('@@initialState');
  if (!initialState) {
    return null;
  }

  const { currentUser } = initialState;
  const updateHeadImg = () => {
    setHeadImgModal(true);
  };
  const updateUser = () => {
    setUserModal(true);
  };
  const updatePwd = () => {
    setPwdModal(true);
  };
  // const updateRole = () => {
  //   setRoleModal(true);
  // };
  const updateRealName = () => {
    setRealNameModal(true);
  };
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <Card style={{ paddingTop: 40 }} className={styles['card']}>
        <div className={styles['user-info-box']}>
          <div className={styles['user-info-left']}>
            <Image
              src={currentUser?.headImage ? currentUser?.headImage : ''}
              className={styles['user-headImg']}
            />
            <Button
              type="primary"
              onClick={() => {
                updateHeadImg();
              }}
            >
              更换头像
            </Button>
          </div>
          <div className={styles['user-info-right']}>
            <div>
              账号（手机号）：{currentUser?.mobile}&nbsp;
              <EditOutlined
                onClick={() => {
                  updateUser();
                }}
              />
            </div>
            <div>
              密码：******&nbsp;
              <EditOutlined
                onClick={() => {
                  updatePwd();
                }}
              />
            </div>
            <div>
              角色：{currentUser?.roleNames}&nbsp;
              {/* <EditOutlined
                onClick={() => {
                  updateRole();
                }}
              /> */}
            </div>
            <div>
              姓名：{currentUser?.realName}&nbsp;
              <EditOutlined
                onClick={() => {
                  updateRealName();
                }}
              />
            </div>
          </div>
        </div>
      </Card>
      <ModalForm<any>
        key="updateHeadImg"
        width={375}
        title={'更换头像'}
        open={headImgModal}
        onOpenChange={setHeadImgModal}
        modalProps={{ destroyOnClose: true, maskClosable: false }}
        initialValues={currentUser}
        onFinish={async (formData) => {
          const msg = await updateAccount(formData);
          if (msg.code !== -1) {
            setInitialState((preInitialState: any) => {
              preInitialState.currentUser.headImage = formData.avatar;
              return preInitialState;
            });
            message.info('操作成功！');
            setHeadImgModal(false);
          } else {
            message.info('操作失败！');
          }
        }}
      >
        <FormItem
          name="avatar"
          getValueFromEvent={(e) => normImage(e)}
          label="头像"
          valuePropName="imageUrl"
          rules={[{ required: true }]}
        >
          <UploadPhotos onChange={(e) => normImage(e)} amount={1} />
        </FormItem>
      </ModalForm>
      <ModalForm<any>
        key="updateUser"
        width={375}
        title={'修改账号'}
        open={userModal}
        onOpenChange={setUserModal}
        modalProps={{ destroyOnClose: true, maskClosable: false }}
        initialValues={currentUser}
        onFinish={async (formData) => {
          const msg = await updateAccount(formData);
          if (msg.code !== -1) {
            setInitialState((preInitialState: any) => {
              preInitialState.currentUser.mobile = formData.mobile;
              return preInitialState;
            });
            message.info('操作成功！');
            setUserModal(false);
          } else {
            message.info('操作失败！');
          }
        }}
      >
        <ProFormText
          name="mobile"
          label="账号"
          rules={[{ required: true }]}
          placeholder="请输入账号"
        />
      </ModalForm>
      <ModalForm<any>
        key="updatePwd"
        width={375}
        title={'修改密码'}
        open={pwdModal}
        onOpenChange={setPwdModal}
        modalProps={{ destroyOnClose: true, maskClosable: false }}
        initialValues={currentUser}
        onFinish={async (formData) => {
          if (formData.newPsw !== formData.newPswAgain) {
            message.warning('两次输入的密码不一致');
          } else {
            const msg = await updatePassword(formData);
            if (msg.code !== -1) {
              message.info('操作成功！');
              setPwdModal(false);
            } else {
              message.info('操作失败！');
            }
          }
        }}
      >
        <ProFormText.Password
          name="oldPsw"
          label="旧密码"
          rules={[{ required: true }]}
          placeholder="请输入旧密码"
        />
        <ProFormText.Password
          name="newPsw"
          label="新密码"
          rules={[{ required: true }]}
          placeholder="请输入新密码"
        />
        <ProFormText.Password
          name="newPswAgain"
          label="确认密码"
          rules={[{ required: true }]}
          placeholder="请输入旧密码"
        />
      </ModalForm>
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
      {/* <ModalForm<any>
        key="updateRole"
        width={375}
        title={'修改角色'}
        open={roleModal}
        onOpenChange={setRoleModal}
        modalProps={{ destroyOnClose: true, maskClosable: false }}
        initialValues={currentUser}
        // onFinish={async (formData) => {
        //   const msg = await addRole(FormatFormData);
        //   if (msg.code != -1) {
        //     message.info('操作成功！');
        //   } else {
        //     message.info('操作失败！');
        //   }
        // }}
      >
        <ProFormSelect
          request={async () => {
            const res = await getRoleList({ pageNo: 1, pageSize: 9999 });
            const list = res.data.records.map((v: Role) => {
              return { label: v.roleName, value: v.id };
            });
            return list;
          }}
          width="sm"
          name="roleName"
          label="角色"
          placeholder={'请选择角色'}
          rules={[{ required: true }]}
        />
      </ModalForm> */}
      <ModalForm<any>
        key="updateRealName"
        width={375}
        title={'修改姓名'}
        open={realNameModal}
        onOpenChange={setRealNameModal}
        modalProps={{ destroyOnClose: true, maskClosable: false }}
        initialValues={currentUser}
        onFinish={async (formData) => {
          const msg = await updateAccount(formData);
          if (msg.code !== -1) {
            setInitialState((preInitialState: any) => {
              preInitialState.currentUser.realName = formData.realName;
              return preInitialState;
            });
            message.info('操作成功！');
            setRealNameModal(false);
          } else {
            message.info('操作失败！');
          }
        }}
      >
        <ProFormText
          name="realName"
          label="姓名"
          rules={[{ required: true }]}
          placeholder="请输入姓名"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default UserInfo;
