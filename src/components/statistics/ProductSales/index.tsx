// base
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// modules
import { Button, Table, Tooltip, Icon, Row, Col } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import { Bar } from 'react-chartjs-2';

// store
import { StoreState } from 'store';
import {
  clearProductSalesStatus,
  statisticsProductExcelAsync,
  statisticsProductSalesAsync,
} from 'store/reducer/product';

// components
import { ProductSalesSearchBar, ProductSalesChart } from 'components';

// utils
import { defaultDateTimeFormat, getNowYMD, createExcel, dateTimeFormat } from 'lib/utils';

// types
import {
  ResponseManagementProductStatistics,
  ChartData2,
  DataSets,
  SearchProductForOrder,
  SearchOrder, Indexable,
  ProductTables,

} from 'types';

// less
import './index.less';
import { EventList } from '../ProductSalesSearchBar';
import Orders from '../../../pages/Orders';
import ReactToPrint from 'react-to-print';
import { ShippingCompany, ShippingStatus } from '../../../enums';
import { getOrdersExcelAsync } from '../../../store/reducer/order';

export interface SearchEventForOrder {
  name: string;
  product: SearchProductForOrder;
}



export interface ProductDataSets {
  label: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  hoverBackgroundColor?: string;
  hoverBorderColor?: string;
  type?: string;
  data: (number | null)[];
}

