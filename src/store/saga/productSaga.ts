// base
import { call, put, takeEvery } from 'redux-saga/effects';

// lib
import * as Api from 'lib/protocols';

// action
import { RequestAsyncAction } from 'models/AsyncAction';
import * as Action from 'store/action/productAction';

// reducer
import {
  createProductAsync,
  updateProductAsync,
  deleteProductsAsync,
  soldOutProductsAsync,
  statisticsProductSalesAsync,
  statisticsProductExcelAsync,
  createProductNoticeAsync,
  updateProductNoticeAsync,
  deleteProductNoticeAsync,
} from 'store/reducer/product';
import { getEventByIdAsync } from 'store/reducer/event';
import { message } from 'antd';
import qs from 'qs';

function* createProduct(action: RequestAsyncAction) {
  try {
    const { eventId, data } = action.payload;
    const res = yield call(() => Api.post(`/events/${eventId}/product`, data));
    yield put(createProductAsync.success(res.data));
    yield put(
      getEventByIdAsync.request({
        id: eventId,
      }),
    );
    message.success('제품 정보를 등록하였습니다.');
  } catch (error) {
    yield put(createProductAsync.failure(error));
    message.error('제품 정보 등록에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}

function* updateProduct(action: RequestAsyncAction) {
  try {
    const { eventId, productId, data } = action.payload;
    const res = yield call(() => Api.put(`/products/${productId}`, data));
    yield put(updateProductAsync.success(res.data));
    yield put(
      getEventByIdAsync.request({
        id: eventId,
      }),
    );
    message.success('제품 정보를 수정했습니다.');
  } catch (error) {
    yield put(updateProductAsync.failure(error));
    message.error('제품 정보 수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}

function* deleteProduct(action: RequestAsyncAction) {
  try {
    const { eventId, data } = action.payload;
    const res = yield call(() => Api.del(`/events/${eventId}/products`, { data }));
    yield put(deleteProductsAsync.success(res.data));
    yield put(
      getEventByIdAsync.request({
        id: eventId,
      }),
    );
    message.success('해당 제품을 삭제했습니다.');
  } catch (error) {
    yield put(deleteProductsAsync.failure(error));
    message.error('해당 제품 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}

function* soldOutProduct(action: RequestAsyncAction) {
  try {
    const { eventId, data } = action.payload;
    const res = yield call(() => Api.put(`/products/sold-out`, data));
    yield put(soldOutProductsAsync.success(res.data));
    yield put(
      getEventByIdAsync.request({
        id: eventId,
      }),
    );
    message.success('해당 제품을 품절처리 또는 품절해제를 처리하였습니다.');
  } catch (error) {
    yield put(soldOutProductsAsync.failure(error));
    message.error('해당 제품을 품절처리 또는 품절해제를 실패하였습니다.');
  }
}

function* getProductStatistics(action: RequestAsyncAction) {
  try {
    const { searchCondition } = action.payload;

    const res = yield call(() =>
      Api.get('/management/products/statistics', {
        params: {
          ...searchCondition,
        },
        paramsSerializer: (params: any) => qs.stringify(params, { arrayFormat: 'indices', allowDots: true }),
      }),
    );
    yield put(statisticsProductSalesAsync.success(res.data));
  } catch (error) {
    yield put(statisticsProductSalesAsync.failure(error));
  }
}

function* getProductStatisticsExcel(action: RequestAsyncAction) {
  try {
    const { searchCondition } = action.payload;
    const res = yield call(() =>
      Api.get('/management/products/statistics', {
        params: {
          ...searchCondition,
        },
        paramsSerializer: (params: any) => qs.stringify(params, { arrayFormat: 'indices', allowDots: true }),
      }),
    );
    yield put(statisticsProductExcelAsync.success(res.data));
  } catch (error) {
    yield put(statisticsProductExcelAsync.failure(error));
  }
}

function* createProductNotice(action: RequestAsyncAction) {
  try {
    const { eventId, data } = action.payload;
    const res = yield call(() =>
      Api.post(`/provision/${eventId}`, {
        productProvisions: [...data],
      }),
    );
    yield put(createProductNoticeAsync.success(res.data));
    yield put(getEventByIdAsync.request({ id: eventId }));
    message.success('상품 정보를 등록하였습니다.');
  } catch (error) {
    yield put(createProductNoticeAsync.failure(error));
    message.error('상품 정보 등록에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}

function* updateProductNotice(action: RequestAsyncAction) {
  try {
    const { eventId, data } = action.payload;
    const res = yield call(() =>
      Api.put(`/provision/${eventId}`, {
        productProvisions: [...data],
      }),
    );
    yield put(updateProductNoticeAsync.success(res.data));
    yield put(getEventByIdAsync.request({ id: eventId }));
    message.success('상품 정보를 수정했습니다.');
  } catch (error) {
    yield put(updateProductNoticeAsync.failure(error));
    message.error('상품 정보 수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}

function* deleteProductNotice(action: RequestAsyncAction) {
  try {
    const { eventId, data } = action.payload;
    const data2 = {
      productProvisions: [{ ...data }],
    };
    console.log(eventId, data2);
    // const res = yield call(() => Api.del(`/events/${eventId}/products`, {data}));
    // yield put(deleteProductsAsync.success(res.data));
    message.success('상품 제품을 삭제했습니다.');
  } catch (error) {
    yield put(deleteProductNoticeAsync.failure(error));
    message.error('상품 제품 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
}

export default function* productSaga() {
  yield takeEvery(Action.CREATE_PRODUCTS_REQUEST, createProduct);
  yield takeEvery(Action.UPDATE_PRODUCTS_REQUEST, updateProduct);
  yield takeEvery(Action.DELETED_PRODUCTS_REQUEST, deleteProduct);
  yield takeEvery(Action.SOLD_OUT_PRODUCTS_REQUEST, soldOutProduct);
  yield takeEvery(Action.STATISTICS_PRODUCTS_REQUEST, getProductStatistics);
  yield takeEvery(Action.STATISTICS_PRODUCTS_EXCEL_REQUEST, getProductStatisticsExcel);
  yield takeEvery(Action.CREATE_PRODUCT_NOTICE_REQUEST, createProductNotice);
  yield takeEvery(Action.UPDATE_PRODUCT_NOTICE_REQUEST, updateProductNotice);
  // yield takeEvery(Action.DELETED_PRODUCT_NOTICE_REQUEST, deleteProductNotice);
}
