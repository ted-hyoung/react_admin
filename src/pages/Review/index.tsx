// base
import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// modules
import { Select, Button, Rate, Divider } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';

// store
import { StoreState } from 'store';
import {
  getReviewsAsync,
  updateReviewsExposeAsync,
  UpdateReviewExposeRequestPayload,
  updateReviewSequenceAsync,
  getReviewAsync,
} from 'store/reducer/review';

// types
import { ResponseReview, SearchReview, UpdateReview, UpdateRequestPayload } from 'types';
import { SearchCondition } from 'components/searchForm/SearchKeyAndValue';

// component
import { PaginationTable, SearchBar } from 'components';
import useModal from 'lib/hooks/useModal';

const reviewSearchConditions: SearchCondition[] = [
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
  const openModal = useModal();
  const { reviews, review } = useSelector((state: StoreState) => state.review);
  const { content, totalElements, size: pageSize } = reviews;
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
      dispatch(updateReviewSequenceAsync.request(prop));
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

  // 숨김/공개 button onChange
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
    (value: number) => {
      getReviews(0, value);
    },
    [getReviews],
  );

  const detailModalData = useMemo(
    () => [
      {
        title: '주문정보',
        items: [
          {
            label: '공구명',
            value: '비클 앰플 공구 1차',
          },
          {
            label: '주문번호',
            value: '0000-0000-0000-0000',
          },
          {
            label: '구매상품',
            value: '01. 비클 앰플 1세트(옵션 : 주황마스크)',
          },
        ],
      },
      {
        title: '상품 후기',
        items: [
          {
            label: '아이디',
            value: 'asdfasdf3323', //review.creator.loginId,
          },
          {
            label: '연락처',
            value: '010-0000-0000', // review.creator.phone,
          },
          {
            label: '작성일',
            value: moment(review.created).format('YYYY-MM-DD HH:mm:ss'),
          },
          {
            label: '평점',
            value: <Rate disabled value={review.starRate} />,
          },
          {
            label: '내용',
            value: review.contents,
          },
        ],
      },
    ],
    [review],
  );

  useEffect(() => {
    if (review.reviewId !== 0) {
      openModal({
        type: 'detail',
        content: detailModalData,
      });
    }
  }, [review]);

  // componentDidMount
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
      <SearchBar
        onSearch={value => getReviews(0, pageSize, value)}
        onReset={() => getReviews(0)}
        searchConditions={reviewSearchConditions}
      />
      <Divider />
      <PaginationTable
        onChangeExpose={handleUpdateReviewsExpose}
        onChangePageSize={handlePageSizeChange}
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
    </>
  );
}

export default Review;
