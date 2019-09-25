// base
import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';

// modules
import Form, { FormComponentProps } from 'antd/lib/form';
import { Select } from 'antd';

// components

// utils

import { getBrandsAsync } from '../../../store/reducer/brand';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from '../../../store';

// less
import './index.less';


interface Props {
  setSelectedBrand : Dispatch<SetStateAction<number[]>>;
  onChange?: (value: any) => void;
}

// function BrandSalesMultiSearch(props: Props) {
const BrandSalesMultiSearch = React.forwardRef<Select, Props>((props, ref) => {
  const { setSelectedBrand, onChange } = props;
  const { Option } = Select;
  // const [selectedBrand, setSelectedBrand] = useState<ResponseBrandForEvent>();

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
      defaultValue={[]}
      onChange={handleChange}
    >
      {brand.map((item , index) => {
        return <Option key={index} value={item.brandId}>{item.brandName}</Option>
      })}
    </Select>
  );
});

export default BrandSalesMultiSearch;
