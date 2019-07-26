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

function CelebReviewDetail() {
  const dispatch = useDispatch();

  const { eventId, celebReview } = useSelector((state: StoreState) => {
    const { event } = state.event;
    const { celebReview } = state.celebReview;

    return {
      eventId: event.eventId,
      celebReview,
    };
  });
  const [value, setValue] = useState('');

  const handleConfirm = () => {
    if (eventId) {
      dispatch(
        updateCelebReviewAsync.request({
          id: eventId,
          data: {
            contents: value,
          },
        }),
      );
    }
  };

  useEffect(() => {
    dispatch(getCelebReviewAsync.request({ id: eventId }));
  }, [eventId, dispatch]);

  return (
    <>
      <TextEditor
        name="celeb-editor"
        value={value}
        onChange={value => setValue(value)}
        defaultValue={celebReview.contents || undefined}
      />
      <Button onClick={handleConfirm} style={{ marginTop: 10 }}>
        확인
      </Button>
    </>
  );
}

export default CelebReviewDetail;
