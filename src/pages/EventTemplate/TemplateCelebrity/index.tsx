import React from 'react';
import { useSelector } from 'react-redux';
import { StoreState } from 'store';

// components
// import { ShowMoreText } from 'components';

import './index.less';
import ShowMoreText from 'components/template/TemplateShowMoreText';

function TemplateCelebrity() {
  const event = useSelector((state: StoreState) => state.event.event);
  const { celebReview, choiceReview } = event;

  return (
    <div className="celebrity">
      <div className="choice-review">
        <div className="page-title">
          셀럽 Choice Review
          {/* {event.hashTags &&  */}
          <div className="hashTags">
            <span>도자기피부</span>
            <span>트러블진정</span>
            <span>미세먼지</span>
          </div>
          {/* } */}
        </div>
        {choiceReview && (
          <div className="text">
            {/* 50자 */}
            <ShowMoreText text={choiceReview} limit={50} type="length" />
            {/* 3줄
            <ShowMoreText text={choiceReview} limit={3} type="line" /> */}
          </div>
        )}
      </div>
      {celebReview.contents && (
        <div className="celeb-review">
          <div dangerouslySetInnerHTML={{ __html: celebReview.contents.concat('<br />') }} />
        </div>
      )}
    </div>
  );
}

export default TemplateCelebrity;
