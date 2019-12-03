// base
import React, { useState, useEffect, ReactElement } from 'react';
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

      const ids:string[] =[];
      if(value){
        const counts= value.split('<iframe');
        counts.splice(0, 1);
        counts.map((item,i) =>{
          const start = item.indexOf('src=\"https://www.instagram.com/p');
          const end = item.indexOf("/embed/captioned/", start+33);
          const list = item.substring(start+33, end);
          ids.push(list);
        });
      }

      dispatch(
        updateCelebReviewAsync.request({
          id: eventId,
          data: {
            contents: value,
            postIds:ids
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
        onChange={value => setValue(value)}
        initialValue={celebReview.contents || undefined}
      />
      <Button onClick={handleConfirm} style={{ marginTop: 10 }}>
        확인
      </Button>
    </>
  );
}

export default CelebReviewDetail;