const ProductSales = () => {
  const printRef = useRef<any>();
  const { statistics, productsExcel} = useSelector((storeState: StoreState) => storeState.product);
  const [lastSearchCondition, setLastSearchCondition] = useState<SearchEventForOrder[]>();
  const dispatch = useDispatch();
  const [charData, setChartData] = useState<ChartData2>({
    labels: [],
    datasets: [],
  });
  const dataSource: ProductTables[] = [];
  const chartProductData: ResponseManagementProductStatistics[] = [];

  chartProductData.push(...statistics.productSales);

  // const getProductSales = (eventsData: SearchEventForOrder[]) => {
  //   console.log(eventsData);
  //   console.log("ProductSales : getProductSales", eventsData);
  // };

  const getProductStatistics = useCallback(
    ( searchCondition?: SearchEventForOrder[] ) => {
      //  console.log(searchCondition);
      dispatch(
        statisticsProductSalesAsync.request({
          searchCondition,
        }),
      );
      setChartData({
        labels:[],
        datasets:[]
      });
      setLastSearchCondition(searchCondition);
    },
    [dispatch, setLastSearchCondition],
  );

  useEffect(() => {
    console.log(statistics.productSalesStatus);
    if (statistics.productSalesStatus) {
      setChartData({
        labels: [],
        datasets: [],
      });
      const datasets: ProductDataSets[] = [];
      const labelArr: (string[])[] = [];

      let dataSetsSize = 1;
      chartProductData.map((item, index) => {
        if(item.enableOption){
          if(dataSetsSize < item.options.length){
            dataSetsSize =  item.options.length;
          }
        }
      });

      // chart data 생성
      for (let i = 0; i < dataSetsSize; i++) {

        const chartColors = [
          {
            backgroundColor: '#36a2eb',
            hoverBackgroundColor: '#0072ff',
          },
          {
            backgroundColor: '#ff6384',
            hoverBackgroundColor: '#ff0033',
          },
          {
            backgroundColor: '#e9eb85',
            hoverBackgroundColor: '#ffd51c',
          },
          {
            backgroundColor: '#84e179',
            hoverBackgroundColor: '#11c100',
          },
          {
            backgroundColor: '#eb8cd2',
            hoverBackgroundColor: '#ff2feb',
          },
          {
            backgroundColor: '#ebb161',
            hoverBackgroundColor: '#ff9226',
          }
        ];

        datasets.push(
          {
            label:  "",
            backgroundColor: chartColors[i].backgroundColor,
            data: [
              null,null,null,null,null
            ],
            hoverBackgroundColor: chartColors[i].hoverBackgroundColor,
            hoverBorderColor: chartColors[i].hoverBackgroundColor,
          }
        )
      }


      for (let i = 0; i < chartProductData.length; i++) {
        labelArr.push([chartProductData[i].name,chartProductData[i].productName]);

        if (chartProductData[i].enableOption) {
          for (let j = 0; j < chartProductData[i].options.length; j++) {
            if (datasets[j] && datasets[j].data) {
              datasets[j].data[i] = chartProductData[i].options[j].totalSalesAmount;
            }
          }
        }else{
          datasets[0].data[i] = chartProductData[i].totalSalesAmount
        }
      }
      console.log(datasets);
      console.log(labelArr);
      setChartData({
        labels:labelArr,
        datasets
      });
      console.log(charData);
      dispatch(clearProductSalesStatus);
    }
  }, [statistics.productSalesStatus]);

  // console.log("clearProductSalesStatus" ,clearProductSalesStatus);

  const handleReset = () => {
//    console.log("ProductSales : handleReset");
    setChartData({
      labels:[],
      datasets:[]
    });
  };

  const columns: Array<ColumnProps<ProductTables>> = [
    { title: '공구명', dataIndex: 'name', key: 'name' },
    { title: '제품명', dataIndex: 'productName', key: 'productName' },
    { title: '옵션명', dataIndex: 'optionName', key: 'optionName' },
    { title: '판매가', dataIndex: 'salesPrice', key: 'salesPrice' },
    { title: '판매수량', dataIndex: 'totalSalesQuantity', key: 'totalSalesQuantity' },
    { title: '매출액', dataIndex: 'totalSalesAmount', key: 'totalSalesAmount' }
  ];


  chartProductData.map(product => {

    if(product.options.length > 0){
      const options = product.options;

      for (let i = 0; i < options.length; i++) {
        dataSource.push({
          name: product.name,
          productName: product.productName,
          optionName: product.options[i].optionName,
          salesPrice: product.options[i].salesPrice.toLocaleString(),
          totalSalesQuantity: product.options[i].totalSalesQuantity,
          totalSalesAmount: product.options[i].totalSalesAmount.toLocaleString()
        })
      }
    }else{
      dataSource.push({
        name: product.name,
        productName: product.productName,
        optionName: "",
        salesPrice: product.discountSalesPrice.toLocaleString(),
        totalSalesQuantity: product.totalSalesQuantity,
        totalSalesAmount: product.totalSalesAmount.toLocaleString()
      })
    }
  });

  const getOrdersExcel = useCallback(() => {
    dispatch(statisticsProductExcelAsync.request({
      lastSearchCondition
    }));
  }, [dispatch, lastSearchCondition]);

  // console.log('productsExcel', productsExcel);
//  console.log('statistics', statistics);
  const getDatasetKeyProvider = () => {
    return 'datasetKey';
  };

  return (
    <div>
      <div>
        <ProductSalesSearchBar
          onSearch={value => getProductStatistics(value.events)}
          onReset={() => handleReset()}
        />
      </div>
      {chartProductData.length > 0 &&
      <div className="card-container">
        <div style={{ width: '100%', overflowX: 'auto', overflowY: 'hidden' }}>
          <ProductSalesChart statistics={chartProductData} type={'total'} chartData={charData} />
        </div>
      </div>
      }
      <Table
        rowKey={(recode, index) => index.toString()}
        title={() => (
          <Row type="flex" justify="space-between">
            <Col>
              <Button type="primary" icon="download" onClick={getOrdersExcel}>
                엑셀 다운로드
              </Button>
              <ReactToPrint
                trigger={() => (
                  <Button style={{ marginLeft: 4 }} type="danger">
                    인쇄
                  </Button>
                )}
                content={() => printRef.current}
              />
            </Col>
          </Row>
        )}
        ref={printRef}
        columns={columns}
        dataSource={dataSource}
      />
    </div>
  );
};

export default ProductSales;
