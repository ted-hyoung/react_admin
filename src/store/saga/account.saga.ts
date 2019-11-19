// base
import { put, call, takeLatest, takeEvery, select } from 'redux-saga/effects';
import { replace } from 'connected-react-router';
import { message } from 'antd';
import qs from 'qs';

// lib
import * as Api from 'lib/protocols';
import { PaymentMethod, PaymentStatus, ShippingStatus, SocialProviderCode } from 'enums';
// actions
import { PayloadAction, ActionType } from 'typesafe-actions';
import * as Actions from 'store/action/account.action';
import {
  getAccountsAsync,
  getAccountDetailAsync,
  getAccountOrdersAsync
} from 'store/action/account.action';

// models
import {
  PageWrapper,
  RequestAsyncAction,
  ResponseAccounts, ResponseOrderAccount, SearchAccounts, SearchExperienceGroupConsumer,
} from 'models';
import { getOrdersAsync } from '../reducer/order';
import { GET_ACCOUNT_ORDERS_SUCCESS } from 'store/action/account.action';
import { parseParams } from '../../lib/utils';
import { Simulate } from 'react-dom/test-utils';

function* getOrders(action: RequestAsyncAction) {
  try {
    const { page, size, searchCondition } = action.payload;

    const res = yield call(() =>
      Api.get('/orders', {
        params: {
          page,
          size,
          ...searchCondition,
        },
        paramsSerializer: (params: any) => qs.stringify(params, { arrayFormat: 'indices', allowDots: true }),
      }),
    );
    yield put(getOrdersAsync.success(res));
  } catch (error) {
    yield put(getOrdersAsync.failure(error));
  }
}

