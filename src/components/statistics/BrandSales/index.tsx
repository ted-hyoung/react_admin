// base
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { connectAdvanced, useDispatch, useSelector } from 'react-redux';

// modules
import { Tabs } from 'antd';

import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import { Bar } from 'react-chartjs-2';

// store
import { StoreState } from 'store';
import { clearDailySalesStatus } from 'store/reducer/order';

// components
import { BrandSalesChart, BrandSalesSearchBar } from 'components';

// utils
import { startDateFormat, endDateFormat } from 'lib/utils';

// types
import { ChartData, DataSets } from 'types';

// less
import './index.less';
import { clearBrandSalesStatus, getStatisticsBrandSalesAsync } from 'store/reducer/brand';
import Form from 'antd/lib/form';

const defaultSearchCondition = {
  startDate: moment(new Date()).format(startDateFormat),
  endDate: moment(new Date()).format(endDateFormat),
  brandIds:[1,2,3,4,5,6,7,8,9]
};

export interface BrandDataSets {
  label: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  hoverBackgroundColor?: string;
  hoverBorderColor?: string;
  type?: string;
  data?: any[];
  stack: string;
}

const DailySales = () => {
  const { TabPane } = Tabs;
  const dispatch = useDispatch();
  const getBrandSales = useCallback(
    (searchCondition?: any) => {
      dispatch(
        getStatisticsBrandSalesAsync.request({
          searchCondition,
        }),
      );
    },
    [dispatch],
  );

  // useEffect(() => {
  //   getBrandSales(defaultSearchCondition);
  // }, [getBrandSales]);

  // const { statistics } = useSelector((state: StoreState) => state.brand);
  //

  const statistics = useMemo(() => {
    return [
     {
        brandId : 1,
        brandName : "비클",                // 브랜드명
        totalSalesAmount : 2220,           // 총 순매출액
        totalOrderCompleteAmount : 10000,   // 총 주문완료 금액
        totalOrderCompleteCount : 5,        // 총 주문완료 건수
        totalOrderCancelAmount : 50000,     // 총 주문취소 금액
        totalOrderCancelCount : 5,          // 총 주문취소 건수
        totalSalesAmountAvg : 4000,         // 총 순매출액 평균
        totalOrderCompleteAmountAvg : 1000, // 총 주문완료 금액 평균
        totalOrderCompleteCountAvg : 1000,  // 총 주문완료 건수 평균
        totalOrderCancelAmountAvg : 1000,   // 총 주문취소 금액 평균
        totalOrderCancelCountAvg : 1000     // 총 주문취소 건수 평균
      },{
        brandId : 2,
        brandName : "코코넛워터",                // 브랜드명
        totalSalesAmount : 3220,           // 총 순매출액
        totalOrderCompleteAmount : 10000,   // 총 주문완료 금액
        totalOrderCompleteCount : 5,        // 총 주문완료 건수
        totalOrderCancelAmount : 50000,     // 총 주문취소 금액
        totalOrderCancelCount : 5,          // 총 주문취소 건수
        totalSalesAmountAvg : 6000,         // 총 순매출액 평균
        totalOrderCompleteAmountAvg : 1000, // 총 주문완료 금액 평균
        totalOrderCompleteCountAvg : 1000,  // 총 주문완료 건수 평균
        totalOrderCancelAmountAvg : 1000,   // 총 주문취소 금액 평균
        totalOrderCancelCountAvg : 1000     // 총 주문취소 건수 평균
      },{
        brandId : 3,
        brandName : "미니몰",                // 브랜드명
        totalSalesAmount : 4220,           // 총 순매출액
        totalOrderCompleteAmount : 10000,   // 총 주문완료 금액
        totalOrderCompleteCount : 5,        // 총 주문완료 건수
        totalOrderCancelAmount : 50000,     // 총 주문취소 금액
        totalOrderCancelCount : 5,          // 총 주문취소 건수
        totalSalesAmountAvg : 2000,         // 총 순매출액 평균
        totalOrderCompleteAmountAvg : 1000, // 총 주문완료 금액 평균
        totalOrderCompleteCountAvg : 1000,  // 총 주문완료 건수 평균
        totalOrderCancelAmountAvg : 1000,   // 총 주문취소 금액 평균
        totalOrderCancelCountAvg : 1000     // 총 주문취소 건수 평균
      },{
        brandId : 4,
        brandName : "보라지유",                // 브랜드명
        totalSalesAmount : 5220,           // 총 순매출액
        totalOrderCompleteAmount : 10000,   // 총 주문완료 금액
        totalOrderCompleteCount : 5,        // 총 주문완료 건수
        totalOrderCancelAmount : 50000,     // 총 주문취소 금액
        totalOrderCancelCount : 5,          // 총 주문취소 건수
        totalSalesAmountAvg : 800,         // 총 순매출액 평균
        totalOrderCompleteAmountAvg : 1000, // 총 주문완료 금액 평균
        totalOrderCompleteCountAvg : 1000,  // 총 주문완료 건수 평균
        totalOrderCancelAmountAvg : 1000,   // 총 주문취소 금액 평균
        totalOrderCancelCountAvg : 1000     // 총 주문취소 건수 평균
      },{
        brandId : 5,
        brandName : "미즈노",                // 브랜드명
        totalSalesAmount : 4820,           // 총 순매출액
        totalOrderCompleteAmount : 10000,   // 총 주문완료 금액
        totalOrderCompleteCount : 5,        // 총 주문완료 건수
        totalOrderCancelAmount : 50000,     // 총 주문취소 금액
        totalOrderCancelCount : 5,          // 총 주문취소 건수
        totalSalesAmountAvg : 2550,         // 총 순매출액 평균
        totalOrderCompleteAmountAvg : 1000, // 총 주문완료 금액 평균
        totalOrderCompleteCountAvg : 1000,  // 총 주문완료 건수 평균
        totalOrderCancelAmountAvg : 1000,   // 총 주문취소 금액 평균
        totalOrderCancelCountAvg : 1000     // 총 주문취소 건수 평균
      },{
        brandId : 6,
        brandName : "비클2",                // 브랜드명
        totalSalesAmount : 2320,           // 총 순매출액
        totalOrderCompleteAmount : 10000,   // 총 주문완료 금액
        totalOrderCompleteCount : 5,        // 총 주문완료 건수
        totalOrderCancelAmount : 50000,     // 총 주문취소 금액
        totalOrderCancelCount : 5,          // 총 주문취소 건수
        totalSalesAmountAvg : 4050,         // 총 순매출액 평균
        totalOrderCompleteAmountAvg : 1000, // 총 주문완료 금액 평균
        totalOrderCompleteCountAvg : 1000,  // 총 주문완료 건수 평균
        totalOrderCancelAmountAvg : 1000,   // 총 주문취소 금액 평균
        totalOrderCancelCountAvg : 1000     // 총 주문취소 건수 평균
      },{
        brandId : 7,
        brandName : "코코넛워터2",                // 브랜드명
        totalSalesAmount : 3620,           // 총 순매출액
        totalOrderCompleteAmount : 10000,   // 총 주문완료 금액
        totalOrderCompleteCount : 5,        // 총 주문완료 건수
        totalOrderCancelAmount : 50000,     // 총 주문취소 금액
        totalOrderCancelCount : 5,          // 총 주문취소 건수
        totalSalesAmountAvg : 6500,         // 총 순매출액 평균
        totalOrderCompleteAmountAvg : 1000, // 총 주문완료 금액 평균
        totalOrderCompleteCountAvg : 1000,  // 총 주문완료 건수 평균
        totalOrderCancelAmountAvg : 1000,   // 총 주문취소 금액 평균
        totalOrderCancelCountAvg : 1000     // 총 주문취소 건수 평균
      },{
        brandId : 8,
        brandName : "미니몰2",                // 브랜드명
        totalSalesAmount : 4270,           // 총 순매출액
        totalOrderCompleteAmount : 10000,   // 총 주문완료 금액
        totalOrderCompleteCount : 5,        // 총 주문완료 건수
        totalOrderCancelAmount : 50000,     // 총 주문취소 금액
        totalOrderCancelCount : 5,          // 총 주문취소 건수
        totalSalesAmountAvg : 2500,         // 총 순매출액 평균
        totalOrderCompleteAmountAvg : 1000, // 총 주문완료 금액 평균
        totalOrderCompleteCountAvg : 1000,  // 총 주문완료 건수 평균
        totalOrderCancelAmountAvg : 1000,   // 총 주문취소 금액 평균
        totalOrderCancelCountAvg : 1000     // 총 주문취소 건수 평균
      },{
        brandId : 9,
        brandName : "보라지유2",                // 브랜드명
        totalSalesAmount : 5720,           // 총 순매출액
        totalOrderCompleteAmount : 10000,   // 총 주문완료 금액
        totalOrderCompleteCount : 5,        // 총 주문완료 건수
        totalOrderCancelAmount : 50000,     // 총 주문취소 금액
        totalOrderCancelCount : 5,          // 총 주문취소 건수
        totalSalesAmountAvg : 850,         // 총 순매출액 평균
        totalOrderCompleteAmountAvg : 1000, // 총 주문완료 금액 평균
        totalOrderCompleteCountAvg : 1000,  // 총 주문완료 건수 평균
        totalOrderCancelAmountAvg : 1000,   // 총 주문취소 금액 평균
        totalOrderCancelCountAvg : 1000     // 총 주문취소 건수 평균
      },{
        brandId : 10,
        brandName : "미즈노2",                // 브랜드명
        totalSalesAmount : 4820,           // 총 순매출액
        totalOrderCompleteAmount : 10000,   // 총 주문완료 금액
        totalOrderCompleteCount : 5,        // 총 주문완료 건수
        totalOrderCancelAmount : 50000,     // 총 주문취소 금액
        totalOrderCancelCount : 5,          // 총 주문취소 건수
        totalSalesAmountAvg : 2550,         // 총 순매출액 평균
        totalOrderCompleteAmountAvg : 1000, // 총 주문완료 금액 평균
        totalOrderCompleteCountAvg : 1000,  // 총 주문완료 건수 평균
        totalOrderCancelAmountAvg : 1000,   // 총 주문취소 금액 평균
        totalOrderCancelCountAvg : 1000     // 총 주문취소 건수 평균
      }
    ];
  }, []);

  return (
    <>
      <div className="brand-sales">
        <BrandSalesSearchBar
          onSearch={value => getBrandSales(value)}
          onReset={() => getBrandSales(defaultSearchCondition)}
        />
      </div>
      <div className="card-container">
        <Tabs type="card">
          <TabPane tab="전체 매출순" key="1" >
            <div  style={{width : '100%' ,overflowX : 'auto', overflowY : 'hidden' }}>
              <BrandSalesChart statistics={statistics} type={'total'}/>
            </div>
          </TabPane>
          <TabPane tab="평균 매출순" key="2">
            <div  style={{width : '100%' ,overflowX : 'auto', overflowY : 'hidden' }}>
              <BrandSalesChart statistics={statistics} type={'avg'}/>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default DailySales;
