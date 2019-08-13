// base
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// modules
import { Button, Form, Table, Tooltip, Icon, message } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { FormComponentProps } from 'antd/lib/form';
import moment from 'moment';
import { Bar } from 'react-chartjs-2';

// store
import { StoreState } from 'store'
import { getStatisticsDailySalesAsync, clearDailySalesStatus } from 'store/reducer/order';

// components
import { DailySalesSearchBar } from 'components';

// utils
import { defaultDateTimeFormat } from 'lib/utils';

// less
import './index.less';
import { ResponseManagementOrdersDailySalesChart } from '../../../types';

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
  // const chartData = {
  //   labels: [],
  //   datasets: [
  //     {
  //       backgroundColor: 'rgba(255,99,132,0.2)',
  //       borderColor: 'rgba(255,99,132,1)',
  //       borderWidth: 1,
  //       hoverBackgroundColor: 'rgba(255,99,132,0.4)',
  //       hoverBorderColor: 'rgba(255,99,132,1)',
  //       data: [],
  //     },
  //     {
  //       backgroundColor: 'rgba(255,255,255,0)',
  //       borderColor: 'rgba(255,99,132,1)',
  //       hoverBackgroundColor: 'rgba(255,99,132,0.4)',
  //       hoverBorderColor: 'rgba(255,99,132,1)',
  //       type: 'line',
  //       data: [],
  //     },
  //   ],
  // };

  const getDailySales = useCallback((searchCondition?: any) => {
    dispatch(getStatisticsDailySalesAsync.request({
      searchCondition
    }));
  }, [dispatch]);

  useEffect(() => {
    getDailySales(defaultSearchCondition);
  }, [getDailySales]);

  useEffect(() => {
    if (statistics.dailySalesStatus) {
      dispatch(clearDailySalesStatus)
    }
  }, [statistics.dailySalesStatus]);

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
            {record.totalSalesAmount.toLocaleString() + '원'} <br /> {'(' + record.totalSalesCount.toLocaleString() + '건)'}
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
            {record.totalOrderCancelAmount.toLocaleString() + '원'} <br /> {'(' + record.totalOrderCancelCount.toLocaleString() + '건)'}
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
      render: (text:string, record: ResponseManagementOrdersExcels, index:number) => {
        return (
          <div key={index}>{record.paymentDate}</div>
        )
      }
    },
    {
      title: '결제 완료 주문',
      align: 'center',
      children: [
        {
          title: '주문 수',
          key: 'totalOrderCompleteCount',
          align: 'center',
          render: (text:string, record: ResponseManagementOrdersExcels, index:number) => {
            return (
              <div key={index}>{record.totalOrderCompleteCount.toLocaleString() + '건'}</div>
            )
          }
        },
        {
          title: '실 결제액',
          key: 'totalOrderCompleteAmount',
          align: 'center',
          render: (text:string, record: ResponseManagementOrdersExcels, index:number) => {
            return (
              <div key={index}>{record.totalOrderCompleteAmount.toLocaleString() + '원'}</div>
            )
          }
        },
        {
          title: '포인트 결제',
          align: 'center',
          render: (text: string, record: ResponseManagementOrdersExcels, index:number) => {
            return <div key={index}>0원</div>
          }
        },
        {
          title: '총 매출',
          align: 'center',
          render: (text:string, record: ResponseManagementOrdersExcels, index:number) => {
            return (
              <div key={index}>{record.totalOrderCompleteAmount.toLocaleString() + '원'}</div>
            )
          }
        },
      ],
    },
    {
      title: '환불 주문',
      align: 'center',
      children: [
        {
          title: '주문 취소수',
          key: 'totalOrderCancelCount',
          align: 'center',
          render: (text:string, record: ResponseManagementOrdersExcels, index:number) => {
            return (
              <div key={index}>{record.totalOrderCancelCount.toLocaleString() + '건'}</div>
            )
          }
        },
        {
          title: '주문 취소액',
          key: 'totalOrderCancelAmount',
          align: 'center',
          render: (text:string, record: ResponseManagementOrdersExcels, index:number) => {
            return (
              <div key={index}>{record.totalOrderCancelAmount.toLocaleString() + '원'}</div>
            )
          }
        },
      ],
    },
    {
      title: '순매출액',
      align: 'center',
      render: (text:string, record: ResponseManagementOrdersExcels, index:number) => {
        return (
          <div key={index}>{(record.totalOrderCompleteAmount - record.totalOrderCancelAmount).toLocaleString() + '원'}</div>
        )
      }
    },
  ];

  return (
    <div className="daily-sales" style={{ width: '180vh' }}>
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
      {/*  <Bar*/}
      {/*    data={chartData}*/}
      {/*    height={500}*/}
      {/*    redraw={true}*/}
      {/*    options={{*/}
      {/*      maintainAspectRatio: false,*/}
      {/*      responsive: true,*/}
      {/*      legend: {*/}
      {/*        display: false,*/}
      {/*      },*/}
      {/*      scales: {*/}
      {/*        yAxes: [*/}
      {/*          {*/}
      {/*            ticks: {*/}
      {/*              min: 0,*/}
      {/*            },*/}
      {/*          },*/}
      {/*        ],*/}
      {/*        xAxes: [*/}
      {/*          {*/}
      {/*            barPercentage: 1.0,*/}
      {/*            ticks: {*/}
      {/*              fontSize: 10,*/}
      {/*              fontStyle: 'bold',*/}
      {/*              paddingTop: 10,*/}
      {/*              paddingBottom: 10,*/}
      {/*            },*/}
      {/*          },*/}
      {/*        ],*/}
      {/*      },*/}
      {/*      tooltips: {*/}
      {/*        enabled: true,*/}
      {/*        callbacks: {*/}
      {/*          title: () => {*/}
      {/*            return '순매출액: 450,000원';*/}
      {/*          },*/}
      {/*          label: (tooltipItem: any, data: any) => {*/}
      {/*            return ' - 결제일시: 2019-08-01\n - 결제완료: 9건(총 500,000원)\n - 주문취소 1건(총 50,000원)'.split(*/}
      {/*              '\n',*/}
      {/*            );*/}
      {/*          },*/}
      {/*        },*/}
      {/*      },*/}
      {/*    }}*/}
      {/*  />*/}
      </div>
      <div style={{ width: 1620, marginTop: 20, textAlign: 'right' }}>
        <Button type="primary" icon="download">
          엑셀 다운로드
        </Button>
      </div>
      <div style={{ width: 1620, marginTop: 20 }}>
        <Table
          columns={excelColumns}
          dataSource={statistics.dailySales.ordersExcels}
          bordered
          rowKey={(recode, index) => index.toString()}
          pagination={false}
          size="middle"
        />
      </div>
    </div>
  );
};

export default DailySales;
