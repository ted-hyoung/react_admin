// base
import { call, put, takeEvery } from 'redux-saga/effects';
import * as Api from 'lib/protocols';
import * as Actions from 'store/action/eventAction';

// modules
import {} from 'antd';

// types
import { PayloadAction } from 'typesafe-actions';
import { GetListRequestPayload, SearchEvent } from 'types';
import { getEventsAsync } from 'store/reducer/event';

// saga
function* getEvents(action: PayloadAction<string, GetListRequestPayload<SearchEvent>>) {
  const { page, size, searchCondition } = action.payload;

  try {
    const res = yield call(() => Api.get('/events', { params: { page, size, ...searchCondition } }));
    yield put(
      getEventsAsync.success({
        events: res.data,
      }),
    );
  } catch (error) {
    yield put(getEventsAsync.failure(error));
  }
}

export default function* eventSaga() {
  yield takeEvery(Actions.GET_EVENTS_REQUEST, getEvents);
}
