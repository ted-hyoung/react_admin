// base
import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from 'store';
import { getBrandsAsync } from 'store/reducer/brand';

// modules
import { Select } from 'antd';

// components

// utils

import './index.less';

interface Props {
  selectedBrand: number[];
  setSelectedBrand: Dispatch<SetStateAction<number[]>>;
  onChange?: (value: any) => void;
}

// function BrandSalesMultiSearch(props: Props) {
const BrandSalesMultiSearch = React.forwardRef<Select, Props>((props, ref) => {
  const { selectedBrand, setSelectedBrand, onChange } = props;
  const { Option } = Select;
  const { brand } = useSelector((state: StoreState) => state.brand);
  const dispatch = useDispatch();

  const getBrands = useCallback(() => {
    dispatch(getBrandsAsync.request({}));
  }, [dispatch]);

  useEffect(() => {
    getBrands();
  }, []);

  const handleChange = (value: any) => {
    setSelectedBrand(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <Select
      ref={ref}
      mode="multiple"
      style={{ width: '330px' }}
      placeholder="Please select brand."
      value={selectedBrand}
      onChange={handleChange}
    >
      {brand.map((item, index) => {
        return (
          <Option key={index} value={item.brandId}>
            {item.brandName}
          </Option>
        );
      })}
    </Select>
  );
});

export default BrandSalesMultiSearch;