function* getAccounts(action: RequestAsyncAction) {
  const { page, size, searchCondition } = action.payload;

  console.log(page);
  console.log(size);
  console.log(searchCondition);
  try {
    // const res = yield call(() =>
    //   Api.get('/consumers', {
    //     params: {
    //       page,
    //       size,
    //       ...searchCondition,
    //     },
    //     paramsSerializer: (params: any) => qs.stringify(params, { arrayFormat: 'indices', allowDots: true }),
    //   }),
    // );

    const res = yield call(() =>
      Api.get('/consumers/', {
        params: { page, size, ...searchCondition},
        paramsSerializer: (params: any) => parseParams(params),
      }),
    );

    // const res = {
    //   data :{
    //     content: [
    //       {
    //         created: '2019-08-31 01:52:47.653109',
    //         username: '이종현1',
    //         loginId: 'ljh01',
    //         consumerId: '01091024572',
    //         socialProvider: SocialProviderCode.미연동,
    //         phone: '01091024572',
    //         marketingInfoAgree : true
    //       },
    //       {
    //         created: '2019-08-31 01:52:47.653109',
    //         username: '이성희2',
    //         loginId: 'ljh01',
    //         consumerId: '01036517664',
    //         socialProvider: SocialProviderCode.네이버,
    //         phone: '01036517664',
    //         marketingInfoAgree : false
    //       },
    //       {
    //         created: '2019-08-31 01:52:47.653109',
    //         username: '유호민3',
    //         loginId: 'ljh01',
    //         consumerId: '01029274132',
    //         socialProvider: SocialProviderCode.네이버,
    //         phone: '01029274132',
    //         marketingInfoAgree : false
    //       },
    //       {
    //         created: '2019-08-31 01:52:47.653109',
    //         username: '김태형4',
    //         loginId: 'ljh01',
    //         consumerId: '01098769162',
    //         socialProvider: SocialProviderCode.카카오,
    //         phone: '01098769162',
    //         marketingInfoAgree : true
    //       },
    //       {
    //         created: '2019-08-31 01:52:47.653109',
    //         username: '진강근5',
    //         loginId: 'ljh01',
    //         consumerId: '01030648401',
    //         socialProvider: SocialProviderCode.카카오,
    //         phone: '01030648401',
    //         marketingInfoAgree : false
    //       },{
    //         created: '2019-08-31 01:52:47.653109',
    //         username: '이종현6',
    //         loginId: 'ljh01',
    //         consumerId: '01091024572',
    //         socialProvider: SocialProviderCode.카카오,
    //         phone: '01091024572',
    //         marketingInfoAgree : true
    //       },
    //       {
    //         created: '2019-08-31 01:52:47.653109',
    //         username: '이성희7',
    //         loginId: 'ljh01',
    //         consumerId: '01036517664',
    //         socialProvider: SocialProviderCode.카카오,
    //         phone: '01091024472',
    //         marketingInfoAgree : false
    //       },
    //       {
    //         created: '2019-08-31 01:52:47.653109',
    //         username: '유호민8',
    //         loginId: 'ljh01',
    //         consumerId: '01029274132',
    //         socialProvider: SocialProviderCode.네이버,
    //         phone: '01029274132',
    //         marketingInfoAgree : false
    //       },
    //       {
    //         created: '2019-08-31 01:52:47.653109',
    //         username: '김태형9',
    //         loginId: 'ljh01',
    //         consumerId: '01098769162',
    //         socialProvider: SocialProviderCode.네이버,
    //         phone: '01098769162',
    //         marketingInfoAgree : true
    //       },
    //       {
    //         created: '2019-08-31 01:52:47.653109',
    //         username: '진강근10',
    //         loginId: 'ljh01',
    //         consumerId: '01030648401',
    //         socialProvider: SocialProviderCode.카카오,
    //         phone: '01030648401',
    //         marketingInfoAgree : false
    //       },{
    //         created: '2019-08-31 01:52:47.653109',
    //         username: '이종현11',
    //         loginId: 'ljh01',
    //         consumerId: '01091024572',
    //         socialProvider: SocialProviderCode.네이버,
    //         phone: '01091024572',
    //         marketingInfoAgree : true
    //       },
    //       {
    //         created: '2019-08-31 01:52:47.653109',
    //         username: '이성희12',
    //         loginId: 'ljh01',
    //         consumerId: '01036517664',
    //         socialProvider: SocialProviderCode.카카오,
    //         phone: '01036517664',
    //         marketingInfoAgree : false
    //       },
    //       {
    //         created: '2019-08-31 01:52:47.653109',
    //         username: '유호민13',
    //         loginId: 'ljh01',
    //         consumerId: '01029274132',
    //         socialProvider: SocialProviderCode.카카오,
    //         phone: '01029274132',
    //         marketingInfoAgree : false
    //       },
    //       {
    //         created: '2019-08-31 01:52:47.653109',
    //         username: '김태형14',
    //         loginId: 'ljh01',
    //         consumerId: '01098769162',
    //         socialProvider: SocialProviderCode.카카오,
    //         phone: '01098769162',
    //         marketingInfoAgree : true
    //       },
    //       {
    //         created: '2019-08-31 01:52:47.653109',
    //         username: '진강근15',
    //         loginId: 'ljh01',
    //         consumerId: '01030648401',
    //         socialProvider: SocialProviderCode.카카오,
    //         phone: '01030648401',
    //         marketingInfoAgree : false
    //       }
    //     ],
    //     first: false,
    //     last: false,
    //     totalElements: 15,
    //     totalPages: 2,
    //     page: 0,
    //     size: 10,
    //   }
    // };
    yield put(getAccountsAsync.success(res.data));
  } catch (error) {
    yield put(getAccountsAsync.failure(error));
  }
}

function* getDetailAccount(action: RequestAsyncAction) {
  const { consumerId } = action.payload;

  try {
   const res = yield call(() => Api.get('/consumers/'+consumerId));

    // const res = {
    //         consumerId: '01091024572',
    //         created: '2019-08-31 01:52:47.653109',
    //         loginId: 'ljh01',
    //         username: '이종현15',
    //         phone: '01091024572',
    //         email: 'lhh@naver.com',
    //         socialProvider: SocialProviderCode.미연동,
    //         marketingInfoAgree : true
    //       };

    yield put(getAccountDetailAsync.success(res.data));
  } catch (error) {
    yield put(getAccountDetailAsync.failure(error));
  }
}

