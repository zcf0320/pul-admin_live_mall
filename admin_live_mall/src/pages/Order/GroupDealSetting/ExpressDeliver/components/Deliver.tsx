import { Button, message, Popconfirm, Radio, Space } from 'antd';

import { ProList } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useMemo, useState } from 'react';
import styles from '../index.less';
import { fetchSettingByKey, getPage, remove, setSetting } from '../service';

export default function Deliver() {
  const width = 100;

  // const [deliverOpen, setDeliverOpen] = useState(false);
  const [method, setMethod] = useState(1);
  const [payAfterReceive, setPayAfterReceive] = useState(1);

  const getSettings = () => {
    fetchSettingByKey({ keys: ['EXPRESS_DELIVERY'] }).then((res) => {
      // setDeliverOpen(res.data.shippingSwitch);
      if (res.data.EXPRESS_DELIVERY) {
        const result = JSON.parse(res.data.EXPRESS_DELIVERY);
        setMethod(result.billingMethod);
        // setPayAfterReceive(result.cashOnDelivery);
      }
    });
  };

  const saveSettings = () => {
    setSetting([
      {
        key: 'EXPRESS_DELIVERY',
        value: JSON.stringify({
          shippingSwitch: true,
          billingMethod: method,
          // cashOnDelivery: payAfterReceive,
        }),
      },
    ]).then(() => {
      message.success('保存成功');
    });
  };

  useEffect(() => {
    getSettings();
  }, []);

  const [list, setList] = useState<any[]>([]);

  const loadData = () => {
    getPage().then((res) => {
      setList(res.data);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const renderEdit = (record: any) => {
    return (
      <a
        onClick={() => {
          history.push('/Order/AddExpressTemplate?id=' + record.id);
        }}
      >
        编辑
      </a>
    );
  };

  const renderDelete = (record: any) => {
    return (
      <Popconfirm
        onConfirm={() => {
          remove({
            id: record.id,
          }).then(() => {
            message.success('删除成功');
            loadData();
          });
        }}
        title="确认删除该运费模版吗？"
      >
        <a>删除</a>
      </Popconfirm>
    );
  };

  const dataSource = useMemo(() => {
    return list.map((item) => {
      const innerTableDataSource = [
        {
          area: '默认运费',
          id: item.id,
          firstPrice: item.defaultFirstPrice,
          firstCompany: item.defaultFirstCompany,
          continuedPrice: item.defaultContinuedPrice,
          continuedCompany: item.defaultContinuedCompany,
        },
        ...(item.freightTemplateChildList ?? []),
      ];
      const isNum = item.pricingMethod === 'NUM';
      const columns: ColumnsType<any> = [
        {
          title: '配送区域',
          dataIndex: 'area',
        },
        {
          title: !isNum ? '首重(kg)' : '首件（个）',
          dataIndex: 'firstCompany',
          width: 110,
        },
        {
          title: '运费(元)',
          dataIndex: 'firstPrice',
          width: 110,
        },
        {
          title: !isNum ? '续重(kg)' : '续件（个）',
          dataIndex: 'continuedCompany',
          width: 110,
        },
        {
          title: '续费(元)',
          dataIndex: 'continuedPrice',
          width: 110,
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'option',
          width: 120,
          onCell: (_, index) => {
            if (index ?? 0 < (item.freightTemplateChildList ?? []).length) {
              console.log('index', index, list.length, _);
              return { rowSpan: 0 };
            } else {
              return { rowSpan: (item.freightTemplateChildList ?? []).length + 1 };
            }
          },
          render: (text, record) => {
            return <Space size="middle">{[renderEdit(record), renderDelete(record)]}</Space>;
          },
        },
      ];

      return {
        content: (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                background: '#fafafa',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 20,
                borderBottom: '1px solid #e3e3e3',
              }}
            >
              <div>模板名称：{item.name}</div>
              <div>使用该模板的商品：{item.usedCount ?? 0}个</div>
              <div>最后编辑时间：{item.modifyTime}</div>
            </div>
            <Table pagination={false} columns={columns} dataSource={innerTableDataSource} />
          </div>
        ),
      };
    });
  }, [list]);

  return (
    <>
      {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3>快递发货功能</h3>
          <p>
            买家下单可以选择快递发货，由你安排快递送货上门。<a>查看【运费模板】使用教程</a>
          </p>
        </div>
        <div>
          <Switch checked={deliverOpen} onChange={setDeliverOpen} />
        </div>
      </div> */}
      <div style={{ marginTop: 20 }}>
        <h3>快递发货设置</h3>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 20 }}>
          <span style={{ width: width, textAlign: 'right' }} className={styles.dot}>
            计费方式：
          </span>
          <Radio.Group
            value={method}
            onChange={(e) => {
              setMethod(e.target.value);
            }}
          >
            <Radio value={1}>按商品累计运费</Radio>
            <Radio value={2}>组合运费（推荐使用）</Radio>
          </Radio.Group>
          <a>运费计算规则</a>
        </div>
        {/* <div style={{ display: 'flex', alignItems: 'center', marginTop: 30 }}>
          <span style={{ width: width, textAlign: 'right' }} className={styles.dot}>
            货到付款：
          </span>
          <Radio.Group
            value={payAfterReceive}
            onChange={(e) => {
              setPayAfterReceive(e.target.value);
            }}
          >
            <Radio value={true}>开启</Radio>
            <Radio value={false}>关闭</Radio>
          </Radio.Group>
        </div> */}
        <Button onClick={saveSettings} style={{ marginLeft: width, marginTop: 20 }} type="primary">
          保存
        </Button>
      </div>
      <div style={{ marginTop: 20 }}>
        <h3>运费模板设置</h3>
        <Button
          onClick={() => {
            history.push('/Order/AddExpressTemplate');
          }}
          type="primary"
        >
          新增运费模板
        </Button>
      </div>
      <div className={styles['list-container']}>
        <ProList<any>
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
          }}
          metas={{
            // title: {},
            // subTitle: {},
            // type: {},
            // avatar: {},
            content: {},
            // actions: {},
          }}
          // headerTitle="翻页"
          itemHeaderRender={() => null}
          dataSource={dataSource}
        />
      </div>
    </>
  );
}
