// base
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// modules
import { Bar } from 'react-chartjs-2';

// store

// components

// utils

// types
import { ChartData2, DataSets, ProductOptions, ResponseManagementProductStatistics } from 'types';

// less
import './index.less';

interface Props {
  statistics: ResponseManagementProductStatistics[];
  type?:string;
  chartData: ChartData2,
  // setChartData: Dispatch<SetStateAction<ChartData>>;
}

const ProductSalesChart = (props: Props) => {

  // TODO API 호출영역
  const { statistics, type, chartData } = props;

  const getDatasetKeyProvider = () => {
    return 'datasetKey';
  };

  return (
    <div
      style={{
        "width" : statistics.length < 11 ?  '100%' : statistics.length * 120 + 'px',
        "height" : "450px",
        "overflowX" : "auto",
        "overflowY" : "hidden",
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
            display: false,
          },
          scales: {
            xAxes: [{
              barPercentage: 0.7,
              stacked: true,
            }],
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
                stacked: true,
              },
            ],
          },
          tooltips: {
            enabled: true,
            titleFontSize: 15,
            intersect: false,
            callbacks: {
              title: (tooltipItem: any) => {
                const statisticsProductSalesRow: ResponseManagementProductStatistics = statistics[tooltipItem[0].index];
                if(statisticsProductSalesRow.options.length > 0){
                  return (
                      statisticsProductSalesRow.options[tooltipItem[0].datasetIndex].optionName+' 순매출액 : ' +
                      (
                        statisticsProductSalesRow.options[tooltipItem[0].datasetIndex].totalSalesAmount
                      ).toLocaleString() +
                      '원'
                    );
                  }else{
                    return (
                      statisticsProductSalesRow.productName+' 총 매출액 : ' +
                      (
                        statisticsProductSalesRow.totalSalesAmount
                      ).toLocaleString() +
                      '원'
                    );
                  }

              },
              label: (tooltipItem: any) => {
                const statisticsProductSalesRow: ResponseManagementProductStatistics = statistics[tooltipItem.index];
                if(statisticsProductSalesRow.options.length > 0){
                  return (
                    ' - 매출액: ' +
                    statisticsProductSalesRow.options[tooltipItem.datasetIndex].totalSalesAmount +
                    '원 '+
                    '\n - 판매비중: ' +
                    statisticsProductSalesRow.options[tooltipItem.datasetIndex].salesRatio +
                    '% ' +
                    '\n - 제품가격: ' +
                    statisticsProductSalesRow.options[tooltipItem.datasetIndex].salesPrice +
                    '원 ' +
                    '\n - 판매수량: ' +
                    statisticsProductSalesRow.options[tooltipItem.datasetIndex].totalSalesQuantity +
                    '개 '
                  ).split('\n');
                }else{
                  return (
                    ' - 제품가격: ' +
                    statisticsProductSalesRow.discountSalesPrice +
                    '원' +
                    '\n - 판매수량: ' +
                    statisticsProductSalesRow.totalSalesQuantity +
                    '개'
                  ).split('\n');
                }
                // console.log(tooltipItem);
                // console.log(statisticsProductSalesRow);
                //
                // console.log(statisticsProductSalesRow.options[tooltipItem.datasetIndex]);


              },
            },
          },
        }}
      />
    </div>
  );
};

export default ProductSalesChart;