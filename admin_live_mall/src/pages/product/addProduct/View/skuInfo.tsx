import { Button, Card, message, Select } from 'antd';
import React, {
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from '../style/property.module.less';
import EditAbleTable, { EditAbleTableInstance } from './editAbleTable';
import { getPage } from '../../ProductManagement/PageSpecification/service';
import { TableListItem } from '../../ProductManagement/PageSpecification/data';
import { isArray } from '../../../utils/is';
import { CloseCircleOutlined } from '@ant-design/icons';

const baseColumns = [
  {
    title: '规格图片',
    dataIndex: 'specsPic',
    editable: true,
    width: 90,
  },

  {
    title: '产品编号',
    dataIndex: 'skuCode',
    editable: true,
    width: 160,
  },
  {
    title: '销售价',
    dataIndex: 'salePrice',
    editable: true,
    price: true,
  },
  {
    title: '划线价',
    dataIndex: 'marketPrice',
    editable: true,
    price: true,
  },
  {
    title: '成本价',
    dataIndex: 'costPrice',
    editable: true,
    price: true,
  },
  {
    title: '库存',
    dataIndex: 'stock',
    editable: true,
    number: true,
  },
  {
    title: '重量（kg）',
    dataIndex: 'weight',
    editable: true,
    width: 140,
    number: true,
  },
];

export interface BaseSkuInfo {
  key: string;
  specsPic: string;
  salePrice: number;
  marketPrice: number;
  costPrice: number;
  skuCode: string;
  weight: number;
  stock: number;
  specId?: string;
  specsName?: string;
}

const basicData = {
  key: '1',
  salePrice: 0,
  marketPrice: 0,
  costPrice: 0,
  skuCode: '',
  specsPic: '',
  stock: 1000,
  weight: 0,
};

export type ISpecList = { id: string; name: string; values: { id: string; name: string }[] }[];

export interface SkuInfoInstance {
  validate: () => Promise<{
    skuData: BaseSkuInfo[];
    specList: ISpecList;
  }>;
  setFiledValues: (field: string | number | symbol, value: any) => void;
}

interface ISpecItem {
  value: string | undefined;
  name: string;
  children: Array<
    | {
        id: string;
        name: string;
      }
    | undefined
  >;
}

function SkuInfo(props: any, ref: Ref<SkuInfoInstance>) {
  const editAbleTableRef = useRef<EditAbleTableInstance>(null);
  const [skuInfoData, setSkuInfoData] = useState<Array<BaseSkuInfo>>(() => {
    return [];
  });

  const [skuList, setSkuList] = useState<TableListItem[]>();

  useEffect(() => {
    getPage({ pageNo: 1, pageSize: 10000 }).then((res) => {
      setSkuList(res.data.records);
    });
  }, []);

  const [specAttribution, setSpecAttribution] = useState<ISpecItem[]>(() => {
    return [
      {
        value: undefined,
        name: '',
        children: [undefined],
      },
    ];
  });

  const specNameChange = (index: number, value: string, label: string) => {
    setSpecAttribution((item) => {
      const newSpec = [...item];
      newSpec[index].value = value;
      newSpec[index].name = label;
      newSpec[index].children = [undefined];

      return newSpec;
    });
  };

  const specValueChange = (
    index: number,
    specValueIndex: number,
    value: {
      id: string;
      name: string;
    },
  ) => {
    setSpecAttribution((item) => {
      const newSpec = [...item];
      // newSpec[index].value = value;
      newSpec[index].children[specValueIndex] = value;
      return newSpec;
    });
  };

  const specNameSelectOptions = useMemo(() => {
    return skuList?.map((item) => ({
      label: item.name,
      value: item.id,
      disabled: -1 !== specAttribution.findIndex((specItem) => String(item.id) === specItem.value),
    }));
  }, [specAttribution, skuList]);

  const specValueSelectOptions = useCallback(
    (spec: ISpecItem) => {
      return skuList
        ? skuList
            .find((item) => Number(item.id) === Number(spec.value))
            ?.specValues.map((item) => {
              return {
                label: item.value,
                value: item.id,
                disabled:
                  spec.children.findIndex((s) => {
                    return s?.id === String(item.id);
                  }) > -1,
              };
            })
        : [];
    },
    [skuList],
  );

  const addSpecItem = () => {
    setSpecAttribution((item) => {
      const newSpec = [...item];
      newSpec.push({
        value: undefined,
        name: '',
        children: [],
      });
      return newSpec;
    });
  };

  const deleteSpecItem = (index: number) => {
    setSpecAttribution((item) => {
      const newSpec = [...item];
      newSpec.splice(index, 1);
      return newSpec;
    });
  };

  const deleteSpecValue = (index: number, valueIndex: number) => {
    setSpecAttribution((item) => {
      const newSpec = [...item];
      newSpec[index].children.splice(valueIndex, 1);
      return newSpec;
    });
  };

  const addSpecValue = (spec: ISpecItem, index: number) => {
    if (spec.children.findIndex((item) => item === undefined) === -1) {
      setSpecAttribution((item) => {
        const newSpec = [...item];
        newSpec[index].children.push(undefined);
        return newSpec;
      });
    } else {
      message.warning('请先填写当前规格值！');
    }
  };

  // const specAttribution = useMemo(() => {}, []);

  function calcDescartes(array: string[][]): string[] | string[][] {
    if (array.length < 2) return array[0] || [];
    return array.reduce((total, currentValue) => {
      let res: any[] = [];

      total.forEach((t) => {
        currentValue.forEach((cv) => {
          if (Array.isArray(t))
            // 或者使用 Array.isArray(t)
            res.push([...t, cv]);
          else res.push([t, cv]);
        });
      });
      return res;
    });
  }

  useEffect(() => {
    const list: Array<Array<string>> = specAttribution
      .map((item) => {
        return item.children
          .filter((item) => item !== undefined)
          .map((item) => item?.name) as string[];
      })
      .filter((item) => item.length > 0);

    const descartes = calcDescartes(list);

    if (descartes.length > 0) {
      setSkuInfoData((oldData) => {
        const newData = descartes.map((item, index) => {
          // const data = { ...(oldData[index] ?? { ...basicData, ...price }) };
          const data = { ...((oldData && oldData[index]) ?? { ...basicData }) };

          if (Array.isArray(item)) {
            const sku = item.map((item) => {
              const specDataItem = specAttribution.map((spec) =>
                spec.children.find((sc) => sc?.name === item),
              );
              // if (specDataIndex) {
              //   data[specDataIndex.name] = item;
              // }
              // return item;
              // return {
              //   id: specDataItem?.value,
              //   name: specDataItem?.name,
              // };

              return specDataItem;
            });
            // console.log(sku);

            data['specId'] = sku
              .map((item) => item.filter((item) => item !== undefined).map((item) => item?.id))
              .join(';');
            data['key'] = sku
              .map((item) => item.filter((item) => item !== undefined).map((item) => item?.id))
              .join(';');
            data['specsName'] = sku
              .filter((item) => item !== undefined)
              .map((item) => item.filter((item) => item !== undefined).map((item) => item?.name))
              .join(';');
          } else {
            const specDataItem = specAttribution.map((spec) =>
              spec.children.find((sc) => sc?.name === item),
            );

            data['specId'] = specDataItem[0]?.id;
            data['specsName'] = specDataItem[0]?.name;
            data['key'] = specDataItem[0]?.id ?? '1';
          }
          return data;
        });
        return newData;
      });
    }

    // return list;
  }, [specAttribution]);

  console.log('skuInfoData', skuInfoData);

  const newColumns = useMemo(() => {
    const columns = [...baseColumns];
    columns.splice(
      1,
      0,
      ...specAttribution
        .filter((item) => item.value !== undefined)
        .filter((item) => item.children.filter((child) => child !== undefined).length > 0)
        .map((item, index) => {
          return {
            title: item.name,
            dataIndex: item.name,
            editable: false,
            price: false,
            render: (item: any, record: any) => {
              return <span>{record.specsName.split(';')[index]}</span>;
            },
          };
        }),
    );
    return columns;
  }, [specAttribution, baseColumns]);

  console.log('newColumns', newColumns);

  useImperativeHandle(
    ref,
    () => {
      return {
        setFiledValues: (
          field: string | number | symbol,
          value: {
            skuList: BaseSkuInfo[];
            specList: ISpecList;
          },
        ) => {
          // editAbleTableRef.current.setFieldValue(field, value);

          setSkuInfoData(value.skuList);
          if (value.specList) {
            setSpecAttribution(
              value.specList?.map((item) => ({
                value: item.id,
                name: item.name,
                children: item.values,
              })),
            );
          }
        },
        validate: () => {
          return new Promise((resolve, reject) => {
            if (!editAbleTableRef.current?.validate) {
              message.error('请填写规格');
              reject();
            }
            editAbleTableRef.current
              ?.validate()
              .then(() => {
                const result = {
                  skuData: skuInfoData,
                  specList: specAttribution.map((item) => ({
                    id: item.value ?? '',
                    name: item.name,
                    values: item.children.filter((item) => item !== undefined) as {
                      id: string;
                      name: string;
                    }[],
                  })),
                };
                resolve(result);
              })
              .catch(reject);
          });
        },
      };
    },
    [skuInfoData],
  );

  return (
    <div className={styles['property']}>
      {specAttribution.map((spec, index) => {
        return (
          <Card style={{ marginBottom: 10 }} key={index}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ width: '80px', textAlign: 'right', flexShrink: 0 }}>规格名称：</span>
                <Select
                  value={spec.value}
                  onChange={(value, options) => {
                    if (!isArray(options)) {
                      specNameChange(index, value, (options as any).label);
                    }
                  }}
                  options={specNameSelectOptions}
                  style={{ width: '200px', flexShrink: 0 }}
                  placeholder="规格名称"
                ></Select>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
                  <Button
                    onClick={() => {
                      deleteSpecItem(index);
                    }}
                    type="link"
                  >
                    删除规格
                  </Button>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 20 }}>
                <span style={{ width: '80px', textAlign: 'right', flexShrink: 0 }}>规格值：</span>
                <div>
                  {spec.children.map((item, specValueIndex) => {
                    console.log('skuList', skuList, spec);
                    return (
                      <span
                        style={{ marginRight: 20, marginBottom: 10, display: 'inline-block' }}
                        key={specValueIndex}
                      >
                        <Select
                          value={item?.id}
                          onChange={(value, options) => {
                            if (!Array.isArray(options)) {
                              specValueChange(index, specValueIndex, {
                                id: String(options.value),
                                name: options.label,
                              });
                            }
                          }}
                          options={specValueSelectOptions(spec)}
                          style={{ width: '200px' }}
                          placeholder="规格值"
                        ></Select>
                        <span style={{ marginLeft: 5 }}>
                          <CloseCircleOutlined
                            onClick={() => {
                              deleteSpecValue(index, specValueIndex);
                            }}
                            style={{ color: '#999', cursor: 'pointer' }}
                          />
                        </span>
                      </span>
                    );
                  })}
                </div>
                <Button
                  onClick={() => {
                    addSpecValue(spec, index);
                  }}
                  type="link"
                >
                  +添加规格值
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
      {specAttribution.length < 5 ? (
        <div style={{ marginTop: 20 }}>
          <Button onClick={addSpecItem}>添加规格项</Button>
        </div>
      ) : null}

      <div style={{ marginTop: '20px' }}>
        <EditAbleTable
          ref={editAbleTableRef}
          changeData={setSkuInfoData}
          // columns={baseColumns}
          columns={newColumns}
          data={skuInfoData}
        />
      </div>
    </div>
  );
}

export default React.memo(React.forwardRef(SkuInfo));
