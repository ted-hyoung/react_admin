// base
import React, { useCallback, useState } from 'react';

// modules
import Form, { FormComponentProps } from 'antd/lib/form';
import { Button } from 'antd';
import moment from 'moment';

// components
import BrandSalesSearchDate, {
  getValueFromEventForSearchDate,
  getValuePropsForSearchDate,
  validateDate,
} from 'components/statistics/BrandSalesSearchDate';

// utils
import { startDateFormat, endDateFormat } from 'lib/utils';

import { BrandSalesMultiSearch } from '../index';
import { getBrandsAsync } from '../../../store/reducer/brand';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from '../../../store';

interface Props extends FormComponentProps {
  onSearch: (value: { [props: string]: any }) => void;
  onReset: () => void;
}

const BrandSalesSearchBar = Form.create<Props>()((props: Props) => {
  const { form, onSearch, onReset } = props;
  const dispatch = useDispatch();
  const { getFieldDecorator, validateFields, resetFields, getFieldValue, setFieldsValue } = form;
  const [ selectedBrand, setSelectedBrand ] = useState<number[]>([]);

  const handleSearch = useCallback(() => {
    validateFields((err, val) => {

      if (!err) {
        Object.keys(val).map(key => {
          if (val[key] === undefined) {
            delete val[key];
            return false;
          }
          if (key === 'date') {
            validateDate(val, 'date');
            return;
          }
        });
        val.startDate = moment(val.startDate).format(startDateFormat);
        val.endDate = moment(val.endDate).format(endDateFormat);
        onSearch(val);
      }else{
        console.error(err);
      }
    });
  }, [onSearch, selectedBrand, validateFields]);

  const handleReset = useCallback(() => {
    resetFields();
    onReset();
    setSelectedBrand([]);
  }, [onReset,resetFields, setSelectedBrand]);

  const getBrands = useCallback(() => {
    dispatch(getBrandsAsync.request({}));
  }, [dispatch]);

  // const { brand } = useSelector((state: StoreState) => state.brand);

  return (
    <>
      <Form>
        <Form.Item>
          {getFieldDecorator('date', {
            initialValue: [moment(new Date()).format(startDateFormat), moment(new Date()).format(endDateFormat)],
            getValueFromEvent: getValueFromEventForSearchDate,
            getValueProps: getValuePropsForSearchDate,
          })(<BrandSalesSearchDate/>)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('brandIds', {
            rules: [
              {
                required :true,
                message: '브랜드를 선택해 주세요',
              }
            ]
          })(<BrandSalesMultiSearch setSelectedBrand={setSelectedBrand} selectedBrand={selectedBrand}/>)}
        </Form.Item>
        <Form.Item>
          <Button onClick={handleSearch} type="primary" style={{ marginRight: 5 }}>
            검색
          </Button>
          <Button onClick={handleReset}>초기화</Button>
        </Form.Item>
      </Form>
    </>
  );
});

export default BrandSalesSearchBar;
