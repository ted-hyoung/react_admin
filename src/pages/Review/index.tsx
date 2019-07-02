import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getReviewsAsync,
  updateReviewExposeAsync,
  updateReviewAsync,
  updateReviewsExposeAsync,
} from 'store/reducer/review';
import { Table, Form, Select, Input, Modal, DatePicker, Button, Rate } from 'antd';
import { StoreState } from 'store';
import { ColumnProps } from 'antd/lib/table';
import { ResponseReview, SearchReview } from 'types/Review';
import { FormComponentProps } from 'antd/lib/form';
import moment, { Moment } from 'moment';

enum dateRange {
  ENTIRE = '전체',
  TODAY = '오늘',
  RECENT_3DAYS = '최근 3일',
  RECENT_WEEK = '최근 7일',
}

interface ReviewSearchProps extends FormComponentProps {
  getData: (page: number, searchCondition?: SearchReview) => void;
}

const ReviewSearch = Form.create<ReviewSearchProps>()((props: ReviewSearchProps) => {
  const { form, getData } = props;
  const { getFieldDecorator, validateFieldsAndScroll, setFieldsValue } = form;
  const handleSearch = useCallback(() => {
    validateFieldsAndScroll((err, val) => {
      if (err) {
        console.log(err);
        // Modal.warn({
        //   content: err.
        // })
        return;
      }
      console.log(val);
      // getData(0, val.key === 'null' ? {} : { [val.key]: val.value });
    });
  }, [validateFieldsAndScroll]);
  const setDate = useCallback((value: string) => {
    let startDate;
    let endDate: Moment | undefined = moment().endOf('day');
    switch (value) {
      case dateRange.ENTIRE: {
        endDate = undefined;
        break;
      }
      case dateRange.TODAY: {
        startDate = moment().startOf('day');
        break;
      }
      case dateRange.RECENT_3DAYS: {
        startDate = moment()
          .subtract(3, 'day')
          .startOf('day');
        break;
      }
      case dateRange.RECENT_WEEK: {
        startDate = moment()
          .subtract(1, 'week')
          .startOf('day');
        break;
      }
    }
    setFieldsValue({
      startDate,
      endDate,
    });
  }, []);
  const ReviewSearchCondition = useMemo(
    () => [
      {
        key: 'null',
        value: '전체',
      },
      {
        key: 'id',
        value: '아이디',
      },
      {
        key: 'phone',
        value: '연락처',
      },
      {
        key: 'eventName',
        value: '공구명',
      },
      {
        key: 'productName',
        value: '제품명',
      },
      {
        key: 'orderId',
        value: '주문번호',
      },
      {
        key: 'contents',
        value: '내용',
      },
    ],
    [],
  );
  return (
    <div className="search">
      <Form layout="inline">
        <Form.Item>
          {getFieldDecorator('key', {
            initialValue: ReviewSearchCondition[0].key,
          })(
            <Select style={{ width: 120 }}>
              {ReviewSearchCondition.map(condition => (
                <Select.Option key={condition.value} value={condition.key}>
                  {condition.value}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item>{getFieldDecorator('value')(<Input />)}</Form.Item>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Form.Item>{getFieldDecorator('startDate')(<DatePicker />)}</Form.Item>
          <Form.Item>{getFieldDecorator('endDate')(<DatePicker />)}</Form.Item>
          {Object.keys(dateRange).map((key: any) => (
            <Button key={key} onClick={() => setDate(dateRange[key])}>
              {dateRange[key]}
            </Button>
          ))}
        </div>
        <Button onClick={handleSearch} type="primary">
          검색
        </Button>
      </Form>
    </div>
  );
});

function Review() {
  const dispatch = useDispatch();
  const reviews = useSelector((state: StoreState) => state.review.reviews);
  const [selectedReviews, setSelectedReviews] = useState<number[] | string[]>([]);

  const getReviews = useCallback(
    (page: number, searchCondition?: SearchReview) => {
      dispatch(
        getReviewsAsync.request({
          page,
          size: 10,
          searchCondition,
        }),
      );
    },
    [dispatch],
  );

  const disposeReviews = useCallback(() => {
    dispatch(
      updateReviewsExposeAsync.request({
        reviewIds: selectedReviews,
        expose: false,
      }),
    );
  }, [dispatch]);

  const updateReviewExpose = useCallback((id: number, expose: boolean) => {
    dispatch(
      updateReviewExposeAsync.request({
        id,
        expose,
      }),
    );
  }, []);

  const handleChange = useCallback(
    (selectedRowKeys: number[] | string[]) => {
      setSelectedReviews(selectedRowKeys);
    },
    [setSelectedReviews],
  );

  useEffect(() => {
    getReviews(0);
  }, [getReviews]);

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
        render: created => moment(created).format('YYYY-MM-DD hh:mm:ss'),
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
        render: (contents, review) => (
          <div style={{ display: 'flex' }}>
            <div>
              <img src="http://placehold.it/100x100" alt="" />
              <br />
              <Rate value={review.starRate} disabled style={{ fontSize: 13 }} />
            </div>
            <div>
              <div>{contents}</div>
              <Button size="small">자세히 보기</Button>
            </div>
          </div>
        ),
      },
      {
        title: '공개여부',
        dataIndex: 'expose',
        key: 'expose',
        render: (expose, review) => (
          <Button onClick={() => updateReviewExpose(review.reviewId, !expose)}>{expose ? '공개' : '비공개'}</Button>
        ),
      },
      {
        title: '순서',
        dataIndex: 'sequence',
        key: 'sequence',
      },
    ],
    [reviews],
  );

  return (
    <>
      <ReviewSearch getData={getReviews} />
      <Button onClick={disposeReviews}>선택 비공개</Button>
      <Table
        rowKey={review => review.reviewId.toString()}
        rowSelection={{
          onChange: handleChange,
        }}
        dataSource={reviews.content}
        columns={reviewColumns}
      />
    </>
  );
}

export default Review;
