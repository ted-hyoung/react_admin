// base
import { put, call, takeLatest, takeEvery, select } from 'redux-saga/effects';
import { replace } from 'connected-react-router';
import { message } from 'antd';
import qs from 'qs';

// lib
import * as Api from 'lib/protocols';
import { SocialProviderCode } from 'enums';
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
            username: '이종현1',
            consumerId: '01091024572',
            socialProvider: SocialProviderCode.카카오,
            phone: '01091024572',
            marketingInfoAgree : true
          },
          {
            created: '2019-08-31 01:52:47.653109',
            username: '이성희2',
            consumerId: '01036517664',
            socialProvider: SocialProviderCode.네이버,
            phone: '01036517664',
            marketingInfoAgree : false
          },
          {
            created: '2019-08-31 01:52:47.653109',
            username: '유호민3',
            consumerId: '01029274132',
            socialProvider: SocialProviderCode.네이버,
            phone: '01029274132',
            marketingInfoAgree : false
          },
          {
            created: '2019-08-31 01:52:47.653109',
            username: '김태형4',
            consumerId: '01098769162',
            socialProvider: SocialProviderCode.카카오,
            phone: '01098769162',
            marketingInfoAgree : true
          },
          {
            created: '2019-08-31 01:52:47.653109',
            username: '진강근5',
            consumerId: '01030648401',
            socialProvider: SocialProviderCode.카카오,
            phone: '01030648401',
            marketingInfoAgree : false
          },{
            created: '2019-08-31 01:52:47.653109',
            username: '이종현6',
            consumerId: '01091024572',
            socialProvider: SocialProviderCode.카카오,
            phone: '01091024572',
            marketingInfoAgree : true
          },
          {
            created: '2019-08-31 01:52:47.653109',
            username: '이성희7',
            consumerId: '01036517664',
            socialProvider: SocialProviderCode.카카오,
            phone: '01091024472',
            marketingInfoAgree : false
          },
          {
            created: '2019-08-31 01:52:47.653109',
            username: '유호민8',
            consumerId: '01029274132',
            socialProvider: SocialProviderCode.네이버,
            phone: '01029274132',
            marketingInfoAgree : false
          },
          {
            created: '2019-08-31 01:52:47.653109',
            username: '김태형9',
            consumerId: '01098769162',
            socialProvider: SocialProviderCode.네이버,
            phone: '01098769162',
            marketingInfoAgree : true
          },
          {
            created: '2019-08-31 01:52:47.653109',
            username: '진강근10',
            consumerId: '01030648401',
            socialProvider: SocialProviderCode.카카오,
            phone: '01030648401',
            marketingInfoAgree : false
          },{
            created: '2019-08-31 01:52:47.653109',
            username: '이종현11',
            consumerId: '01091024572',
            socialProvider: SocialProviderCode.네이버,
            phone: '01091024572',
            marketingInfoAgree : true
          },
          {
            created: '2019-08-31 01:52:47.653109',
            username: '이성희12',
            consumerId: '01036517664',
            socialProvider: SocialProviderCode.카카오,
            phone: '01036517664',
            marketingInfoAgree : false
          },
          {
            created: '2019-08-31 01:52:47.653109',
            username: '유호민13',
            consumerId: '01029274132',
            socialProvider: SocialProviderCode.카카오,
            phone: '01029274132',
            marketingInfoAgree : false
          },
          {
            created: '2019-08-31 01:52:47.653109',
            username: '김태형14',
            consumerId: '01098769162',
            socialProvider: SocialProviderCode.카카오,
            phone: '01098769162',
            marketingInfoAgree : true
          },
          {
            created: '2019-08-31 01:52:47.653109',
            username: '진강근15',
            consumerId: '01030648401',
            socialProvider: SocialProviderCode.카카오,
            phone: '01030648401',
            marketingInfoAgree : false
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
