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
import { QuillContentProp } from 'components/TextEditor';

function UpdateCelebReviewForm(props: RouteComponentProps<{ id: string }>) {
  const { match } = props;

  const dispatch = useDispatch();
  const { celebReview } = useSelector((state: StoreState) => state.celebReview);
  const [value, setValue] = useState<QuillContentProp>({});

  const handleChange = (value: QuillContentProp) => {
    setValue(value);
  };

  const handleConfirm = useCallback(() => {
    const id = Number(match.params.id);
    if (id) {
      dispatch(
        updateCelebReviewAsync.request({
          id,
          data: {
            contents: value.resultContent || '',
            instagramUrl: 'asdf',
          },
        }),
      );
    }
  }, [dispatch, value, match.params.id]);

  useEffect(() => {
    if (Number(match.params.id)) {
      dispatch(getCelebReviewAsync.request({ id: Number(match.params.id) }));
    }
  }, [match.params.id]);

  return (
    <>
      <h2 style={{ marginBottom: 20 }}>셀럽 리뷰 등록</h2>
      <TextEditor value={value} onChange={handleChange} defaultValue={celebReview.contents || undefined} />
      <Button onClick={handleConfirm} style={{ marginTop: 10 }}>
        확인
      </Button>
    </>
  );
}

export default withRouter(UpdateCelebReviewForm);
