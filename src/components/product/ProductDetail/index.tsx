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
import { CreateOption, CreateProduct, ResponseOption, ResponseProduct, ResponseShippingFeeInfo } from 'types';
import { ProductList } from '../ProductTable';

// enums
import { ProductMode, ProductSold } from 'enums';

// less
import './index.less';
import { StoreState } from 'store';

// todo : validate 추후 적용 필요 (이종현)
interface Props {
  eventId: number;
}

function ProductDetail(props: Props) {
  const { eventId } = props;
  const { products, shippingFeeInfo } = useSelector((state: StoreState) => state.event.event);

  const [productModalVisible, setProductModalVisible] = useState(false);
  const [productMode, setProductMode] = useState(ProductMode.CREATE);

  const dispatch = useDispatch();
  const initSelectedRowKeys: string[] = [];

  const [responseProducts, setResponseProducts] = useState(products);
  const [shippingFee, setShippingFree] = useState(shippingFeeInfo);
  const [selectProductId, setSelectProductId] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState(initSelectedRowKeys);


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
    setProductMode(ProductMode.CREATE);
  }, [setProductModalVisible, setSelectProductId, setProductMode]);

  const handleProductModalOk = useCallback(() => {
    // switch (productMode) {
    //   case ProductMode.CREATE:
    //     const createData = {
    //       eventId,
    //       data: product.options.reduce((ac, option, index) => {
    //         if (index === ac.options.length - 1) {
    //           ac.options = ac.options.slice(0, ac.options.length - 1);
    //         }
    //
    //         return ac;
    //       }, product),
    //     };
    //     dispatch(createProductAsync.request(createData));
    //     setProduct(initCreateProduct);
    //     setProductModalVisible(false);
    //     break;
    //   case ProductMode.UPDATE:
    //     const updateData = {
    //       eventId,
    //       productId: selectProductId,
    //       data: product.options.reduce((ac, option, index) => {
    //         if (index === ac.options.length - 1) {
    //           ac.options = ac.options.slice(0, ac.options.length - 1);
    //         }
    //
    //         return ac;
    //       }, product),
    //     };
    //     dispatch(updateProductAsync.request(updateData));
    //     setProduct(initCreateProduct);
    //     setProductModalVisible(false);
    //     break;
    // }
  }, []);

  const onChangeEnableOption = useCallback((value: number) => {
    // if (product.options.length === 0 && value === 0) {
    //   setProduct({
    //     ...product,
    //     disabledOptionStock: 0,
    //     disabledOptionSafeStock: 0,
    //     disabledOptionTotalStock: 0,
    //     options: product.options.concat(initOption),
    //     enableOption: true,
    //   });
    // } else {
    //   setProduct({
    //     ...product,
    //     enableOption: value === 0,
    //     options: [],
    //   });
    // }
  }, []);

  const onChangeOptionValue = useCallback((e, index) => {
    //   const name = e.target.name;
    //   const value = e.target.value;
    //
    //   if (name === 'optionName') {
    //     product.options[index].optionName = value;
    //   } else if (name === 'salePrice') {
    //     product.options[index].salePrice = Number(value) < 0 ? 0 : Number(value);
    //   } else if (name === 'stock') {
    //     product.options[index].stock = Number(value) < 0 ? 0 : Number(value);
    //     product.options[index].totalStock = Number(value) < 0 ? 0 : Number(value);
    //   } else if (name === 'safeStock') {
    //     product.options[index].safeStock = Number(value) < 0 ? 0 : Number(value);
    //   }
    //   setProduct({
    //     ...product,
    //     options: product.options,
    //   });
  },[]);

  const onChangeProductValue = useCallback(e => {
    // if (e.target.name === 'disabledOptionStock') {
    //   setProduct({
    //     ...product,
    //     disabledOptionStock: Number(e.target.value),
    //     disabledOptionTotalStock: Number(e.target.value),
    //   });
    // } else {
    //   setProduct({
    //     ...product,
    //     [e.target.name]:
    //       e.target.type === 'number' ? (Number(e.target.value) < 0 ? 0 : Number(e.target.value)) : e.target.value,
    //   });
    // }
  }, []);

  const addOptionRow = useCallback(() => {
    // setProduct({
    //   ...product,
    //   options: product.options.concat(initOption),
    // });
  }, []);

  const removeOptionRow = useCallback((index: number) => {
    // const tempOptions: ResponseOption | CreateOption[] = [];
    // product.options.forEach((item, itemIndex) => {
    //   if (index !== itemIndex) {
    //     tempOptions.push(item);
    //   }
    // });
    //
    // setProduct({
    //   ...product,
    //   enableOption: tempOptions.length !== 0,
    //   options: tempOptions,
    // });
  }, []);

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
    setProductMode(ProductMode.UPDATE);
    setProductModalVisible(true);
  }, []);

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
      <ProductTable responseProducts={responseProducts} />
      <ShippingFreeInfo
        shippingFreeInfo={shippingFee}
        onClickShippingFreeInfo={handleShippingFreeInfo}
        onChangeShippingFreeInfoValue={onChangeShippingFreeInfoValue} />
    </div>
  );
}

export default ProductDetail;