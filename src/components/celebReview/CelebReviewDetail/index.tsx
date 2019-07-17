// base
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// modules
import { Button } from 'antd';

// components
import { TextEditor } from 'components';

// store
import { StoreState } from 'store';
import { getCelebReviewAsync, updateCelebReviewAsync } from 'store/reducer/celebReview';

function CelebReviewDetail(props: { id: number }) {
  const { id } = props;

  const dispatch = useDispatch();
  const { celebReview } = useSelector((state: StoreState) => state.celebReview);
  const [value, setValue] = useState('');

  const handleConfirm = () => {
    if (id) {
      dispatch(
        updateCelebReviewAsync.request({
          id,
          data: {
            contents: value,
            instagramUrl: 'asdf',
          },
        }),
      );
    }
  };

  useEffect(() => {
    dispatch(getCelebReviewAsync.request({ id }));
  }, [id, dispatch]);

  return (
    <>
      <TextEditor value={value} onChange={value => setValue(value)} defaultValue={celebReview.contents || undefined} />
      <Button onClick={handleConfirm} style={{ marginTop: 10 }}>
        확인
      </Button>
    </>
  );
}

export default CelebReviewDetail;
