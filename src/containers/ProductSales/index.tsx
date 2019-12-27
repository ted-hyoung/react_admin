// base
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearOrderExcel, getOrdersExcelAsync } from 'store/reducer/order';

// modules
import ReactToPrint from 'react-to-print';
import { Button, Table, Row, Col } from 'antd';
import { ColumnProps } from 'antd/lib/table';

// store
import { StoreState } from 'store';
import {
  clearProductSalesStatus,
  statisticsProductExcelAsync,
  statisticsProductSalesAsync,
} from 'store/reducer/product';

// containers
import { ProductSalesSearchBar, ProductSalesChart } from 'containers';

// utils
import { createExcel } from 'lib/utils';

// types
import { ResponseManagementProductStatistics, ChartData2, SearchProductForOrder, ProductTables } from 'models';

// less
import './index.less';

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

const pageSize = 20;

const ProductSales = () => {
  const printRef = useRef<any>();
  const { statistics, productsExcel } = useSelector((storeState: StoreState) => storeState.product);
  const [lastSearchCondition, setLastSearchCondition] = useState<SearchEventForOrder[]>();
  const dispatch = useDispatch();
  const [charData, setChartData] = useState<ChartData2>({
    labels: [],
    datasets: [],
  });
  const [totalBoard, setTotalBoard] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const dataSource: ProductTables[] = [];
  const chartProductData: ResponseManagementProductStatistics[] = [];

  chartProductData.push(...statistics.productSales);

  const getProductStatistics = useCallback(
    (searchCondition?: SearchEventForOrder[]) => {
      dispatch(
        statisticsProductSalesAsync.request({
          searchCondition,
        }),
      );
      setChartData({
        labels: [],
        datasets: [],
      });
      setLastSearchCondition(searchCondition);
      setCurrentPage(1);
    },
    [dispatch, setLastSearchCondition],
  );

  useEffect(() => {
    setTotalBoard(statistics.productSales.length);
  }, [statistics.productSales.length]);

  const handlePaginationChange = (currentPage: number) => {
    setCurrentPage(currentPage);
  }

  useEffect(() => {
    if (statistics.productSalesStatus) {
      setChartData({
        labels: [],
        datasets: [],
      });
      const datasets: ProductDataSets[] = [];
      const labelArr: (string[])[] = [];

      let dataSetsSize = 1;
      chartProductData.map((item, index) => {
        if (item.enableOption) {
          if (dataSetsSize < item.options.length) {
            dataSetsSize = item.options.length;
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
          },
        ];

        datasets.push({
          label: '',
          backgroundColor: chartColors[i].backgroundColor,
          data: [null, null, null, null, null],
          hoverBackgroundColor: chartColors[i].hoverBackgroundColor,
          hoverBorderColor: chartColors[i].hoverBackgroundColor,
        });
      }

      for (let i = 0; i < chartProductData.length; i++) {
        labelArr.push([chartProductData[i].name, chartProductData[i].productName]);

        if (chartProductData[i].enableOption) {
          for (let j = 0; j < chartProductData[i].options.length; j++) {
            if (datasets[j] && datasets[j].data) {
              datasets[j].data[i] = chartProductData[i].options[j].totalSalesAmount;
            }
          }
        } else {
          datasets[0].data[i] = chartProductData[i].totalSalesAmount;
        }
      }

      setChartData({
        labels: labelArr,
        datasets,
      });
      dispatch(clearProductSalesStatus);
    }
  }, [statistics.productSalesStatus]);

  // console.log("clearProductSalesStatus" ,clearProductSalesStatus);

  const handleReset = () => {
    //    console.log("ProductSales : handleReset");
    setChartData({
      labels: [],
      datasets: [],
    });
  };

  const columns: Array<ColumnProps<ProductTables>> = [
    { title: '공구명', dataIndex: 'name', key: 'name' },
    { title: '제품명', dataIndex: 'productName', key: 'productName' },
    { title: '옵션명', dataIndex: 'optionName', key: 'optionName' },
    { title: '판매가', dataIndex: 'salesPrice', key: 'salesPrice' },
    { title: '판매수량', dataIndex: 'totalSalesQuantity', key: 'totalSalesQuantity' },
    { title: '매출액', dataIndex: 'totalSalesAmount', key: 'totalSalesAmount' },
  ];

  chartProductData.map(product => {
    if (product.options.length > 0) {
      const options = product.options;

      for (let i = 0; i < options.length; i++) {
        dataSource.push({
          name: product.name,
          productName: product.productName,
          optionName: product.options[i].optionName,
          salesPrice: product.options[i].salesPrice.toLocaleString(),
          totalSalesQuantity: product.options[i].totalSalesQuantity,
          totalSalesAmount: product.options[i].totalSalesAmount.toLocaleString(),
        });
      }
    } else {
      dataSource.push({
        name: product.name,
        productName: product.productName,
        optionName: '옵션없음',
        salesPrice: product.discountSalesPrice.toLocaleString(),
        totalSalesQuantity: product.totalSalesQuantity,
        totalSalesAmount: product.totalSalesAmount.toLocaleString(),
      });
    }
  });
  useEffect(() => {
    if (productsExcel.length !== 0) {
      createProductExcel();
      dispatch(clearOrderExcel);
    }
  }, [productsExcel]);
  const getOrdersExcel = useCallback(() => {
    dispatch(
      statisticsProductExcelAsync.request({
        lastSearchCondition,
      }),
    );
  }, [dispatch, lastSearchCondition]);

  const createProductExcel = () => {
    const data = [['공구명', '제품명', '옵션명', '판매가', '판매수량', '매출액']];

    if (productsExcel.length > 0) {
      productsExcel.forEach(item => {
        if (item.options.length > 0) {
          for (let i = 1; i < item.options.length; i++) {
            data.push([
              item.name,
              item.productName,
              item.options[i].optionName,
              item.options[i].salesPrice.toLocaleString(),
              item.options[i].totalSalesQuantity.toLocaleString(),
              item.options[i].totalSalesAmount.toLocaleString(),
            ]);
          }
        } else {
          data.push([
            item.name,
            item.productName,
            '옵션없음',
            item.discountSalesPrice.toLocaleString(),
            item.totalSalesQuantity.toLocaleString(),
            item.totalSalesAmount.toLocaleString(),
          ]);
        }
      });

      createExcel(data);
    }
  };

  // console.log('productsExcel', productsExcel);
  //  console.log('statistics', statistics);
  const getDatasetKeyProvider = () => {
    return 'datasetKey';
  };

  return (
    <div>
      <div>
        <ProductSalesSearchBar onSearch={value => getProductStatistics(value.events)} onReset={() => handleReset()} />
      </div>
      {chartProductData.length > 0 && (
        <div className="card-container">
          <div style={{ width: '100%', overflowX: 'auto', overflowY: 'hidden' }}>
            <ProductSalesChart statistics={chartProductData} type={'total'} chartData={charData} />
          </div>
        </div>
      )}
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
        pagination={{
          total: totalBoard,
          pageSize,
          current: currentPage,
          onChange: handlePaginationChange
        }}
        size="middle"
      />
    </div>
  );
};

export default ProductSales;
