// base
import React from 'react';
import { useSelector } from 'react-redux';

// components
import { ProductTable, ShippingFreeInfo } from 'components';

// store
import { StoreState } from 'store';

// types
import { ResponseEvent } from 'models';

// less
import './index.less';

interface Props {
  event: ResponseEvent;
}

function ProductDetail(props: Props) {
  const { event } = props;
  const { products, shippingFeeInfo } = useSelector((state: StoreState) => state.event.event);

  return (
    <div id="product">
      <div className="product-detail-title">
        <h2>제품 정보</h2>
      </div>
      <div className="product-detail-sub-title">
        <h2>전체 상품 목록</h2>
      </div>
      <ProductTable products={products} event={event} />
      <ShippingFreeInfo shippingFreeInfo={shippingFeeInfo} event={event} />
    </div>
  );
}

export default ProductDetail;
