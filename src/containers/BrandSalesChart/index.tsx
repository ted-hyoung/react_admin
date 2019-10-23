// base
import React from 'react';

// modules
import { Bar } from 'react-chartjs-2';

// store

// components

// utils

// types
import { ChartData, ResponseManagementBrandStatistics } from 'models';

import './index.less';

interface Props {
  statisticsData: ResponseManagementBrandStatistics[];
  type?: string;
  chartData: ChartData;
}

const BrandSalesChart = (props: Props) => {
  // TODO API 호출영역
  const { statisticsData, type, chartData } = props;

  const getDatasetKeyProvider = () => {
    return 'datasetKey';
  };

  if (type === 'total') {
    statisticsData.sort((a, b) => b.totalSalesAmount - a.totalSalesAmount);
  } else {
    statisticsData.sort((a, b) => b.totalSalesAmountAvg - a.totalSalesAmountAvg);
  }

  return (
    <div
      style={{
        width: statisticsData.length < 11 ? '100%' : statisticsData.length * 120 + 'px',
        height: '450px',
        overflowX: 'auto',
        overflowY: 'hidden',
      }}
    >
      <Bar
        datasetKeyProvider={getDatasetKeyProvider}
        data={chartData}
        height={500}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          legend: {
            display: true,
          },
          scales: {
            xAxes: [
              {
                barPercentage: 0.7,
              },
            ],
            yAxes: [
              {
                barPercentage: 1.0,
                ticks: {
                  min: 0,
                  fontSize: 10,
                  fontStyle: 'bold',
                  paddingTop: 10,
                  paddingBottom: 10,
                },
              },
            ],
          },
          tooltips: {
            enabled: true,
            titleFontSize: 15,
            callbacks: {
              title: (tooltipItem: any) => {
                const statisticsBrandSalesRow: ResponseManagementBrandStatistics = statisticsData[tooltipItem[0].index];
                if (tooltipItem[0].datasetIndex === 0) {
                  return (
                    statisticsBrandSalesRow.brandName +
                    ' 순매출액 : ' +
                    statisticsBrandSalesRow.totalSalesAmount.toLocaleString() +
                    '원'
                  );
                }
                if (tooltipItem[0].datasetIndex === 1) {
                  return (
                    statisticsBrandSalesRow.brandName +
                    ' 평균매출액 : ' +
                    statisticsBrandSalesRow.totalSalesAmountAvg.toLocaleString() +
                    '원'
                  );
                }
              },
              label: (tooltipItem: any) => {
                const statisticsBrandSalesRows: ResponseManagementBrandStatistics = statisticsData[tooltipItem.index];
                if (tooltipItem.datasetIndex === 0) {
                  return (
                    ' - 브랜드: ' +
                    statisticsBrandSalesRows.brandName +
                    '\n - 결제완료: ' +
                    statisticsBrandSalesRows.totalOrderCompleteCount.toLocaleString() +
                    '건(총 ' +
                    statisticsBrandSalesRows.totalOrderCompleteAmount.toLocaleString() +
                    '원)' +
                    '\n - 주문취소: ' +
                    statisticsBrandSalesRows.totalOrderCancelCount.toLocaleString() +
                    '건(총 ' +
                    statisticsBrandSalesRows.totalOrderCancelAmount.toLocaleString() +
                    '원)'
                  ).split('\n');
                }
                if (tooltipItem.datasetIndex === 1) {
                  return (
                    ' - 브랜드: ' +
                    statisticsBrandSalesRows.brandName +
                    '\n - 결제완료: ' +
                    statisticsBrandSalesRows.totalOrderCompleteCountAvg.toLocaleString() +
                    '건(총 ' +
                    statisticsBrandSalesRows.totalOrderCompleteAmountAvg.toLocaleString() +
                    '원)' +
                    '\n - 주문취소: ' +
                    statisticsBrandSalesRows.totalOrderCancelCountAvg.toLocaleString() +
                    '건(총 ' +
                    statisticsBrandSalesRows.totalOrderCancelAmountAvg.toLocaleString() +
                    '원)'
                  ).split('\n');
                }
              },
            },
          },
        }}
      />
    </div>
  );
};

export default BrandSalesChart;
