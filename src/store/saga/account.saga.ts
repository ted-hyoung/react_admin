// base
import { put, call, takeLatest } from 'redux-saga/effects';
import { message } from 'antd';
import qs from 'qs';

// lib
import * as Api from 'lib/protocols';
import { parseParams } from 'lib/utils';

// actions
import * as Actions from 'store/action/account.action';
import {
  getAccountsAsync,
  getAccountDetailAsync,
  getAccountOrdersAsync,
  updateAccountAsync,
} from 'store/action/account.action';

// models
import { RequestAsyncAction } from 'models';

function* getAccounts(action: RequestAsyncAction) {
  const { page, size, searchCondition } = action.payload;

  try {
    const res = yield call(() =>
      Api.get('/consumers/', {
        params: { page, size, ...searchCondition},
        paramsSerializer: (params: any) => parseParams(params),
      }),
    );
    yield put(getAccountsAsync.success(res.data));
  } catch (error) {
    yield put(getAccountsAsync.failure(error));
  }
}

function* getDetailAccount(action: RequestAsyncAction) {
  const { consumerId } = action.payload;

  try {
   const res = yield call(() => Api.get('/consumers/'+consumerId));
    yield put(getAccountDetailAsync.success(res.data));
  } catch (error) {
    yield put(getAccountDetailAsync.failure(error));
  }
}

function* getAccountOrders(action: RequestAsyncAction) {
  const { page, size, consumerId } = action.payload;

  try {
    const res = yield call(() =>
      Api.get(`/consumers/${consumerId}/orders`, {
        params: { page, size },
        paramsSerializer: (params: any) => qs.stringify(params, { arrayFormat: 'indices', allowDots: true }),
      }),
    );
    yield put(getAccountOrdersAsync.success(res.data));
  } catch (error) {
    yield put(getAccountOrdersAsync.failure(error));
  }
}

function* updateAccount(action: RequestAsyncAction) {
  try {
    const { marketingInfoAgree, phone, consumerId } = action.payload;



    const res = yield call(() => Api.put(`/consumers/${consumerId}`, {marketingInfoAgree, phone}));
    yield put(updateAccountAsync.success(action.payload));
    message.success('사용자 정보를 수정했습니다.');
  } catch (error) {
    yield put(updateAccountAsync.failure(error));
    message.error('사용자 정보 수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}

export default function* accountSaga() {
  yield takeLatest(Actions.GET_ACCOUNTS_REQUEST, getAccounts);
  yield takeLatest(Actions.GET_ACCOUNT_DETAIL_REQUEST, getDetailAccount);
  yield takeLatest(Actions.GET_ACCOUNT_ORDERS_REQUEST, getAccountOrders);
  yield takeLatest(Actions.UPDATE_ACCOUNT_REQUEST, updateAccount);
}
