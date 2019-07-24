// base
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// components
import { ProductTable, ShippingFreeInfo } from 'components';

// modules
import { TableRowSelection } from 'antd/lib/table';

// store
import {
  createProductAsync,
  deleteProductsAsync,
  updateProductAsync,
  updateShippingFeeInfoAsync,
  soldOutProductsAsync,
} from 'store/reducer/product';

// types
import { CreateOption, CreateProduct, ResponseOption, ResponseProduct, ResponseShippingFeeInfo, FileObject } from 'types';
import { ProductList } from '../ProductTable';

// enums
import { ProductMode, ProductSold } from 'enums';

// less
import './index.less';

// todo : validate 추후 적용 필요 (이종현)
interface Props {
  eventId: number;
  responseProducts: ResponseProduct[];
  responseShippingFeeInfo: ResponseShippingFeeInfo;
}

function ProductDetail(props: Props) {
  const { eventId, responseProducts, responseShippingFeeInfo } = props;

  const [productModalVisible, setProductModalVisible] = useState(false);
  const [productMode, setProductMode] = useState(ProductMode.CREATE);

  const dispatch = useDispatch();

  const initCreateProduct: CreateProduct = {
    productName: '',
    normalSalesPrice: 0,
    discountSalesPrice: 0,
    disabledOptionStock: 0,
    disabledOptionTotalStock: 0,
    disabledOptionSafeStock: 0,
    freebie: '',
    enableOption: true,
    options: [
      {
        optionName: '',
        salePrice: 0,
        stock: 0,
        safeStock: 0,
        totalStock: 0,
      },
    ],
    images: []
  };

  const initOption: CreateOption = {
    optionName: '',
    salePrice: 0,
    stock: 0,
    safeStock: 0,
    totalStock: 0,
  };

  const initShippingFreeInfo: ResponseShippingFeeInfo = {
    shippingFee: 0,
    shippingFreeCondition: 0,
  };

  const initProducts: ResponseProduct[] = [];
  const initSelectedRowKeys: string[] = [];

  const [product, setProduct] = useState(initCreateProduct);
  const [products, setProducts] = useState(initProducts);
  const [shippingFee, setShippingFree] = useState(initShippingFreeInfo);
  const [selectProductId, setSelectProductId] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState(initSelectedRowKeys);
  const [fileObjectList, setFileObjectList] = useState<FileObject[]>([]);

  useEffect(() => {
    setProducts(() => responseProducts);
    setShippingFree(() => responseShippingFeeInfo);
  }, [responseProducts, responseShippingFeeInfo]);

  const rowSelection: TableRowSelection<string[]> = {
    selectedRowKeys,
    onChange: useCallback(selectedRowKeys => {
      setSelectedRowKeys(selectedRowKeys);
    }, []),
  };

  const handleProductModalOpen = useCallback(() => {
    setProductModalVisible(true);
  }, [setProductModalVisible]);

  const handleProductModalClose = useCallback(() => {
    setProductModalVisible(false);
    setSelectProductId(0);
    setProduct(initCreateProduct);
    setProductMode(ProductMode.CREATE);
    setFileObjectList([]);
  }, [setProductModalVisible, setSelectProductId, setProduct, initCreateProduct, setProductMode]);

  const handleProductModalOk = useCallback(() => {
    const newOptions = product.options.slice(0, product.options.length -1);

    switch (productMode) {
      case ProductMode.CREATE:
        const createData = {
          eventId,
          data: {
            productName: product.productName,
            normalSalesPrice: product.normalSalesPrice,
            discountSalesPrice: product.discountSalesPrice,
            disabledOptionTotalStock: product.disabledOptionTotalStock,
            disabledOptionStock: product.disabledOptionStock,
            disabledOptionSafeStock: product.disabledOptionSafeStock,
            freebie: product.freebie,
            enableOption: product.enableOption,
            options: newOptions,
            images: fileObjectList
          }
        };
        dispatch(createProductAsync.request(createData));
        break;
      case ProductMode.UPDATE:
        const updateData = {
          eventId,
          productId: selectProductId,
          data: {
            productName: product.productName,
            normalSalesPrice: product.normalSalesPrice,
            discountSalesPrice: product.discountSalesPrice,
            disabledOptionTotalStock: product.disabledOptionTotalStock,
            disabledOptionStock: product.disabledOptionStock,
            disabledOptionSafeStock: product.disabledOptionSafeStock,
            freebie: product.freebie,
            enableOption: product.enableOption,
            options: newOptions,
            images: fileObjectList
          }
        };
        dispatch(updateProductAsync.request(updateData));
        break;
    }
    setFileObjectList([]);
    setProduct(initCreateProduct);
    setProductModalVisible(false);
  }, [selectProductId, dispatch, product, initCreateProduct, productMode]);

  const onChangeEnableOption = useCallback(
    (value: number) => {
      if (product.options.length === 0 && value === 0) {
        setProduct({
          ...product,
          disabledOptionStock: 0,
          disabledOptionSafeStock: 0,
          disabledOptionTotalStock: 0,
          options: product.options.concat(initOption),
          enableOption: true,
        });
      } else {
        setProduct({
          ...product,
          enableOption: value === 0,
          options: [],
        });
      }
    },
    [initOption, product],
  );

  const onChangeOptionValue = useCallback((e, index) => {
    const name = e.target.name;
    const value = e.target.value;

    const newOptions:CreateOption[] = product.options.map((optionItem, optionIndex) => optionIndex === index ? ({
      ...optionItem,
      optionName: name === 'optionName' ? value : optionItem.optionName,
      salePrice: name === 'salePrice' ? Number(value) < 0 ? 0 : Number(value) : optionItem.salePrice,
      stock: name === 'stock' ? Number(value) < 0 ? 0 : Number(value) : optionItem.stock,
      totalStock: name === 'stock' ? Number(value) < 0 ? 0 : Number(value) : optionItem.totalStock,
      safeStock: name === 'safeStock' ? Number(value) < 0 ? 0 : Number(value) : optionItem.safeStock
    }) : optionItem);

    setProduct({
      ...product,
      options: newOptions
    });
  },
    [product],
  );

  const onChangeProductValue = useCallback(
    e => {
      if (e.target.name === 'disabledOptionStock') {
        setProduct({
          ...product,
          disabledOptionStock: Number(e.target.value),
          disabledOptionTotalStock: Number(e.target.value),
        });
      } else {
        setProduct({
          ...product,
          [e.target.name]:
            e.target.type === 'number' ? (Number(e.target.value) < 0 ? 0 : Number(e.target.value)) : e.target.value,
        });
      }
    },
    [product],
  );

  const addOptionRow = useCallback(() => {
    setProduct({
      ...product,
      options: product.options.concat(initOption),
    });
  }, [product, initOption]);

  const removeOptionRow = useCallback(
    (index: number) => {
      const tempOptions: ResponseOption | CreateOption[] = [];
      product.options.forEach((item, itemIndex) => {
        if (index !== itemIndex) {
          tempOptions.push(item);
        }
      });

      setProduct({
        ...product,
        enableOption: tempOptions.length !== 0,
        options: tempOptions,
      });
    },
    [product],
  );

  const onChangeShippingFreeInfoValue = useCallback(
    e => {
      setShippingFree({
        ...shippingFee,
        [e.target.name]: Number(e.target.value) < 0 ? 0 : Number(e.target.value),
      });
    },
    [shippingFee],
  );

  const handleShippingFreeInfo = useCallback(() => {
    const data = {
      eventId,
      data: {
        shippingFeeInfo: shippingFee,
      },
    };
    dispatch(updateShippingFeeInfoAsync.request(data));
  }, [dispatch, shippingFee]);

  const handleSelectedRow = useCallback((record: ProductList) => {
      setProduct({
        ...product,
        productName: record.productName,
        normalSalesPrice: record.normalSalesPrice,
        discountSalesPrice: record.discountSalesPrice,
        disabledOptionTotalStock: record.disabledOptionTotalStock,
        disabledOptionStock: record.disabledOptionStock,
        disabledOptionSafeStock: record.disabledOptionSafeStock,
        freebie: record.freebie,
        enableOption: record.enableOption,
        options: record.enableOption ? record.options.concat({
          optionName: '',
          salePrice: 0,
          stock: 0,
          totalStock: 0,
          safeStock: 0,
        }) : record.options
      });
      setFileObjectList(record.images);
      setSelectProductId(record.productId);
      setProductMode(ProductMode.UPDATE);
      setProductModalVisible(true);
    },
    [product],
  );

  const handleProductDelete = useCallback(() => {
    const selectedIds: number[] = [];

    selectedRowKeys.forEach(index => {
      const selectIndex = Number(index) - 1;
      selectedIds.push(products[selectIndex].productId);
    });

    const data = {
      eventId,
      data: {
        productIds: selectedIds,
      },
    };
    dispatch(deleteProductsAsync.request(data));
    setSelectedRowKeys([]);
  }, [dispatch, products, selectedRowKeys]);

  const handleProductSoldOut = useCallback(
    (productSold: ProductSold) => {
      const selectedIds: number[] = [];

      selectedRowKeys.map(index => {
        return selectedIds.push(products[Number(index) - 1].productId);
      });

      const data = {
        eventId,
        data: {
          productIds: selectedIds,
          soldOut: productSold === ProductSold.SOLD_OUT,
        },
      };
      dispatch(soldOutProductsAsync.request(data));
      setSelectedRowKeys([]);
    },
    [dispatch, products, selectedRowKeys],
  );

  return (
    <div id="product">
      <div className="product-detail-title">
        <h2>제품 정보</h2>
      </div>
      <div className="product-detail-sub-title">
        <h2>전체 상품 목록</h2>
      </div>
      <ProductTable
        products={products}
        productMode={productMode}
        product={product}
        productModalVisible={productModalVisible}
        onClickProductModalOpen={handleProductModalOpen}
        onClickProductModalClose={handleProductModalClose}
        onClickProductModalOk={handleProductModalOk}
        onChangeProductValue={onChangeProductValue}
        onChangeOptionValue={onChangeOptionValue}
        onChangeEnableOption={onChangeEnableOption}
        addOptionRow={addOptionRow}
        removeOptionRow={removeOptionRow}
        rowSelection={rowSelection}
        handleSelectedRow={handleSelectedRow}
        onClickProductDelete={handleProductDelete}
        onClickProductSoldOut={handleProductSoldOut}
        fileObjectList={fileObjectList}
        setFileObjectList={setFileObjectList} />
      <ShippingFreeInfo
        shippingFreeInfo={shippingFee}
        onClickShippingFreeInfo={handleShippingFreeInfo}
        onChangeShippingFreeInfoValue={onChangeShippingFreeInfoValue}
      />
    </div>
  );
}

export default ProductDetail;
