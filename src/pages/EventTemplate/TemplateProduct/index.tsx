// base
import React from 'react';

// component
// import { MainButton } from 'components';
import { useSelector } from 'react-redux';
import { StoreState } from 'store';

import './index.less';

function TemplateProduct() {
  // const handleRightRowOrder = () => {};

  const { event } = useSelector((state: StoreState) => state.event);

  return (
    <div id="product">
      {event.detail && <div className="product-detail" dangerouslySetInnerHTML={{ __html: event.detail }} />}
      {/* <MainButton text="바로 구매" onClickMainButton={handleRightRowOrder} like={true} sns={true} /> */}
    </div>
  );
}

export default TemplateProduct;
