// base
import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// modules
import { Table, Select, Button, Rate, Divider } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';

// store
import { StoreState } from 'store';
import {
  getReviewsAsync,
  updateReviewsExposeAsync,
  UpdateReviewExposeRequestPayload,
  updateReviewAsync,
  getReviewAsync,
} from 'store/reducer/review';

// types
import { ResponseReview, SearchReview, UpdateReview } from 'types/Review';
import { UpdateRequestPayload } from 'types/Payload';

// component
import { ReviewSearch, ReviewDetailModal } from 'components';

enum PageSizeRange {
  SIZE10 = '10',
  SIZE20 = '20',
  SIZE50 = '50',
  SIZE100 = '100',
}

const reviewSearchConditions = [
  { key: 'creatorLoginId', text: '아이디' },
  { key: 'creatorPhone', text: '연락처' },
  { key: 'eventName', text: '공구명' },
  { key: 'productName', text: '제품명' },
  { key: 'orderId', text: '주문번호' },
  { key: 'contents', text: '내용' },
  // todo : brandName?
];

function Review() {
  const dispatch = useDispatch();
  const { content, totalElements, size: pageSize } = useSelector((state: StoreState) => state.review.reviews);
  const [selectedReviews, setSelectedReviews] = useState<number[] | string[]>([]);

  const getReviews = useCallback(
    (page: number, size = pageSize, searchCondition?: SearchReview) => {
      dispatch(
        getReviewsAsync.request({
          page,
          size,
          searchCondition,
        }),
      );
    },
    [dispatch, pageSize],
  );

  const updateReview = useCallback(
    (prop: UpdateRequestPayload<UpdateReview>) => {
      dispatch(updateReviewAsync.request(prop));
    },
    [dispatch],
  );

  const updateReviewsExpose = useCallback(
    (ids: number[] | string[], expose: boolean) => {
      const requestData: UpdateReviewExposeRequestPayload[] = [];
      ids.forEach((reviewId: number | string) => {
        requestData.push({
          reviewId,
          expose,
        });
      });
      dispatch(updateReviewsExposeAsync.request(requestData));
    },
    [dispatch],
  );

  const getReview = useCallback(
    (id: number) => {
      dispatch(getReviewAsync.request({ id }));
    },
    [dispatch],
  );

  // 리뷰 숨김/공개
  const handleUpdateReviewsExpose = useCallback(
    (expose: boolean) => {
      updateReviewsExpose(selectedReviews, expose);
    },
    [updateReviewsExpose, selectedReviews],
  );

  // table checkbox onChange
  const handleChange = useCallback(
    (selectedRowKeys: number[] | string[]) => {
      setSelectedReviews(selectedRowKeys);
    },
    [setSelectedReviews],
  );

  // pagination onChange
  const handlePaginationChange = useCallback(
    (currentPage: number) => {
      getReviews(currentPage - 1);
    },
    [getReviews],
  );

  // pageSize select onChange
  const handlePageSizeChange = useCallback(
    (value: string) => {
      getReviews(0, Number(value));
    },
    [getReviews],
  );

  useEffect(() => {
    getReviews(0);
  }, []);

  const reviewColumns: Array<ColumnProps<ResponseReview>> = useMemo(
    () => [
      {
        title: 'No.',
        dataIndex: 'reviewId',
        key: 'reviewId',
      },
      {
        title: '작성일',
        dataIndex: 'created',
        key: 'created',
        render: created => moment(created).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '브랜드',
        dataIndex: '',
        key: '',
      },
      {
        title: '작성자',
        dataIndex: 'creator',
        key: 'creator',
        render: creator => creator.username,
      },
      {
        title: '후기 내용',
        dataIndex: 'contents',
        key: 'contents',
        width: 450,
        render: (contents, review) => (
          <div style={{ display: 'flex' }}>
            <div>
              <img src="http://placehold.it/110x110" alt="" />
              <br />
              <Rate value={review.starRate} disabled style={{ fontSize: 13 }} />
            </div>
            <div style={{ paddingLeft: 15 }}>
              <div style={{ paddingBottom: 10 }}>{contents}</div>
              <Button size="small" onClick={() => getReview(review.reviewId)}>
                자세히 보기
              </Button>
            </div>
          </div>
        ),
      },
      {
        title: '공개',
        dataIndex: 'expose',
        key: 'expose',
        render: (expose, review) => (
          <Button onClick={() => updateReviewsExpose([review.reviewId], !expose)} type={expose ? 'danger' : 'primary'}>
            {expose ? '비공개' : '공개'}
          </Button>
        ),
      },
      {
        title: '순서',
        dataIndex: 'sequence',
        key: 'sequence',
        render: (sequence, review) => (
          <>
            <Select
              style={{ width: 50 }}
              defaultValue={sequence || 0}
              onChange={(value: any) =>
                updateReview({
                  id: review.reviewId,
                  data: {
                    sequence: value === 0 ? null : value,
                  },
                })
              }
            >
              {Array(11)
                .fill('')
                .map((item, index) => (
                  <Select.Option key={index} value={index}>
                    {index === 0 ? '-' : index}
                  </Select.Option>
                ))}
            </Select>
          </>
        ),
      },
    ],
    [updateReviewsExpose, updateReview, getReview],
  );

  return (
    <>
      <ReviewSearch getData={getReviews} pageSize={pageSize} searchConditions={reviewSearchConditions} />
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
        <span>
          <Button onClick={() => handleUpdateReviewsExpose(true)} style={{ marginRight: 5 }} type="primary">
            선택 공개
          </Button>
          <Button onClick={() => handleUpdateReviewsExpose(false)} type="danger">
            선택 비공개
          </Button>
        </span>
        <Select defaultValue={PageSizeRange.SIZE10} style={{ width: 150 }} onChange={handlePageSizeChange}>
          {Object.keys(PageSizeRange).map((key: any) => (
            <Select.Option key={Number(PageSizeRange[key])}>{PageSizeRange[key]}개씩 보기</Select.Option>
          ))}
        </Select>
      </div>
      <Table
        rowKey={review => review.reviewId.toString()}
        rowSelection={{
          onChange: handleChange,
        }}
        dataSource={content}
        columns={reviewColumns}
        pagination={{
          total: totalElements,
          pageSize,
          onChange: handlePaginationChange,
        }}
      />
      <ReviewDetailModal />
    </>
  );
}

export default Review;
