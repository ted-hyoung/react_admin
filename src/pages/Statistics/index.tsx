// base
import React from 'react';

// moudels
import { Tabs } from 'antd';

// containers
import { DailySales, ProductSales, BrandSales } from 'containers';

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
          <ProductSales />
        </Tabs.TabPane>
        <Tabs.TabPane tab="브랜드 매출" key="BRAND_SALES">
          <BrandSales />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default Statistics;
