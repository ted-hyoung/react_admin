// base
import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';

// types
import { RequestAsyncAction } from 'types/AsyncAction';

// lib
import * as Api from 'lib/protocols';

// store
import * as Action from 'store/action/shippingAction';
import { getShippingAsync } from 'store/reducer/shipping';

function* getShipping(action: RequestAsyncAction) {
  try {
    const { page, size, qnaStatus, searchName } = action.payload;

    const res = yield call(() =>
      Api.get('/shipping', {
        params: {
          page,
          size,
        },
      }),
    );

    yield put(getShippingAsync.success(res.data));
  } catch (error) {
    yield put(getShippingAsync.failure(error));
  }
}

export default function* qnaSaga() {
  yield takeEvery(Action.GET_SHIPPING_REQUEST, getShipping);
}
