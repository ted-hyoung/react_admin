// base
import { call, put, takeEvery } from 'redux-saga/effects';

// modules
import { message } from 'antd';

// lib
import * as Api from 'lib/protocols';

// action
import { RequestAsyncAction } from 'types/AsyncAction';
import * as Action from 'store/action/brandAction';

// reducer
import { getBrandsAsync } from 'store/reducer/brand';
import qs from 'qs';
import { getOrdersAsync, getStatisticsDailySalesAsync } from '../reducer/order';
import { parseParams } from '../../lib/utils';

function* getBrands(action: RequestAsyncAction) {
  try {
    const res = yield call(() => Api.get('/brands'));
    yield put(getBrandsAsync.success(res.data));
  } catch (error) {
    yield put(getBrandsAsync.failure(error));
    message.error('브랜드 정보를 가져오는데 실패하였습니다.');
  }
}

function* getStatisticsBrandSales(action: RequestAsyncAction) {
  try {
    const { searchCondition } = action.payload;

    const res = yield call(() =>
      Api.get('/management/brands/statistics', {
        params: {
          ...searchCondition,
        },
        paramsSerializer: (params: any) => parseParams(params),
      }),
    );
    yield put(getStatisticsDailySalesAsync.success(res));
  } catch (error) {
    yield put(getStatisticsDailySalesAsync.failure(error));
    yield message.error(error);
  }
}

export default function* brandSaga() {
  yield takeEvery(Action.GET_EVENT_BRANDS_REQUEST, getBrands);
}
