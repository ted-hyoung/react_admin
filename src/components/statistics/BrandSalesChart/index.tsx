// base
import React, { useCallback, useEffect, useState, useMemo, Dispatch, SetStateAction } from 'react';
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
import { BrandSalesSearchBar } from 'components';

// utils
import { startDateFormat, endDateFormat } from 'lib/utils';

// types
import { ChartData, DataSets, ResponseManagementBrandStatistics, ResponseManagementOrdersDailySalesChart } from 'types';

// less
import './index.less';
import { clearBrandSalesStatus, getStatisticsBrandSalesAsync } from 'store/reducer/brand';
import Form from 'antd/lib/form';
import { BrandDataSets } from '../BrandSales';

interface Props {
  statistics?: ResponseManagementBrandStatistics[];
  type?:string;
}

const BrandSalesChart = (props: Props) => {

  // TODO API 호출영역
  const { statistics, type } = props;
  const dispatch = useDispatch();

  const [charData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (statistics) {
      // brandData.sort((a, b) => (a.totalSalesAmountAvg < b.totalSalesAmountAvg) ? 1 : -1);

      if(type === 'avg'){
        statistics.sort((a, b) => b.totalSalesAmountAvg - a.totalSalesAmountAvg);
      }else{
        statistics.sort((a, b) => b.totalSalesAmount - a.totalSalesAmount);
      }

      const labels = statistics.map(item => item.brandName);
      const totalSalesAmountData = statistics.map(item => item.totalSalesAmount);
      const totalSalesAmountAvgData = statistics.map(item => item.totalSalesAmountAvg);
      const datasets: BrandDataSets[] = [];

      datasets.push(
        // {
        //   label: '공구 평균',
        //   backgroundColor: 'rgba(255,255,255,0)',
        //   stack: 'Stack',
        //   data: totalSalesAmountAvgData,
        //   type: 'line',
        //   borderColor: '#ffce56',
        //   hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        //   hoverBorderColor: 'rgba(255,99,132,1)',
        // },
        {
          label: '공구 전체',
          backgroundColor: '#36a2eb',
          stack: 'Stack 1',
          data:  totalSalesAmountData
        },{
          label: '공구 평균',
          backgroundColor: '#ff6384',
          stack: 'Stack 2',
          data: totalSalesAmountAvgData
        }

      );
      setChartData({
        labels,
        datasets,
      });
      dispatch(clearBrandSalesStatus);
    }
  }, [statistics, type]);

  const getDatasetKeyProvider = () => {
    return 'datasetKey';
  };

  return (
    <>
      {/*브랜드 8개 기본, 9개부터 +100px*/}
      <div style={{width : '1620px', height : '500px' ,overflowX : 'auto', overflowY : 'hidden' }}>
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
    </>
  );
};

export default BrandSalesChart;
