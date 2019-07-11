// base
import React, { useState, useCallback, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

// modules
import { Button } from 'antd';

// components
import { TextEditor } from 'components';

// store
import { StoreState } from 'store';
import { getCelebReviewAsync, updateCelebReviewAsync } from 'store/reducer/celebReview';

function UpdateCelebReviewForm(props: RouteComponentProps<{ id: string }>) {
  const { match } = props;

  const dispatch = useDispatch();
  const { celebReview } = useSelector((state: StoreState) => state.celebReview);
  const [contents, setContents] = useState('');

  const handleConfirm = useCallback(() => {
    const id = Number(match.params.id);
    if (id) {
      dispatch(
        updateCelebReviewAsync.request({
          id,
          data: {
            contents,
            instagramUrl: 'asdf',
          },
        }),
      );
    }
  }, [dispatch, contents, match.params.id]);

  useEffect(() => {
    if (Number(match.params.id)) {
      dispatch(getCelebReviewAsync.request({ id: Number(match.params.id) }));
    }
  }, [match.params.id]);

  useEffect(() => {
    if (celebReview.contents) {
      setContents(celebReview.contents);
    }
  }, [celebReview.contents, setContents]);

  return (
    <>
      <h2 style={{ marginBottom: 20 }}>셀럽 리뷰 등록</h2>
      <TextEditor value={contents} onChange={val => setContents(val)} />
      <Button onClick={handleConfirm} style={{ marginTop: 10 }}>
        확인
      </Button>
    </>
  );
}

export default withRouter(UpdateCelebReviewForm);
