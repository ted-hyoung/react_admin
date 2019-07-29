// base
import React, { useCallback, useState } from 'react';

// modules
import Form, { FormComponentProps } from 'antd/lib/form';
import { Button, Checkbox } from 'antd';

// components
import OrderSearchDate, {
  getValueFromEventForSearchDate,
  getValuePropsForSearchDate,
  validateDate,
} from 'components/order/OrderSearchDate';

// enums
import { SHIPPING_STATUSES, DEFAULT_SHIPPING_STATUSES } from 'enums';

// assets
import './index.less';

interface Props extends FormComponentProps {
  onSearch: (value: { [props: string]: any }) => void;
  onReset: () => void;
}

const ShippingSearchBar = Form.create<Props>()((props: Props) => {
  const { form, onSearch, onReset } = props;
  const { getFieldDecorator, validateFields, setFieldsValue, resetFields } = form;

  const [shippingCheckAll, setShippingCheckAll] = useState(true);

  const handleChangeShippingStatuses = useCallback(values => {
    setShippingCheckAll(values.length === SHIPPING_STATUSES.length);
  }, []);

  const handleChangeShippingStatusesAll = useCallback(e => {
    setFieldsValue({
      shippingStatuses: e.target.checked ? DEFAULT_SHIPPING_STATUSES : [],
    });
    setShippingCheckAll(e.target.checked);
  }, []);

  const handleSearch = useCallback(() => {
    validateFields((err, val) => {
      if (!err) {
        Object.keys(val).forEach(key => {
          if (val[key] === undefined) {
            delete val[key];
            return;
          }
          if (key === 'date') {
            validateDate(val, 'date');
            return;
          }
          if (key === 'shippingStatuses') {
            if (shippingCheckAll) {
              delete val[key];
              return;
            }
          }
        });
        onSearch(val);
      }
    });
  }, [onSearch, shippingCheckAll]);

  const handleReset = useCallback(() => {
    resetFields();
    setShippingCheckAll(true);
    onReset();
  }, [onReset]);

  return (
    <Form className="shipping-search-bar">
      <Form.Item>
        {getFieldDecorator('date', {
          getValueFromEvent: getValueFromEventForSearchDate,
          getValueProps: getValuePropsForSearchDate,
        })(<OrderSearchDate />)}
      </Form.Item>
      <Form.Item>
        <Checkbox onChange={handleChangeShippingStatusesAll} checked={shippingCheckAll}>
          전체
        </Checkbox>
        {getFieldDecorator('shippingStatuses', {
          initialValue: DEFAULT_SHIPPING_STATUSES,
        })(<Checkbox.Group options={SHIPPING_STATUSES} onChange={handleChangeShippingStatuses} />)}
      </Form.Item>
      <Form.Item>
        <Button onClick={handleSearch} type="primary" style={{ marginRight: 5 }}>
          검색
        </Button>
        <Button onClick={handleReset}>초기화</Button>
      </Form.Item>
    </Form>
  );
});

export default ShippingSearchBar;
