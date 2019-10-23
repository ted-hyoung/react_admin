// base
import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from 'store';
import { getBrandsAsync } from 'store/reducer/brand';

// modules
import { Select } from 'antd';

// components

// utils

// less
import './index.less';

export interface SelectData {
  text: string;
  value: string;
}

interface Props {
  selectData: SelectData[];
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
  onChange?: (value: any) => void;
}

// function BrandSalesMultiSearch(props: Props) {
const BrandSalesMultiSearch = React.forwardRef<Select, Props>((props, ref) => {
  const { selected, setSelected, onChange, selectData } = props;
  const { Option } = Select;

  const dispatch = useDispatch();

  const getBrands = useCallback(() => {
    dispatch(getBrandsAsync.request({}));
  }, [dispatch]);

  useEffect(() => {
    getBrands();
  }, []);

  const handleChange = (value: any) => {
    setSelected(value);
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
      value={selected}
      onChange={handleChange}
    >
      {selectData.map((item, index) => {
        return (
          <Option key={index} value={item.value}>
            {item.text}
          </Option>
        );
      })}
    </Select>
  );
});

export default BrandSalesMultiSearch;
