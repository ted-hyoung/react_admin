// base
import { put, call, takeLatest, takeEvery, select } from 'redux-saga/effects';
import { replace } from 'connected-react-router';
import { message } from 'antd';
import qs from 'qs';

// lib
import * as Api from 'lib/protocols';

// actions
import { PayloadAction, ActionType } from 'typesafe-actions';
import * as Actions from 'store/action/account.action';
import {
  getAccountsAsync
} from 'store/action/account.action';

// models
import {
  RequestAsyncAction,
  ResponseAccounts, SearchAccounts, SearchExperienceGroupConsumer,
} from 'models';
import { getOrdersAsync } from '../reducer/order';

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

  try {
    // const res = yield call(() =>
    //   Api.get('/orders', {
    //     params: {
    //       page,
    //       size,
    //       ...searchCondition,
    //     },
    //     paramsSerializer: (params: any) => qs.stringify(params, { arrayFormat: 'indices', allowDots: true }),
    //   }),
    // );

    const res = {
      data :{
        content: [
          {
            created: '2019-08-31 01:52:47.653109',
            userName: '이종현1',
            loginId: '01091024572',
            loginMethod: '카카오톡',
            grade:'1',
            phone: '01091024572',
            isAdvertise : true
          },
          {
            created: '2019-08-31 01:52:47.653109',
            userName: '이성희2',
            loginId: '01036517664',
            loginMethod: '카카오톡',
            grade:'1',
            phone: '01036517664',
            isAdvertise : false
          },
          {
            created: '2019-08-31 01:52:47.653109',
            userName: '유호민3',
            loginId: '01029274132',
            loginMethod: '카카오톡',
            grade:'2',
            phone: '01029274132',
            isAdvertise : false
          },
          {
            created: '2019-08-31 01:52:47.653109',
            userName: '김태형4',
            loginId: '01098769162',
            loginMethod: '카카오톡',
            grade:'3',
            phone: '01098769162',
            isAdvertise : true
          },
          {
            created: '2019-08-31 01:52:47.653109',
            userName: '진강근5',
            loginId: '01030648401',
            loginMethod: '카카오톡',
            grade:'4',
            phone: '01030648401',
            isAdvertise : false
          },{
            created: '2019-08-31 01:52:47.653109',
            userName: '이종현6',
            loginId: '01091024572',
            loginMethod: '카카오톡',
            grade:'1',
            phone: '01091024572',
            isAdvertise : true
          },
          {
            created: '2019-08-31 01:52:47.653109',
            userName: '이성희7',
            loginId: '01036517664',
            loginMethod: '카카오톡',
            grade:'1',
            phone: '01036517664',
            isAdvertise : false
          },
          {
            created: '2019-08-31 01:52:47.653109',
            userName: '유호민8',
            loginId: '01029274132',
            loginMethod: '카카오톡',
            grade:'2',
            phone: '01029274132',
            isAdvertise : false
          },
          {
            created: '2019-08-31 01:52:47.653109',
            userName: '김태형9',
            loginId: '01098769162',
            loginMethod: '카카오톡',
            grade:'3',
            phone: '01098769162',
            isAdvertise : true
          },
          {
            created: '2019-08-31 01:52:47.653109',
            userName: '진강근10',
            loginId: '01030648401',
            loginMethod: '카카오톡',
            grade:'4',
            phone: '01030648401',
            isAdvertise : false
          },{
            created: '2019-08-31 01:52:47.653109',
            userName: '이종현11',
            loginId: '01091024572',
            loginMethod: '카카오톡',
            grade:'1',
            phone: '01091024572',
            isAdvertise : true
          },
          {
            created: '2019-08-31 01:52:47.653109',
            userName: '이성희12',
            loginId: '01036517664',
            loginMethod: '카카오톡',
            grade:'1',
            phone: '01036517664',
            isAdvertise : false
          },
          {
            created: '2019-08-31 01:52:47.653109',
            userName: '유호민13',
            loginId: '01029274132',
            loginMethod: '카카오톡',
            grade:'2',
            phone: '01029274132',
            isAdvertise : false
          },
          {
            created: '2019-08-31 01:52:47.653109',
            userName: '김태형14',
            loginId: '01098769162',
            loginMethod: '카카오톡',
            grade:'3',
            phone: '01098769162',
            isAdvertise : true
          },
          {
            created: '2019-08-31 01:52:47.653109',
            userName: '진강근15',
            loginId: '01030648401',
            loginMethod: '카카오톡',
            grade:'4',
            phone: '01030648401',
            isAdvertise : false
          }
        ],
        first: false,
        last: false,
        totalElements: 15,
        totalPages: 2,
        page: 0,
        size: 10,
      }
    };
    yield put(getAccountsAsync.success(res.data));
  } catch (error) {
    yield put(getAccountsAsync.failure(error));
  }
}

export default function* accountSaga() {
  yield takeLatest(Actions.GET_ACCOUNTS_REQUEST, getAccounts);
}
