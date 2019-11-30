// base
import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from 'store';

// modules
import {
  Input,
} from 'antd';

// store
import { getBrandsAsync } from 'store/reducer/brand';


// containers
import {
  BannerForm,
} from 'containers';

// defines

function BannerAdd() {
  const { brand } = useSelector((state: StoreState) => state.brand);
  const dispatch = useDispatch();

  const getBrands = useCallback(() => {
    dispatch(getBrandsAsync.request({}));
  }, [dispatch]);

  useEffect(() => {
    getBrands();
  }, [getBrands]);

  return (
    <>
      <BannerForm brands={brand}/>
    </>
  );
}

export default BannerAdd;
