// base
import { put, call, takeLatest, takeEvery, select } from 'redux-saga/effects';
import { push, replace } from 'connected-react-router';
import { message } from 'antd';
import qs from 'qs';

// lib
import * as Api from 'lib/protocols';

// actions
import { PayloadAction, ActionType } from 'typesafe-actions';
import * as Actions from 'store/action/banner.action';
import {
  getBannersAsync,
  getBannersMainAsync, getCelebsAsync, updateBannersMainAsync,

} from 'store/action/banner.action';

import { BannerExposeStatus, BannerType } from '../../enums/Banner';
import { CreateBanner, CreateExperienceGroup, SelectedBanner, UpdateExperienceGroup } from '../../models';
import { createExpGroupAsync, updateExpGroupsByIdAsync } from '../action/expGroup.action';
import { deleteBannersAsync } from 'store/action/banner.action';
import { updateBannersMainSequenceAsync } from 'store/action/banner.action';
import { UpdateBanner } from '../../models/Banner';
import { getExpGroupConsumersByIdAsync } from '../action/expGroupConsumer.action';

function* getBanners(action: ActionType<typeof getBannersAsync.request>) {
  const { page, size, searchCondition } = action.payload;

  try {

    const res = yield call(() =>
      Api.get(`/banners`, {
        params: { page, size, ...searchCondition },
        paramsSerializer: (params: any) => qs.stringify(params, { arrayFormat: 'indices', allowDots: true }),
      }),
    );

    yield put(getBannersAsync.success(res.data));
  } catch (error) {
    yield put(getBannersAsync.failure(error));
  }
}

function* getBannersMain(action: ActionType<typeof getBannersMainAsync.request>) {

  try {
   const res = yield call(() => Api.get(`/banners/main`));

    yield put(getBannersMainAsync.success(res.data));
  } catch (error) {
    yield put(getBannersMainAsync.failure(error));
  }
}

function* getSelebs(action: ActionType<typeof getCelebsAsync.request>) {
  const { page, size, searchText } = action.payload;

  try {
    const res = yield call(() =>
      Api.get(`/accounts/celeb`, {
        params: { page, size, searchText },
        paramsSerializer: (params: any) => qs.stringify(params, { arrayFormat: 'indices', allowDots: true }),
      }),
    );
    yield put(getCelebsAsync.success(res.data));
  } catch (error) {
    yield put(getCelebsAsync.failure(error));
  }
}

function* createBanner(action: PayloadAction<string, CreateBanner>) {
  const data = action.payload;

  try {
    const res = yield call(() => Api.post('/banners', data));

    yield put(createExpGroupAsync.success(res.data));

    yield message.success('신규 배너 등록 되었습니다..');
    yield put(replace('/bannerAdd'));
  } catch (error) {
    yield put(createExpGroupAsync.failure(error));
  }
}

function* updateBannersMain(action: PayloadAction<string, UpdateBanner>) {
  const  data  = action.payload;
  try {
    const res = yield call(() => Api.put(`/banners/main`, data));

    yield put(updateBannersMainAsync.success(res.data));
    yield put(getBannersMainAsync.request({}));
    yield message.success('배너가 수정되었습니다.');
  } catch (error) {
    yield put(updateBannersMainAsync.failure(error));
    yield message.error(error);
  }
}


function* deleteBanners(action: PayloadAction<string, SelectedBanner>) {
  const { bannerIds } = action.payload;
    const data = {
      bannerIds
    };
  try {
    const res = yield call(() => Api.del(`/banners`, {data}));

    yield put(deleteBannersAsync.success(res.data));
    yield put(getBannersMainAsync.request({}));
    yield put(getBannersAsync.request({page:0,size:10}));
    yield message.success('배너가 삭제되었습니다.');
  } catch (error) {
    yield put(deleteBannersAsync.failure(error));
  }
}

function* updateBannersMainSequence(action: PayloadAction<string, {bannerIds:number[]}>) {
  const { bannerIds } = action.payload;
  try {
    const res = yield call(() => Api.put(`/banners/main/sequence`, {bannerIds}));

    yield put(updateBannersMainSequenceAsync.success(res.data));
    yield put(getBannersMainAsync.request({}));
    yield message.success('배너 순서가 수정되었습니다.');
  } catch (error) {
    yield put(updateBannersMainSequenceAsync.failure(error));
  }
}

export default function* bannerSaga() {
  yield takeLatest(Actions.GET_BANNERS_REQUEST, getBanners);
  yield takeLatest(Actions.GET_BANNERS_MAIN_REQUEST, getBannersMain);
  yield takeLatest(Actions.GET_SELEBS_REQUEST, getSelebs);
  yield takeLatest(Actions.CREATE_BANNER_REQUEST, createBanner);
  yield takeLatest(Actions.UPDATE_BANNERS_MAIN_REQUEST, updateBannersMain);
  yield takeLatest(Actions.DELETE_BANNERS_REQUEST, deleteBanners);
  yield takeLatest(Actions.UPDATE_BANNERS_MAIN_SEQUENCE_REQUEST, updateBannersMainSequence);

}
