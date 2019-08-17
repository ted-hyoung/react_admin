// base
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// modules
import { Button, Table, Tooltip, Icon } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import { Bar } from 'react-chartjs-2';
import * as XLSX from 'xlsx';

// store
import { StoreState } from 'store';
import { getStatisticsDailySalesAsync, clearDailySalesStatus } from 'store/reducer/order';

// components
import { DailySalesSearchBar } from 'components';

// utils
import { defaultDateTimeFormat, getNowYMD } from 'lib/utils';

// types
import { ResponseManagementOrdersDailySalesChart, ChartData, DataSets } from 'types';

// less
import './index.less';

const defaultSearchCondition = {
  startDate: moment(new Date()).format(defaultDateTimeFormat),
  endDate: moment(new Date()).format(defaultDateTimeFormat),
};

interface ResponseManagementOrdersStatistics {
  totalSalesAmount: number;
  totalSalesCount: number;
  totalOrderCompleteAmount: number;
  totalOrderCompleteCount: number;
  totalOrderCancelAmount: number;
  totalOrderCancelCount: number;
}

interface ResponseManagementOrdersExcels {
  paymentDate: string;
  totalOrderCompleteAmount: number;
  totalOrderCompleteCount: number;
  totalOrderCancelAmount: number;
  totalOrderCancelCount: number;
}

