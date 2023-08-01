import { PageContainer } from '@ant-design/pro-components';
import { useCallback, useEffect, useState } from 'react';
import styles from './index.less';
import { Button, ColorPicker, Divider, Image, message } from 'antd';
import { getShopStyle, setShopStyle } from './service';
import { ColourScheme } from './data';

const colorList: ColourScheme[] = [
  {
    primaryColor: '#ea4237',
    subColor: '#ec617d',
    promotionalColor: '#f19f59',
  },
  {
    primaryColor: '#ec617d',
    subColor: '#fbe7e8',
    promotionalColor: '#ea9938',
  },
  {
    primaryColor: '#aa96da',
    subColor: '#ffffd2',
    promotionalColor: '#fcbad3',
  },
  {
    primaryColor: '#895ae9',
    subColor: '#171002',
    promotionalColor: '#ea4941',
  },
  {
    primaryColor: '#4ca733',
    subColor: '#171002',
    promotionalColor: '#ea9938',
  },
  {
    primaryColor: '#00b8a9',
    subColor: '#64d2a0',
    promotionalColor: '#ea9938',
  },
];

const diyDefaultColor = {
  primaryColor: '#71c9ce',
  subColor: '#e3fdfd',
  promotionalColor: '#364f6b',
};

export default () => {
  const [selected, setSelected] = useState<ColourScheme>(colorList[0]);
  const [diyColor, setDiyColor] = useState<ColourScheme>(diyDefaultColor);

  useEffect(() => {
    getShopStyle().then((res) => {
      const colors = {
        primaryColor: res.data.primaryColor,
        subColor: res.data.subColor,
        promotionalColor: res.data.promotionalColor,
      };
      setSelected(colors);

      if (!colorList.map((i) => i.primaryColor).includes(res.data.primaryColor))
        setDiyColor(colors);
    });
  }, []);

  const submit = () => {
    setShopStyle(selected).then((res) => {
      if (res.code === 0) {
        message.success('保存成功！');
      } else {
        message.error(res.message);
      }
    });
  };

  const renderColorBox = useCallback(
    (colourScheme: ColourScheme) => (
      <div
        key={colourScheme.primaryColor}
        className={`${styles.colorBox} ${
          selected?.primaryColor === colourScheme.primaryColor ? styles.active : styles.inactive
        }`}
        onClick={() => setSelected(colourScheme)}
      >
        <div className={styles.colorBox_a} style={{ background: colourScheme.primaryColor }} />
        <div className={styles.colorBox_b} style={{ background: colourScheme.subColor }} />
        <div className={styles.colorBox_c} style={{ background: colourScheme.promotionalColor }} />
      </div>
    ),
    [selected],
  );

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <div style={{ display: 'flex', background: '#fff', padding: 20 }}>
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 30 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3>默认主题色系</h3>
              <Button type="primary" style={{ marginRight: 14 }} onClick={() => submit()}>
                保存
              </Button>
            </div>
            {renderColorBox(colorList[0])}
          </div>

          <div style={{ marginBottom: 30 }}>
            <h3>系统推荐色系</h3>
            <div className={styles.colorList}>
              {colorList.map((i, index) => {
                return index !== 0 && renderColorBox(i);
              })}
            </div>
          </div>

          <div>
            <h3>自定义色系</h3>
            <div
              className={`${styles.colorBox} ${
                selected?.primaryColor === diyColor.primaryColor ? styles.active : styles.inactive
              }`}
              onClick={() => setSelected(diyColor)}
            >
              <ColorPicker
                value={diyColor.primaryColor}
                onChange={(e) => setDiyColor({ ...diyColor, primaryColor: '#' + e.toHex() })}
              >
                <div className={styles.colorBox_a} style={{ background: diyColor.primaryColor }} />
              </ColorPicker>

              <ColorPicker
                value={diyColor.subColor}
                onChange={(e) => setDiyColor({ ...diyColor, subColor: '#' + e.toHex() })}
              >
                <div className={styles.colorBox_b} style={{ background: diyColor.subColor }} />
              </ColorPicker>
              <ColorPicker
                value={diyColor.promotionalColor}
                onChange={(e) => setDiyColor({ ...diyColor, promotionalColor: '#' + e.toHex() })}
              >
                <div
                  className={styles.colorBox_c}
                  style={{ background: diyColor.promotionalColor }}
                />
              </ColorPicker>
            </div>
          </div>
        </div>
        <Divider type="vertical" style={{ height: 'auto', marginRight: 20 }} />
        <div style={{ flex: 1.5 }}>
          <h3>主题色系说明：</h3>
          <div style={{ lineHeight: '22px', color: '#606266', marginBottom: 20 }}>
            通过左侧的主题色系设置可以快速帮您实现全店铺包括首页、交易流程、个人中心等个性化风格配色,完整的主题色(含主色、辅色、促销色)以商详页为例:
          </div>

          <div style={{ display: 'flex' }}>
            {/* 详情 */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Image
                preview={false}
                width={300}
                src="https://img.xiaokeduo.com/xkdnewyun/shopweb/static/detail-1.b7d9cb4b.png"
                onLoad={(e) => {
                  console.log(e);
                }}
              />

              <div className={styles.commodity_price}>
                <div style={{ color: selected.primaryColor }}>￥</div>
                <div style={{ color: selected.primaryColor }}>349.00</div>
              </div>

              <div style={{ position: 'absolute', bottom: 0, right: 0, display: 'flex' }}>
                <div
                  style={{ background: selected.promotionalColor }}
                  className={styles.commodity_addCart}
                >
                  <span style={{ color: '#fff' }}>加入购物车</span>
                </div>
                <div style={{ background: selected.primaryColor }} className={styles.commodity_buy}>
                  <span style={{ color: '#fff' }}>立即购买</span>
                </div>
              </div>
            </div>
            {/* 详情 */}

            {/* 规格 */}
            <div style={{ position: 'relative', display: 'inline-block', marginLeft: 10 }}>
              <Image
                preview={false}
                width={300}
                src="https://img.xiaokeduo.com/xkdnewyun/shopweb/static/detail-2.5fab05c8.png"
              />
              <div
                className={styles.commodity_price}
                style={{
                  top: 203,
                  left: 112,
                }}
              >
                <div style={{ color: selected.primaryColor }}>￥</div>
                <div style={{ color: selected.primaryColor }}>349.00</div>
              </div>

              <div className={styles.commodity_sku}>
                <div className={styles.commodity_sku_title}>颜色</div>
                <div className={styles.commodity_sku_list}>
                  {new Array(7).fill(1).map((i, index) => {
                    return (
                      <div
                        key={index}
                        className={styles.commodity_sku_item}
                        style={{
                          borderColor: index === 2 ? selected.primaryColor : '#909399',
                          color: index === 2 ? selected.primaryColor : '#909399',
                        }}
                      >
                        黑色
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ position: 'absolute', bottom: 0, right: 0, display: 'flex' }}>
                <div style={{ background: selected.primaryColor }} className={styles.commodity_but}>
                  <span style={{ color: '#fff' }}>确定</span>
                </div>
              </div>
            </div>
            {/* 规格 */}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
