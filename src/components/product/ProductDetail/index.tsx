// base
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

// components
import { ProductTable, ShippingFreeInfo } from 'components';

// store
import { createProductAsync, updateShippingFeeInfoAsync } from 'store/reducer/product';

// types
import { ResponseProduct, ResponseShippingFeeInfo } from 'types';

// enums
import { ProductMode } from 'enums';

// less
import './index.less';

interface Props {
  products: ResponseProduct[];
  shippingFeeInfo: ResponseShippingFeeInfo;
}

function ProductDetail(props: Props) {

  const { products, shippingFeeInfo } = props;

  const [ productModalVisible, setProductModalVisible ] = useState(false);
  const [ productMode, setProductMode ] = useState(ProductMode.CREATE);

  const dispatch = useDispatch();
  // const { createProduct, message } = useSelector((state: StoreState) => state.product.requestState);

  const initCreateProduct = {
    productName: '',
    normalSalesPrice: 0,
    discountSalesPrice: 0,
    disabledOptionStock: 0,
    disabledOptionTotalStock: 0,
    disabledOptionSafeStock: 0,
    freebie: '',
    enableOption: true,
    options: [{
      optionName: "",
      salePrice: 0,
      stock: 0,
      safeStock: 0,
      totalStock: 0
    }]
  };

  const initOption = {
    optionName: "",
    salePrice: 0,
    stock: 0,
    safeStock: 0,
    totalStock: 0
  };

  const [ product, setProduct ] = useState(initCreateProduct);

  const [ shippingFee, setShippingFree ] = useState(shippingFeeInfo);
  //
  // console.log(shippingFee)

  const handleProductModalOpen = () => {
    setProductModalVisible(true);
  };

  const handleProductModalClose = () => {
    setProductModalVisible(false);
    setProduct(initCreateProduct);
  };

  const handleProductModalOk = useCallback(() => {
    const data = {
      eventId: 1,
      data: product
    };
    dispatch(
      createProductAsync.request(data)
    );
    setProductModalVisible(false);
  }, [dispatch, product]);

  const handleEnableOption = (value:number) => {
    if (product.options.length === 0 && value === 0) {
      setProduct({
        ...product,
        disabledOptionStock: 0,
        disabledOptionSafeStock: 0,
        disabledOptionTotalStock: 0,
        options: product.options.concat(initOption),
        enableOption: true
      });
    } else {
      setProduct({
        ...product,
        enableOption: value === 0,
        options: []
      });
    }
  };

  const rowSelection = {

  };

  const setProductValue = useCallback((e, type, index) => {
    if (type === 'product') {
      if (e.target.name === 'disabledOptionStock') {
        setProduct({
          ...product,
          disabledOptionStock: Number(e.target.value),
          disabledOptionTotalStock: Number(e.target.value)
        })
      } else {
        setProduct({
          ...product,
          [e.target.name]: e.target.type === 'number' ? Number(e.target.value) < 0 ? 0 : Number(e.target.value) : e.target.value
        });
      }
    } else if (type === 'option') {
      const name = e.target.name;
      const value = e.target.value;

      if (name === 'optionName') {
        product.options[index].optionName = value;
      } else if (name === 'salePrice') {
        product.options[index].salePrice = Number(value) < 0 ? 0 : Number(value);
      } else if (name === 'stock') {
        product.options[index].stock = Number(value) < 0 ? 0 : Number(value);
        product.options[index].totalStock = Number(value) < 0 ? 0 : Number(value);
      } else if (name === 'safeStock') {
        product.options[index].safeStock = Number(value) < 0 ? 0 : Number(value);
      }

      setProduct({
        ...product,
        options: product.options
      });
    }
  }, [product]);

  const addOptionRow = useCallback(() => {
    setProduct({
      ...product,
      options: product.options.concat(initOption)
    });
  }, [product, initOption]);

  const removeOptionRow = useCallback((index) => {
    const tempOptions:any = [];
    product.options.forEach((item, itemIndex) => {
      if (index !== itemIndex) {
        tempOptions.push(item);
      }
    });

    setProduct({
      ...product,
      enableOption: tempOptions.length !== 0,
      options: tempOptions
    });
  }, [product]);

  const setShippingFreeInfoValue = useCallback((e) => {
    setShippingFree({
      ...shippingFee,
      [e.target.name] : Number(e.target.value) < 0 ? 0 : Number(e.target.value)
    });
  }, [shippingFee]);

  const handleShippingFreeInfo = useCallback(() => {
    const data = {
      eventId: 1,
      data: {
        shippingFeeInfo: shippingFee
      }
    };
    dispatch(
      updateShippingFeeInfoAsync.request(data)
    );
  }, [dispatch, shippingFee]);

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
        setProductValue={setProductValue}
        changeEnableOption={handleEnableOption}
        addOptionRow={addOptionRow}
        removeOptionRow={removeOptionRow}
        rowSelection={rowSelection}
      />
      <ShippingFreeInfo
        shippingFreeInfo={shippingFee}
        onClickShippingFreeInfo={handleShippingFreeInfo}
        setShippingFreeInfoValue={setShippingFreeInfoValue}
      />
    </div>
  )
}

export default ProductDetail;