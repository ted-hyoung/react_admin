// base
import React, { useCallback, useState } from 'react';

// modules
import Form, { FormComponentProps } from 'antd/lib/form';
import { Button, Checkbox } from 'antd';
import moment from 'moment';

// components
import OrderSearchDate, {
  getValueFromEventForSearchDate,
  getValuePropsForSearchDate,
  validateDate,
} from 'components/order/OrderSearchDate';

// utils
import { startDateFormat, endDateFormat } from 'lib/utils';

// enums
import { PAYMENT_STATUSES, SHIPPING_STATUSES, DEFAULT_PAYMENT_STATUSES, DEFAULT_SHIPPING_STATUSES } from 'enums';

// assets
import './index.less';

interface Props extends FormComponentProps {
  onSearch: (value: { [props: string]: any }) => void;
  onReset: () => void;
}

const OrderSearchBar = Form.create<Props>()((props: Props) => {
  const { form, onSearch, onReset } = props;
  const { getFieldDecorator, validateFields, setFieldsValue, resetFields } = form;

  const [paymentChaeckALl, setPaymentCheckAll] = useState(true);
  const [shippingCheckAll, setShippingCheckAll] = useState(true);

  const handleChangePaymentStatuses = useCallback(values => {
    setPaymentCheckAll(values.length === PAYMENT_STATUSES.length);
  }, []);

  const handleChangeShippingStatuses = useCallback(values => {
    setShippingCheckAll(values.length === SHIPPING_STATUSES.length);
  }, []);

  const handleChangePaymentStatusesAll = useCallback(e => {
    setFieldsValue({
      paymentStatuses: e.target.checked ? DEFAULT_PAYMENT_STATUSES : [],
    });
    setPaymentCheckAll(e.target.checked);
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
          if (key === 'paymentStatuses') {
            if (paymentChaeckALl) {
              delete val[key];
              return;
            }
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
  }, [onSearch, paymentChaeckALl, shippingCheckAll]);

  const handleReset = useCallback(() => {
    resetFields();
    setPaymentCheckAll(true);
    setShippingCheckAll(true);
    onReset();
  }, [onReset]);

  return (
    <Form className="order-search-bar">
      <Form.Item>
        {getFieldDecorator('date', {
          initialValue: [moment(new Date()).format(startDateFormat), moment(new Date()).format(endDateFormat)],
          getValueFromEvent: getValueFromEventForSearchDate,
          getValueProps: getValuePropsForSearchDate,
        })(<OrderSearchDate />)}
      </Form.Item>
      <Form.Item>
        <Checkbox onChange={handleChangePaymentStatusesAll} checked={paymentChaeckALl}>
          전체
        </Checkbox>
        {getFieldDecorator('paymentStatuses', {
          initialValue: DEFAULT_PAYMENT_STATUSES,
        })(<Checkbox.Group options={PAYMENT_STATUSES} onChange={handleChangePaymentStatuses} />)}
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

export default OrderSearchBar;
