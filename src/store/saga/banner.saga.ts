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
  getBannersMainAsync, getCelebsAsync,

} from 'store/action/banner.action';

import { BannerExposeStatus, BannerType } from '../../enums/Banner';
import { CreateBanner, CreateExperienceGroup } from '../../models';
import { createExpGroupAsync } from '../action/expGroup.action';

function* getBanners(action: ActionType<typeof getBannersAsync.request>) {
  const { page, size, searchCondition } = action.payload;

  try {

    // const res = yield call(() =>
    //   Api.get(`/banners`, {
    //     params: { page, size, ...data },
    //     paramsSerializer: (params: any) => qs.stringify(params, { arrayFormat: 'indices', allowDots: true }),
    //   }),
    // );

  const res = {
    data :{
      content: [
        {
          bannerId:1,
          created:"2019-10-15T13:50:09.721348",
          exposeStarted:"2019-10-15T13:50:09.721348",
          exposeEnded:"2019-10-15T13:50:09.721348",
          bannerType:BannerType.EVENT,
          bannerExposeStatus:BannerExposeStatus['노출 중'],
          title:'test 배너',
          url:'seller/xxjominxx/events/6',
          viewCnt:23,
          image: {
            bucketName: "ifd-fromc",
            fileKey: "bidNn1zjXcrsSz90wC4U20190923090018021071",
            contentLength: 45670,
            contentType: "image/webp",
            fileName: "썸네일1.jpg",
            fileObjectId: 5,
            fileMetadata: {
              contentType: "image/webp",
              contentLength: 2870
            }
          }
        },
        {
          bannerId:2,
          created:"2019-10-15T13:50:09.721348",
          exposeStarted:"2019-10-15T13:50:09.721348",
          exposeEnded:"2019-10-15T13:50:09.721348",
          bannerType:BannerType.EVENT,
          bannerExposeStatus:BannerExposeStatus['노출 중'],
          title:'test 배너',
          url:'seller/xxjominxx/events/6',
          viewCnt:23,
          image: {
            bucketName: "ifd-fromc",
            fileKey: "T8u0v23nEtBi5xQoX89z20190923090018248864",
            contentLength: 39186,
            contentType: "image/webp",
            fileName: "썸네일2.jpg",
            fileObjectId: 5,
            fileMetadata: {
              contentType: "image/webp",
              contentLength: 2870
            }
          }
        },
        {
          bannerId:3,
          created:"2019-10-15T13:50:09.721348",
          exposeStarted:"2019-10-15T13:50:09.721348",
          exposeEnded:"2019-10-15T13:50:09.721348",
          bannerType:BannerType.EVENT,
          bannerExposeStatus:BannerExposeStatus['노출 중'],
          title:'test 배너',
          url:'seller/xxjominxx/events/6',
          viewCnt:23,
          image: {
            bucketName: "ifd-fromc",
            fileKey: "mYZ5ELRkCDkfZzidcko620190923090021258181",
            contentLength: 45670,
            contentType: "image/webp",
            fileName: "썸네일1.jpg",
            fileObjectId: 5,
            fileMetadata: {
              contentType: "image/webp",
              contentLength: 2870
            }
          }
        },
        {
          bannerId:4,
          created:"2019-10-15T13:50:09.721348",
          exposeStarted:"2019-10-15T13:50:09.721348",
          exposeEnded:"2019-10-15T13:50:09.721348",
          bannerType:BannerType.EVENT,
          bannerExposeStatus:BannerExposeStatus['노출 중'],
          title:'test 배너',
          url:'seller/xxjominxx/events/6',
          viewCnt:23,
          image: {
            bucketName: "ifd-fromc",
            fileKey: "Mz749AJEJKHWt908TuyY20191015045007712268",
            contentLength: 45670,
            contentType: "image/webp",
            fileName: "썸네일2.jpg",
            fileObjectId: 5,
            fileMetadata: {
              contentType: "image/webp",
              contentLength: 2870
            }
          }
        },
        {
          bannerId:5,
          created:"2019-10-15T13:50:09.721348",
          exposeStarted:"2019-10-15T13:50:09.721348",
          exposeEnded:"2019-10-15T13:50:09.721348",
          bannerType:BannerType.EVENT,
          bannerExposeStatus:BannerExposeStatus['노출 중'],
          title:'test 배너',
          url:'seller/xxjominxx/events/6',
          viewCnt:23,
          image: {
            bucketName: "ifd-fromc",
            fileKey: "PgurcqT0HiaULRunS3Re20190923090028085694",
            contentLength: 45670,
            contentType: "image/webp",
            fileName: "썸네일2.jpg",
            fileObjectId: 5,
            fileMetadata: {
              contentType: "image/webp",
              contentLength: 2870
            }
          }
        },{
          bannerId:6,
          created:"2019-10-15T13:50:09.721348",
          exposeStarted:"2019-10-15T13:50:09.721348",
          exposeEnded:"2019-10-15T13:50:09.721348",
          bannerType:BannerType.EVENT,
          bannerExposeStatus:BannerExposeStatus['노출 중'],
          title:'test 배너',
          url:'seller/xxjominxx/events/6',
          viewCnt:23,
          image: {
            bucketName: "ifd-fromc",
            fileKey: "PgurcqT0HiaULRunS3Re20190923090028085694",
            contentLength: 45670,
            contentType: "image/webp",
            fileName: "썸네일2.jpg",
            fileObjectId: 5,
            fileMetadata: {
              contentType: "image/webp",
              contentLength: 2870
            }
          }
        },
        {
          bannerId:7,
          created:"2019-10-15T13:50:09.721348",
          exposeStarted:"2019-10-15T13:50:09.721348",
          exposeEnded:"2019-10-15T13:50:09.721348",
          bannerType:BannerType.EVENT,
          bannerExposeStatus:BannerExposeStatus['노출 중'],
          title:'test 배너',
          url:'seller/xxjominxx/events/6',
          viewCnt:23,
          image: {
            bucketName: "ifd-fromc",
            fileKey: "PgurcqT0HiaULRunS3Re20190923090028085694",
            contentLength: 45670,
            contentType: "image/webp",
            fileName: "썸네일2.jpg",
            fileObjectId: 5,
            fileMetadata: {
              contentType: "image/webp",
              contentLength: 2870
            }
          }
        },
        {
          bannerId:8,
          created:"2019-10-15T13:50:09.721348",
          exposeStarted:"2019-10-15T13:50:09.721348",
          exposeEnded:"2019-10-15T13:50:09.721348",
          bannerType:BannerType.EVENT,
          bannerExposeStatus:BannerExposeStatus['노출 중'],
          title:'test 배너',
          url:'seller/xxjominxx/events/6',
          viewCnt:23,
          image: {
            bucketName: "ifd-fromc",
            fileKey: "PgurcqT0HiaULRunS3Re20190923090028085694",
            contentLength: 45670,
            contentType: "image/webp",
            fileName: "썸네일2.jpg",
            fileObjectId: 5,
            fileMetadata: {
              contentType: "image/webp",
              contentLength: 2870
            }
          }
        },
        {
          bannerId:9,
          created:"2019-10-15T13:50:09.721348",
          exposeStarted:"2019-10-15T13:50:09.721348",
          exposeEnded:"2019-10-15T13:50:09.721348",
          bannerType:BannerType.EVENT,
          bannerExposeStatus:BannerExposeStatus['노출 중'],
          title:'test 배너',
          url:'seller/xxjominxx/events/6',
          viewCnt:23,
          image: {
            bucketName: "ifd-fromc",
            fileKey: "PgurcqT0HiaULRunS3Re20190923090028085694",
            contentLength: 45670,
            contentType: "image/webp",
            fileName: "썸네일2.jpg",
            fileObjectId: 5,
            fileMetadata: {
              contentType: "image/webp",
              contentLength: 2870
            }
          }
        },
        {
          bannerId:10,
          created:"2019-10-15T13:50:09.721348",
          exposeStarted:"2019-10-15T13:50:09.721348",
          exposeEnded:"2019-10-15T13:50:09.721348",
          bannerType:BannerType.EVENT,
          bannerExposeStatus:BannerExposeStatus['노출 중'],
          title:'test 배너',
          url:'seller/xxjominxx/events/6',
          viewCnt:23,
          image: {
            bucketName: "ifd-fromc",
            fileKey: "PgurcqT0HiaULRunS3Re20190923090028085694",
            contentLength: 45670,
            contentType: "image/webp",
            fileName: "썸네일2.jpg",
            fileObjectId: 5,
            fileMetadata: {
              contentType: "image/webp",
              contentLength: 2870
            }
          }
        },
      ],
      first: true,
      last: false,
      totalElements: 10,
      totalPages: 1,
      page: 0,
      size: 10,
    }
  };

    yield put(getBannersAsync.success(res.data));
  } catch (error) {
    yield put(getBannersAsync.failure(error));
  }
}