function* getAccountOrders(action: RequestAsyncAction) {
  const { page, size, consumerId } = action.payload;

  try {
    const res = yield call(() =>
      Api.get('/consumers/'+consumerId+'/orders', {
        params: { page, size },
        paramsSerializer: (params: any) => parseParams(params),
      }),
    );
    // const res = {data : {
    //   loginId: 'ljh01',
    //   username: '이종현',
    //   totalOrderCompleteAmount:569000,
    //   orders: {
    //     first: false,
    //     last: false,
    //     totalElements: 5,
    //     totalPages: 0,
    //     page: 0,
    //     size: 10,
    //     content : [
    //       {
    //         orderId: 2029938804903,
    //         created: '2019-08-31 01:52:47.653109',
    //         orderNo: 'order_2019',
    //         totalAmount: 569000,
    //         paymentMethod: PaymentMethod.CARD,
    //         paymentStatuses: PaymentStatus.COMPLETE,
    //         shippingStatuses: ShippingStatus.COMPLETE,
    //       },
    //       {
    //         orderId: 2029938804903,
    //         created: '2019-08-31 01:52:47.653109',
    //         orderNo: 'order_2019',
    //         totalAmount: 569000,
    //         paymentMethod: PaymentMethod.CARD,
    //         paymentStatuses: PaymentStatus.COMPLETE,
    //         shippingStatuses: ShippingStatus.COMPLETE,
    //       },
    //       {
    //         orderId: 2029938804903,
    //         created: '2019-08-31 01:52:47.653109',
    //         orderNo: 'order_2019',
    //         totalAmount: 569000,
    //         paymentMethod: PaymentMethod.CARD,
    //         paymentStatuses: PaymentStatus.COMPLETE,
    //         shippingStatuses: ShippingStatus.COMPLETE,
    //       },
    //       {
    //         orderId: 2029938804903,
    //         created: '2019-08-31 01:52:47.653109',
    //         orderNo: 'order_2019',
    //         totalAmount: 569000,
    //         paymentMethod: PaymentMethod.CARD,
    //         paymentStatuses: PaymentStatus.COMPLETE,
    //         shippingStatuses: ShippingStatus.COMPLETE,
    //       },
    //       {
    //         orderId: 2029938804903,
    //         created: '2019-08-31 01:52:47.653109',
    //         orderNo: 'order_2019',
    //         totalAmount: 569000,
    //         paymentMethod: PaymentMethod.CARD,
    //         paymentStatuses: PaymentStatus.COMPLETE,
    //         shippingStatuses: ShippingStatus.COMPLETE,
    //       },{
    //         orderId: 2029938804903,
    //         created: '2019-08-31 01:52:47.653109',
    //         orderNo: 'order_2019',
    //         totalAmount: 569000,
    //         paymentMethod: PaymentMethod.CARD,
    //         paymentStatuses: PaymentStatus.COMPLETE,
    //         shippingStatuses: ShippingStatus.COMPLETE,
    //       },
    //       {
    //         orderId: 2029938804903,
    //         created: '2019-08-31 01:52:47.653109',
    //         orderNo: 'order_2019',
    //         totalAmount: 569000,
    //         paymentMethod: PaymentMethod.CARD,
    //         paymentStatuses: PaymentStatus.COMPLETE,
    //         shippingStatuses: ShippingStatus.COMPLETE,
    //       },
    //       {
    //         orderId: 2029938804903,
    //         created: '2019-08-31 01:52:47.653109',
    //         orderNo: 'order_2019',
    //         totalAmount: 569000,
    //         paymentMethod: PaymentMethod.CARD,
    //         paymentStatuses: PaymentStatus.COMPLETE,
    //         shippingStatuses: ShippingStatus.COMPLETE,
    //       },
    //       {
    //         orderId: 2029938804903,
    //         created: '2019-08-31 01:52:47.653109',
    //         orderNo: 'order_2019',
    //         totalAmount: 569000,
    //         paymentMethod: PaymentMethod.CARD,
    //         paymentStatuses: PaymentStatus.COMPLETE,
    //         shippingStatuses: ShippingStatus.COMPLETE,
    //       },
    //       {
    //         orderId: 2029938804903,
    //         created: '2019-08-31 01:52:47.653109',
    //         orderNo: 'order_2019',
    //         totalAmount: 569000,
    //         paymentMethod: PaymentMethod.CARD,
    //         paymentStatuses: PaymentStatus.COMPLETE,
    //         shippingStatuses: ShippingStatus.COMPLETE,
    //       },
    //     ]
    //   }
    // }};

    yield put(getAccountOrdersAsync.success(res.data));
  } catch (error) {
    yield put(getAccountOrdersAsync.failure(error));
  }
}


export default function* accountSaga() {
  yield takeLatest(Actions.GET_ACCOUNTS_REQUEST, getAccounts);
  yield takeLatest(Actions.GET_ACCOUNT_DETAIL_REQUEST, getDetailAccount);
  yield takeLatest(Actions.GET_ACCOUNT_ORDERS_REQUEST, getAccountOrders);
}
