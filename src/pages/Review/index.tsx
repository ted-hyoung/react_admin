// base
import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// modules
import { Select, Button, Rate, Divider, Switch } from 'antd';
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
  clearReview,
} from 'store/reducer/review';

// types
import { ResponseReview, SearchReview, UpdateReview, UpdateRequestPayload } from 'types';
import { SearchCondition } from 'components/searchForm/SearchKeyAndValue';

// component
import { PaginationTable, SearchBar } from 'components';

// lib
import useModal from 'lib/hooks/useModal';
import { getThumbUrl, pad } from 'lib/utils';

const reviewSearchConditions: SearchCondition[] = [
  { key: 'creatorLoginId', text: '아이디' },
  { key: 'creatorPhone', text: '연락처' },
  { key: 'eventName', text: '공구명' },
  { key: 'productName', text: '제품명' },
  { key: 'orderId', text: '주문번호' },
  { key: 'contents', text: '내용' },
];

function Review() {
  const dispatch = useDispatch();
  const openModal = useModal();
  const { reviews, review } = useSelector((state: StoreState) => state.review);
  const { content, totalElements, size: pageSize } = reviews;
  const [selectedReviews, setSelectedReviews] = useState<number[] | string[]>([]);
  const [lastSearchCondition, setLastSearchCondition] = useState<SearchReview>();

  const getReviews = useCallback(
    (page: number, size = pageSize, searchCondition?: SearchReview) => {
      dispatch(
        getReviewsAsync.request({
          page,
          size,
          searchCondition,
        }),
      );
      setLastSearchCondition(searchCondition);
    },
    [dispatch, pageSize, setLastSearchCondition],
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
      if (selectedReviews.length > 0) {
        updateReviewsExpose(selectedReviews, expose);
      }
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
      getReviews(currentPage - 1, pageSize, lastSearchCondition);
    },
    [getReviews, lastSearchCondition, pageSize],
  );

  // pageSize select onChange
  const handlePageSizeChange = useCallback(
    (value: number) => {
      getReviews(0, value, lastSearchCondition);
    },
    [getReviews, lastSearchCondition],
  );

  const detailModalData = useMemo(
    () => [
      {
        title: '주문정보',
        items: [
          {
            label: '공구명',
            value: review.event.name,
          },
          {
            label: '주문번호',
            value: review.order.orderNo,
          },
          {
            label: '구매상품',
            value: (
              <div>
                {review.order.orderItems.map((orderItem, i) => {
                  const { product, option } = orderItem;
                  return (
                    <div key={`order-item-${i}`}>
                      {pad(i + 1, 2)}. {product.productName}
                      {option ? '(옵션 : ' + option.optionName : ''}
                    </div>
                  );
                })}
              </div>
            ),
          },
        ],
      },
      {
        title: '상품 후기',
        items: [
          {
            label: '아이디',
            value: review.creator.loginId,
          },
          {
            label: '연락처',
            value: review.creator.phone,
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
            span: 2,
          },
          {
            label: '첨부파일',
            value: (
              <div className="review-detail-images">
                {review.images.map(image => (
                  <img
                    key={image.fileKey}
                    src={getThumbUrl(image.fileKey, 120, 120)}
                    alt={image.fileName}
                    style={{ marginTop: 8, marginRight: 8 }}
                  />
                ))}
              </div>
            ),
            span: 2,
          },
        ],
      },
    ],
    [review],
  );

  // componentDidMount
  useEffect(() => {
    getReviews(0);
    return () => {
      // will unmount
      dispatch(clearReview());
    };
  }, []);

  useEffect(() => {
    if (review.reviewId !== 0) {
      openModal({
        type: 'detail',
        content: detailModalData,
      });
    }
  }, [review]);

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
        dataIndex: 'event',
        key: 'event',
        render: event => event.brandName,
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
              {review.images.length > 0 && (
                <>
                  <img src={getThumbUrl(review.images[0].fileKey, 110, 110)} alt={review.images[0].fileName} />
                  <br />
                </>
              )}
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
          <Switch onChange={() => updateReviewsExpose([review.reviewId], !expose)} checked={expose} />
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