function* getBannersMain(action: ActionType<typeof getBannersMainAsync.request>) {

  try {
   // const res = yield call(() => Api.get(`/banners/main`));


    const res = { data : [
      {
        bannerId:16,
        created:"2019-10-15T13:50:09.721348",
        exposeStarted:"2019-10-15T13:50:09.721348",
        exposeEnded:"2019-10-15T13:50:09.721348",
        bannerType:BannerType.EVENT,
        bannerExposeStatus:BannerExposeStatus['노출 중'],
        title:'1test1 배너',
        url:'seller/xxjominxx/events/6',
        viewCnt:23,
        image: {
          bucketName: "ifd-fromc",
          fileKey: "bidNn1zjXcrsSz90wC4U20190923090018021071",
          contentLength: 45670,
          contentType: "image/webp",
          fileName: "썸네일1.jpg",
          fileObjectId: 5,
          fileMetadata: {
            contentType: "image/webp",
            contentLength: 2870
          }
        }
      },
      {
        bannerId:21,
        created:"2019-10-15T13:50:09.721348",
        exposeStarted:"2019-10-15T13:50:09.721348",
        exposeEnded:"2019-10-15T13:50:09.721348",
        bannerType:BannerType.EVENT,
        bannerExposeStatus:BannerExposeStatus['노출 중'],
        title:'2test 배너',
        url:'seller/xxjominxx/events/6',
        viewCnt:23,
        image: {
          bucketName: "ifd-fromc",
          fileKey: "T8u0v23nEtBi5xQoX89z20190923090018248864",
          contentLength: 39186,
          contentType: "image/webp",
          fileName: "썸네일2.jpg",
          fileObjectId: 5,
          fileMetadata: {
            contentType: "image/webp",
            contentLength: 2870
          }
        }
      },
      {
        bannerId:23,
        created:"2019-10-15T13:50:09.721348",
        exposeStarted:"2019-10-15T13:50:09.721348",
        exposeEnded:"2019-10-15T13:50:09.721348",
        bannerType:BannerType.EVENT,
        bannerExposeStatus:BannerExposeStatus['노출 중'],
        title:'3test 배너',
        url:'seller/xxjominxx/events/6',
        viewCnt:23,
        image: {
          bucketName: "ifd-fromc",
          fileKey: "mYZ5ELRkCDkfZzidcko620190923090021258181",
          contentLength: 45670,
          contentType: "image/webp",
          fileName: "썸네일1.jpg",
          fileObjectId: 5,
          fileMetadata: {
            contentType: "image/webp",
            contentLength: 2870
          }
        }
      },
      {
        bannerId:34,
        created:"2019-10-15T13:50:09.721348",
        exposeStarted:"2019-10-15T13:50:09.721348",
        exposeEnded:"2019-10-15T13:50:09.721348",
        bannerType:BannerType.EVENT,
        bannerExposeStatus:BannerExposeStatus['노출 중'],
        title:'4test 배너',
        url:'seller/xxjominxx/events/6',
        viewCnt:23,
        image: {
          bucketName: "ifd-fromc",
          fileKey: "Mz749AJEJKHWt908TuyY20191015045007712268",
          contentLength: 45670,
          contentType: "image/webp",
          fileName: "썸네일2.jpg",
          fileObjectId: 5,
          fileMetadata: {
            contentType: "image/webp",
            contentLength: 2870
          }
        }
      },
      {
        bannerId:55,
        created:"2019-10-15T13:50:09.721348",
        exposeStarted:"2019-10-15T13:50:09.721348",
        exposeEnded:"2019-10-15T13:50:09.721348",
        bannerType:BannerType.EVENT,
        bannerExposeStatus:BannerExposeStatus['노출 중'],
        title:'5test 배너',
        url:'seller/xxjominxx/events/6',
        viewCnt:23,
        image: {
          bucketName: "ifd-fromc",
          fileKey: "PgurcqT0HiaULRunS3Re20190923090028085694",
          contentLength: 45670,
          contentType: "image/webp",
          fileName: "썸네일2.jpg",
          fileObjectId: 5,
          fileMetadata: {
            contentType: "image/webp",
            contentLength: 2870
          }
        }
      }
    ]};
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

export default function* bannerSaga() {
  yield takeLatest(Actions.GET_BANNERS_REQUEST, getBanners);
  yield takeLatest(Actions.GET_BANNERS_MAIN_REQUEST, getBannersMain);
  yield takeLatest(Actions.GET_SELEBS_REQUEST, getSelebs);
  yield takeLatest(Actions.CREATE_BANNER_REQUEST, createBanner);

}
