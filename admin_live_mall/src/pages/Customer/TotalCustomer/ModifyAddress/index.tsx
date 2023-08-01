import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { Form } from 'antd';
import { ModalForm, ProFormCascader, ProFormText } from '@ant-design/pro-components';
import { getAllCity, getSubcity } from '@/pages/Customer/TotalCustomer/services';

interface IProps {
  showModifyAddress: boolean;
  setShowModifyAddress: Dispatch<SetStateAction<boolean>>;
  setRefresh: () => void;
}

const setCity = (data: any[]) => {
  let newCityArr: any[] = [];
  data.forEach((item: any) => {
    let newChildren: any = [];
    if (item.parentId === '0') {
      const { name = '', children = [], id } = item;
      newCityArr.push({
        value: id,
        label: name,
        children: newChildren,
        id,
      });
      children.forEach((newCity: any) => {
        if (newCity.parentId === id) {
          newChildren.push({
            id: newCity.id,
            parentId: newCity.parentId,
            value: newCity.id,
            label: newCity.name,
            isLeaf: false,
          });
        }
      });
    }
  });
  return newCityArr;
};

const ModifyAddress: FC<IProps> = (props: IProps) => {
  const { showModifyAddress = false, setShowModifyAddress } = props || {};
  const [form] = Form.useForm();
  const [allCity, setAllCity] = useState<any>([]);

  const getAddress = async () => {
    const { data = [] } = await getAllCity();
    //localStorage.setItem('allCity', JSON.stringify(data));
    setAllCity(setCity(data));
    return setCity(data);
  };

  const getChildArea = async (id: string, isLeaf: boolean = true) => {
    const { data } = await getSubcity({ id });
    return data.map(
      ({
        id,
        name,
        parentId,
        cityCode,
      }: {
        cityCode: string;
        name: string;
        parentId: string;
        id: string;
      }) => ({
        id,
        value: id,
        label: name,
        parentId,
        cityCode,
        isLeaf,
      }),
    );
  };

  const loadAddressData = (selectedOptions: any) => {
    // 选择市区后加载县区
    const targetOption = selectedOptions[selectedOptions.length - 1];
    // if (selectedOptions[3]?.id) {
    //   getChildArea(selectedOptions[3].id, true).then((res) => {
    //     targetOption.children = res;
    //     setAllCity([...allCity]);
    //   });
    //   return;
    // }
    // if (selectedOptions[2]?.id) {
    //   getChildArea(selectedOptions[2].id).then((res) => {
    //     targetOption.children = res;
    //     setAllCity([...allCity]);
    //   });
    //   return;
    // }
    // 动态加载地址数据
    if (selectedOptions[1]?.id) {
      getChildArea(selectedOptions[1].id).then((res) => {
        targetOption.children = res;
        setAllCity([...allCity]);
      });
    }
  };

  useEffect(() => {
    if (showModifyAddress) {
      const currentAreaArr = ['1401797451504943104', '1401797451504943105', '1401797451504943132'];
      form.setFieldValue('area', currentAreaArr);
      getAddress().then((data) => {
        getChildArea(currentAreaArr[1]).then((res) => {
          let newArr = data;
          newArr.forEach((item) => {
            if (currentAreaArr[0] === item.id) {
              item.children.forEach((child: any) => {
                if (child.id === currentAreaArr[1]) {
                  child.children = res;
                }
              });
            }
          });
          setAllCity(newArr);
        });
      });
    } else {
      form.resetFields();
    }
  }, [showModifyAddress]);

  // 修改用户地址
  return (
    <ModalForm
      title="修改用户地址"
      layout="inline"
      open={showModifyAddress}
      onOpenChange={setShowModifyAddress}
      form={form}
    >
      <div>
        <div style={{ margin: '10px 0 20px 0' }}>当前用户前地址：</div>
        <div style={{ display: 'flex' }}>
          <ProFormCascader
            name="area"
            label="修改用户地址"
            width="sm"
            placeholder="请选择省/市/区"
            fieldProps={{
              options: allCity,
              loadData: loadAddressData,
              // onChange: (select) => {
              //   console.log(select);
              // },
            }}
          />
          <ProFormText name="area" width="lg" placeholder="请填写详细地址" />
        </div>
      </div>
    </ModalForm>
  );
};

export default ModifyAddress;
