// base
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from 'store';
import { clearBrandSalesStatus, getStatisticsBrandSalesAsync } from 'store/reducer/brand';

// modules
import { Tabs } from 'antd';

// containers
import { BrandSalesSearchBar, BrandSalesChart } from 'containers';

// models
import { ChartData, ResponseManagementBrandStatistics } from 'models';

import './index.less';

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

const BrandSales = () => {
  const { TabPane } = Tabs;
  const dispatch = useDispatch();
  const setReset = () => {
    setTotalChartData({
      labels: [],
      datasets: [],
    });
    setAvgChartData({
      labels: [],
      datasets: [],
    });
  };

  const getBrandSales = useCallback(
    (searchCondition?: any) => {
      dispatch(
        getStatisticsBrandSalesAsync.request({
          searchCondition,
        }),
      );
      setTotalChartData({
        labels: [],
        datasets: [],
      });
      setAvgChartData({
        labels: [],
        datasets: [],
      });
    },
    [dispatch],
  );

  const [totalChartData, setTotalChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [avgChartData, setAvgChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  const { statistics } = useSelector((state: StoreState) => state.brand);
  const chartAvg: ResponseManagementBrandStatistics[] = [];
  const chartTotal: ResponseManagementBrandStatistics[] = [];
  chartAvg.push(...statistics);
  chartTotal.push(...statistics);

  useEffect(() => {
    if (statistics) {
      chartAvg.sort((a, b) => b.totalSalesAmountAvg - a.totalSalesAmountAvg);
      const labelsAvg = chartAvg.map(item => item.brandName);
      const totalSalesAmountDataAvg = chartAvg.map(item => item.totalSalesAmount);
      const totalSalesAmountAvgDataAvg = chartAvg.map(item => item.totalSalesAmountAvg);
      const datasetsAvg: BrandDataSets[] = [];
      datasetsAvg.push(
        {
          label: '공구 전체',
          backgroundColor: '#36a2eb',
          stack: 'Stack 1',
          data: totalSalesAmountDataAvg,
          hoverBackgroundColor: '#0072ff',
          hoverBorderColor: '#0072ff',
        },
        {
          label: '공구 평균',
          backgroundColor: '#ff6384',
          stack: 'Stack 2',
          data: totalSalesAmountAvgDataAvg,
          hoverBackgroundColor: '#ff0033',
          hoverBorderColor: '#ff0033',
        },
      );
      setAvgChartData({
        labels: labelsAvg,
        datasets: datasetsAvg,
      });

      chartTotal.sort((a, b) => b.totalSalesAmount - a.totalSalesAmount);
      const labelsTotal = chartTotal.map(item => item.brandName);
      const totalSalesAmountDataTotal = chartTotal.map(item => item.totalSalesAmount);
      const totalSalesAmountAvgDataTotal = chartTotal.map(item => item.totalSalesAmountAvg);
      const datasetsTotal: BrandDataSets[] = [];

      datasetsTotal.push(
        {
          label: '공구 전체',
          backgroundColor: '#36a2eb',
          stack: 'Stack 1',
          data: totalSalesAmountDataTotal,
          hoverBackgroundColor: '#0072ff',
          hoverBorderColor: '#0072ff',
        },
        {
          label: '공구 평균',
          backgroundColor: '#ff6384',
          stack: 'Stack 2',
          data: totalSalesAmountAvgDataTotal,
          hoverBackgroundColor: '#ff0033',
          hoverBorderColor: '#ff0033',
        },
      );
      setTotalChartData({
        labels: labelsTotal,
        datasets: datasetsTotal,
      });
      dispatch(clearBrandSalesStatus);
    }
  }, [statistics]);

  return (
    <>
      <div className="brand-sales">
        <BrandSalesSearchBar onSearch={value => getBrandSales(value)} onReset={() => setReset()} />
      </div>
      {statistics.length > 0 && (
        <div className="card-container">
          <Tabs type="card">
            <TabPane tab="전체 매출순" key="total">
              <div style={{ width: '100%', overflowX: 'auto', overflowY: 'hidden' }}>
                <BrandSalesChart statisticsData={chartTotal} type={'total'} chartData={totalChartData} />
              </div>
            </TabPane>
            <TabPane tab="평균 매출순" key="avg">
              <div style={{ width: '100%', overflowX: 'auto', overflowY: 'hidden' }}>
                <BrandSalesChart statisticsData={chartAvg} type={'avg'} chartData={avgChartData} />
              </div>
            </TabPane>
          </Tabs>
        </div>
      )}
    </>
  );
};

export default BrandSales;