const DailySales = () => {
  const { statistics } = useSelector((storeState: StoreState) => storeState.order);
  const dispatch = useDispatch();
  const [charData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  const getDailySales = useCallback(
    (searchCondition?: any) => {
      dispatch(
        getStatisticsDailySalesAsync.request({
          searchCondition,
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    getDailySales(defaultSearchCondition);
  }, [getDailySales]);

  useEffect(() => {
    if (statistics.dailySalesStatus) {
      const labels = statistics.dailySales.ordersCharts.map(item => item.paymentDate);
      const amountData = statistics.dailySales.ordersCharts.map(
        item => item.totalOrderCompleteAmount - item.totalOrderCancelAmount,
      );
      if (statistics.dailySales.ordersCharts.length < 10) {
        for (let i = 0; i < 10; i++) {
          labels.push('');
        }
      }

      const datasets: DataSets[] = [];
      datasets.push(
        {
          backgroundColor: 'rgba(255,99,132,0.2)',
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          hoverBorderColor: 'rgba(255,99,132,1)',
          data: amountData,
        },
        {
          backgroundColor: 'rgba(255,255,255,0)',
          borderColor: 'rgba(255,99,132,1)',
          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          hoverBorderColor: 'rgba(255,99,132,1)',
          type: 'line',
          data: amountData,
        },
      );
      setChartData({
        ...charData,
        labels,
        datasets,
      });
      dispatch(clearDailySalesStatus);
    }
  }, [statistics.dailySalesStatus]);

  const handleExcelDownLoad = () => {
    const anaToSheet: any[] = [
      ['날짜', '결제 완료 주문', null, null, null, '환불 주문', null, '순매출액'],
      [null, '주문 수', '실 결제액', '포인트 결제', '총 매출', '주문 취소수', '주문 취소액', null],
    ];

    statistics.dailySales.orders.map((item: ResponseManagementOrdersExcels) => {
      return anaToSheet.push([
        item.paymentDate,
        item.totalOrderCompleteCount === 0 ? '-' : item.totalOrderCompleteCount.toLocaleString() + '건',
        item.totalOrderCompleteAmount === 0 ? '-' : item.totalOrderCompleteAmount.toLocaleString() + '원',
        '-',
        item.totalOrderCompleteAmount === 0 ? '-' : item.totalOrderCompleteAmount.toLocaleString() + '원',
        item.totalOrderCancelCount === 0 ? '-' : item.totalOrderCancelCount.toLocaleString() + '건',
        item.totalOrderCancelAmount === 0 ? '-' : item.totalOrderCancelAmount.toLocaleString() + '원',
        item.totalOrderCompleteAmount - item.totalOrderCancelAmount === 0
          ? '-'
          : (item.totalOrderCompleteAmount - item.totalOrderCancelAmount).toLocaleString() + '원',
      ]);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(anaToSheet);
    if (!ws['!merges']) ws['!merges'] = [];
    ws['!cols'] = [{ wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }];
    ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 1, c: 0 } });
    ws['!merges'].push({ s: { r: 0, c: 1 }, e: { r: 0, c: 4 } });
    ws['!merges'].push({ s: { r: 0, c: 5 }, e: { r: 0, c: 6 } });
    ws['!merges'].push({ s: { r: 0, c: 7 }, e: { r: 1, c: 7 } });

    XLSX.utils.book_append_sheet(wb, ws, 'satatistics_daily_sales');
    XLSX.writeFile(wb, 'fromc_' + getNowYMD() + '.xlsx');
  };

  const totalAmountColumns: Array<ColumnProps<ResponseManagementOrdersStatistics>> = [
    {
      title: () => {
        return (
          <Tooltip
            title={
              <>
                <span>총 순매출</span>
                <br />
                <br />
                <span>선택한 기간 동안의 총 순매출액의 합계</span>
                <br />
                <span>* 순매출=총 주문완료 금액-주문취소 금액</span>
              </>
            }
          >
            총 순매출 <Icon type="exclamation-circle" />
          </Tooltip>
        );
      },
      key: 'totalSales',
      align: 'center',
      render: (text: string, record: any, index: number) => {
        return (
          <div key={index}>
            {record.totalSalesAmount.toLocaleString() + '원'} <br />{' '}
            {'(' + record.totalSalesCount.toLocaleString() + '건)'}
          </div>
        );
      },
    },
    {
      title: () => {
        return (
          <Tooltip
            title={
              <>
                <span>총 주문완료</span>
                <br />
                <br />
                <span>선택한 기간 동안의 총 주문액의 합계</span>
              </>
            }
          >
            총 주문완료 <Icon type="exclamation-circle" />
          </Tooltip>
        );
      },
      key: 'totalOrderComplete',
      align: 'center',
      render: (text: string, record: any, index: number) => {
        return (
          <div key={index}>
            {record.totalOrderCompleteAmount.toLocaleString() + '원'} <br />{' '}
            {'(' + record.totalOrderCompleteCount.toLocaleString() + '건)'}
          </div>
        );
      },
    },
    {
      title: () => {
        return (
          <Tooltip
            title={
              <>
                <span>총 주문취소</span>
                <br />
                <br />
                <span>주문완료 중 주문취소/환불/반품 처리된 주문의 수 및 금액</span>
              </>
            }
          >
            총 주문취소 <Icon type="exclamation-circle" />
          </Tooltip>
        );
      },
      key: 'totalOrderCancel',
      align: 'center',
      render: (text: string, record: any, index: number) => {
        return (
          <div key={index}>
            {record.totalOrderCancelAmount.toLocaleString() + '원'} <br />{' '}
            {'(' + record.totalOrderCancelCount.toLocaleString() + '건)'}
          </div>
        );
      },
    },
  ];

  const excelColumns: Array<ColumnProps<ResponseManagementOrdersExcels>> = [
    {
      title: '날짜',
      key: 'paymentDate',
      align: 'center',
      render: (text: string, record: ResponseManagementOrdersExcels, index: number) => {
        return <div key={index}>{record.paymentDate}</div>;
      },
    },
    {
      title: '결제 완료 주문',
      align: 'center',
      children: [
        {
          title: '주문 수',
          key: 'totalOrderCompleteCount',
          align: 'center',
          render: (text: string, record: ResponseManagementOrdersExcels, index: number) => {
            return (
              <div key={index}>
                {record.totalOrderCompleteCount === 0 ? '-' : record.totalOrderCompleteCount.toLocaleString() + '건'}
              </div>
            );
          },
        },
        {
          title: '실 결제액',
          key: 'totalOrderCompleteAmount',
          align: 'center',
          render: (text: string, record: ResponseManagementOrdersExcels, index: number) => {
            return (
              <div key={index}>
                {record.totalOrderCompleteAmount === 0 ? '-' : record.totalOrderCompleteAmount.toLocaleString() + '원'}
              </div>
            );
          },
        },
        {
          title: '포인트 결제',
          key: 'totalOrderPointAmount',
          align: 'center',
          render: (text: string, record: ResponseManagementOrdersExcels, index: number) => {
            return <div key={index}>-</div>;
          },
        },
        {
          title: '총 매출',
          key: 'totalOrderAmount',
          align: 'center',
          render: (text: string, record: ResponseManagementOrdersExcels, index: number) => {
            return (
              <div key={index}>
                {record.totalOrderCompleteAmount === 0 ? '-' : record.totalOrderCompleteAmount.toLocaleString() + '원'}
              </div>
            );
          },
        },
      ],
    },
    {
      title: '환불 주문',
      align: 'center',
      children: [
        {
          title: '주문 취소 수',
          key: 'totalOrderCancelCount',
          align: 'center',
          render: (text: string, record: ResponseManagementOrdersExcels, index: number) => {
            return (
              <div key={index}>
                {record.totalOrderCancelCount === 0 ? '-' : record.totalOrderCancelCount.toLocaleString() + '건'}
              </div>
            );
          },
        },
        {
          title: '주문 취소액',
          key: 'totalOrderCancelAmount',
          align: 'center',
          render: (text: string, record: ResponseManagementOrdersExcels, index: number) => {
            return (
              <div key={index}>
                {record.totalOrderCancelAmount === 0 ? '-' : record.totalOrderCancelAmount.toLocaleString() + '원'}
              </div>
            );
          },
        },
      ],
    },
    {
      title: '순매출액',
      key: 'totalOrderSalesAmount',
      align: 'center',
      render: (text: string, record: ResponseManagementOrdersExcels, index: number) => {
        return (
          <div key={index}>
            {record.totalOrderCompleteAmount - record.totalOrderCancelAmount === 0
              ? '-'
              : (record.totalOrderCompleteAmount - record.totalOrderCancelAmount).toLocaleString() + '원'}
          </div>
        );
      },
    },
  ];

  return (
    <div className="daily-sales" style={{ width: '300vh' }}>
      <DailySalesSearchBar
        onSearch={value => getDailySales(value)}
        onReset={() => getDailySales(defaultSearchCondition)}
      />
      <div style={{ width: 500, float: 'left', marginTop: 20 }}>
        <Table
          columns={totalAmountColumns}
          bordered
          rowKey={(recode, index) => index.toString()}
          pagination={false}
          dataSource={statistics.dailySales.ordersTable}
          size="middle"
        />
      </div>
      <div style={{ overflowX: 'auto', marginTop: 170 }}>
        <Bar
          data={charData}
          height={500}
          redraw={true}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            legend: {
              display: false,
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    min: 0,
                  },
                },
              ],
              xAxes: [
                {
                  barPercentage: 1.0,
                  ticks: {
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
              callbacks: {
                title: (tooltipItem: any) => {
                  const statisticsDailySalesRow: ResponseManagementOrdersDailySalesChart =
                    statistics.dailySales.ordersCharts[tooltipItem[0].index];
                  return (
                    '순매출액 : ' +
                    (
                      statisticsDailySalesRow.totalOrderCompleteAmount - statisticsDailySalesRow.totalOrderCancelAmount
                    ).toLocaleString() +
                    '원'
                  );
                },
                label: (tooltipItem: any) => {
                  const statisticsDailySalesRow: ResponseManagementOrdersDailySalesChart =
                    statistics.dailySales.ordersCharts[tooltipItem.index];
                  const text: string =
                    ' - 결제일시: ' +
                    statisticsDailySalesRow.paymentDate +
                    '\n - 결제완료: ' +
                    statisticsDailySalesRow.totalOrderCompleteCount.toLocaleString() +
                    '건(총 ' +
                    statisticsDailySalesRow.totalOrderCompleteAmount.toLocaleString() +
                    '원)' +
                    '\n - 주문취소: ' +
                    statisticsDailySalesRow.totalOrderCancelCount.toLocaleString() +
                    '건(총 ' +
                    statisticsDailySalesRow.totalOrderCancelAmount.toLocaleString() +
                    '원)';
                  return text.split('\n');
                },
              },
            },
          }}
        />
      </div>
      <div style={{ width: 1100, marginTop: 20, textAlign: 'right' }}>
        <Button type="primary" icon="download" onClick={handleExcelDownLoad}>
          엑셀 다운로드
        </Button>
      </div>
      <div style={{ width: 1100, marginTop: 20, marginBottom: 20 }}>
        <Table
          columns={excelColumns}
          dataSource={statistics.dailySales.orders}
          bordered
          rowKey={record => record.paymentDate}
          pagination={false}
          size="middle"
        />
      </div>
    </div>
  );
};

export default DailySales;
