// base
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// modules
import { Button, Table, Tooltip, Icon } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import { Bar } from 'react-chartjs-2';

// store
import { StoreState } from 'store';
import { getStatisticsDailySalesAsync, clearDailySalesStatus } from 'store/reducer/order';

// components
import { BrandSalesSearchBar } from 'components';

// utils
import { defaultDateTimeFormat } from 'lib/utils';

// types
import { ResponseManagementOrdersDailySalesChart, ChartData, DataSets } from 'types';

// less
import './index.less';
import { getStatisticsBrancSalesAsync } from 'store/reducer/brand';

const defaultSearchCondition = {
  startDate: moment(new Date()).format(defaultDateTimeFormat),
  endDate: moment(new Date()).format(defaultDateTimeFormat),
};

interface ResponseManagementBrandStatistics {

  brandName : string;
  totalSalesAmount : number;
  totalOrderCompleteAmount : number;
  totalOrderCompleteCount : number;
  totalOrderCancelAmount : number;
  totalOrderCancelCount : number;
  totalSalesAmountAvg : number;
  totalOrderCompleteAmountAvg : number;
  totalOrderCompleteCountAvg : number;
  totalOrderCancelAmountAvg : number;
  totalOrderCancelCountAvg : number;
}

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
  const [charData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  // TODO API 호출영역
   const dispatch = useDispatch();

  const getBrandSales = useCallback(
    (searchCondition?: any) => {
      dispatch(
        getStatisticsBrancSalesAsync.request({
          searchCondition,
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    getBrandSales(defaultSearchCondition);
  }, [getBrandSales]);
  //
  // const { statistics } = useSelector((storeState: StoreState) => storeState.order);
  const brandData = useMemo(() => {
    return [
      {
        brandName : "비클",
        totalSalesAmount : 20000,
        totalOrderCompleteAmount : 10000,
        totalOrderCompleteCount : 5,
        totalOrderCancelAmount : 50000,
        totalOrderCancelCount : 5,
        totalSalesAmountAvg : 1000,
        totalOrderCompleteAmountAvg : 1000,
        totalOrderCompleteCountAvg : 1000,
        totalOrderCancelAmountAvg : 1000,
        totalOrderCancelCountAvg : 1000
      },
      {
        brandName : "보라지유",
        totalSalesAmount : 11000,
        totalOrderCompleteAmount : 10000,
        totalOrderCompleteCount : 5,
        totalOrderCancelAmount : 50000,
        totalOrderCancelCount : 5,
        totalSalesAmountAvg : 2000,
        totalOrderCompleteAmountAvg : 1000,
        totalOrderCompleteCountAvg : 1000,
        totalOrderCancelAmountAvg : 1000,
        totalOrderCancelCountAvg : 1000
      },
      {
        brandName : "화이트 세럼",
        totalSalesAmount : 30000,
        totalOrderCompleteAmount : 10000,
        totalOrderCompleteCount : 5,
        totalOrderCancelAmount : 50000,
        totalOrderCancelCount : 5,
        totalSalesAmountAvg : 3000,
        totalOrderCompleteAmountAvg : 1000,
        totalOrderCompleteCountAvg : 1000,
        totalOrderCancelAmountAvg : 1000,
        totalOrderCancelCountAvg : 1000
      },{
        brandName : "코코넛워터",                // 브랜드명
        totalSalesAmount : 22200,           // 총 순매출액
        totalOrderCompleteAmount : 10000,   // 총 주문완료 금액
        totalOrderCompleteCount : 5,        // 총 주문완료 건수
        totalOrderCancelAmount : 50000,     // 총 주문취소 금액
        totalOrderCancelCount : 5,          // 총 주문취소 건수
        totalSalesAmountAvg : 4000,         // 총 순매출액 평균
        totalOrderCompleteAmountAvg : 1000, // 총 주문완료 금액 평균
        totalOrderCompleteCountAvg : 1000,  // 총 주문완료 건수 평균
        totalOrderCancelAmountAvg : 1000,   // 총 주문취소 금액 평균
        totalOrderCancelCountAvg : 1000     // 총 주문취소 건수 평균
      }
    ];
  }, []);

  useEffect(() => {
    if (brandData) {
      const labels = brandData.map(item => item.brandName);
      const totalSalesAmountData = brandData.map(item => item.totalSalesAmount);
      const totalSalesAmountAvgData = brandData.map(item => item.totalSalesAmountAvg);
      const datasets: BrandDataSets[] = [];

      datasets.push(
        {
          label: '공구 전체',
          backgroundColor: '#36a2eb',
          stack: 'Stack 1',
          data: totalSalesAmountData
        },{
          label: '공구 평균',
          backgroundColor: '#ff6384',
          stack: 'Stack 2',
          data: totalSalesAmountAvgData
        }
      );
      setChartData({
        ...charData,
        labels,
        datasets,
      });
      dispatch(clearDailySalesStatus);
    }
  }, [brandData]);

  const getDatasetKeyProvider = () => {
    return 'datasetKey';
  };

  return (
    <>
      <div className="brand-sales">
        <BrandSalesSearchBar
          onSearch={value => getBrandSales(value)}
          onReset={() => getBrandSales(defaultSearchCondition)}
        />
      </div>
      <div  style={{width : '100%' ,overflowX : 'auto', overflowY : 'hidden' }}>
        {/*브랜드 8개 기본, 9개부터 +100px*/}
        <div style={{width : '1650px', height : '600px' ,overflowX : 'auto', overflowY : 'hidden' }}>
          <Bar
            datasetKeyProvider={getDatasetKeyProvider}
            data={charData}
            height={500}
            options={{
              maintainAspectRatio: false,
              responsive: true,
              legend: {
                display: true,
              },
              scales: {
                xAxes: [{
                  barPercentage: 1.0
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
                  },
                ],
              },
              // tooltips: {
              //   enabled: true,
              //   callbacks: {
              //     title: (tooltipItem: any) => {
              //       const statisticsDailySalesRow: ResponseManagementOrdersDailySalesChart =
              //         statistics.dailySales.ordersCharts[tooltipItem[0].index];
              //       return (
              //         '순매출액 : ' +
              //         (
              //           statisticsDailySalesRow.totalOrderCompleteAmount - statisticsDailySalesRow.totalOrderCancelAmount
              //         ).toLocaleString() +
              //         '원'
              //       );
              //     },
              //     label: (tooltipItem: any) => {
              //       const statisticsDailySalesRow: ResponseManagementOrdersDailySalesChart =
              //         statistics.dailySales.ordersCharts[tooltipItem.index];
              //       const text: string =
              //         ' - 결제일시: ' +
              //         statisticsDailySalesRow.paymentDate +
              //         '\n - 결제완료: ' +
              //         statisticsDailySalesRow.totalOrderCompleteCount.toLocaleString() +
              //         '건(총 ' +
              //         statisticsDailySalesRow.totalOrderCompleteAmount.toLocaleString() +
              //         '원)' +
              //         '\n - 주문취소: ' +
              //         statisticsDailySalesRow.totalOrderCancelCount.toLocaleString() +
              //         '건(총 ' +
              //         statisticsDailySalesRow.totalOrderCancelAmount.toLocaleString() +
              //         '원)';
              //       return text.split('\n');
              //     },
              //   },
              // },
            }}
          />
        </div>
      </div>
      {/*<div style={{ overflowX: 'auto', marginTop: 50 }}>*/}

      {/*</div>*/}
    </>
  );
};

export default DailySales;
