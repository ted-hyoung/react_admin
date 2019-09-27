// base
import React from 'react';

// moudels
import { Tabs } from 'antd';

// components
import { DailySales } from 'components';
import { BrandSales } from 'components';

// less
import './index.less';

function Statistics() {
  return (
    <div className="statistics-content">
      <Tabs defaultActiveKey="DAILY_SALES">
        <Tabs.TabPane tab="일일 매출" key="DAILY_SALES">
          <DailySales />
        </Tabs.TabPane>
        <Tabs.TabPane tab="제품 매출" key="PRODUCT_SALES">
        </Tabs.TabPane>
        <Tabs.TabPane tab="브랜드 매출" key="BRAND_SALES">
          <BrandSales />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default Statistics;
