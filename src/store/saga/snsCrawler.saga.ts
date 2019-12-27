// base
import { put, call, takeLatest } from 'redux-saga/effects';
import qs from 'qs';

// lib
import * as Api from 'lib/protocols';

// actions
import { PayloadAction } from 'typesafe-actions';
import * as Actions from 'store/action/snsCrawler.action';
import {
  getSnsCrawlerAsync
} from 'store/action/snsCrawler.action';


function* getSnsCrawler(action: PayloadAction<string, { snsUrl: string }>) {
  const { snsUrl } = action.payload;

  try {
    const res = yield call(() =>
      Api.get(`/sns/crawler`, {
        params: { snsUrl },
        paramsSerializer: (params: any) => qs.stringify(params, { arrayFormat: 'indices', allowDots: true }),
      }),
    );

    yield put(getSnsCrawlerAsync.success(res.data));
  } catch (error) {
    yield put(getSnsCrawlerAsync.failure(error));
  }
}

export default function* snsCrawlerSaga() {
  yield takeLatest(Actions.GET_SNS_CRAWLER_REQUEST, getSnsCrawler);
}
