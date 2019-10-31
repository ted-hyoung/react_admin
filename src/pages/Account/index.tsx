// base
import React, { useCallback, useEffect, useState, useRef, Dispatch, SetStateAction } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactToPrint from 'react-to-print';

// store
import { StoreState } from 'store';
import {
  getOrdersAsync,
  getOrdersExcelAsync,
  clearOrderExcel,
  getOrderByIdAsync,
  cancelPaymentVirtualAccountAsync,
} from 'store/reducer/order';
// modules
import { Table, Button, Row, Col, Select, Modal, message, Statistic } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';

// lib
import { payCancelHost } from 'lib/protocols';

// containers
import { OrderSearchBar, OrderDetailModal, AccountSearchBar } from 'containers';

// utils
import { startDateFormat, endDateFormat, dateTimeFormat, createExcel } from 'lib/utils';


// defines
const { Option } = Select;
const { confirm } = Modal;
const defaultSearchCondition = {
  startDate: moment(new Date()).format(startDateFormat),
  endDate: moment(new Date()).format(endDateFormat),
};


const Account = () => {
  const dispatch = useDispatch();

  return (
    <div className="account">
      <AccountSearchBar
        onSearch={value => console.log('onSearch : ' ,value)}
        onReset={() => (alert('onReset'))}
      />
    </div>
  );
};

export default Account;
