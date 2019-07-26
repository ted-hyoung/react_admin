// base
import React, { useMemo } from 'react';

// modules
import { Rate } from 'antd';

import './index.less';

interface ScoreCount {
  score: number;
  count: number;
}

function ScoreGraph({ counts }: { counts: number[] }) {
  const countArray = useMemo(() => {
    const countsContainer: ScoreCount[] = [];
    counts.forEach((score, scoreIndex) => countsContainer.push({ score: scoreIndex + 1, count: score }));
    return countsContainer;
  }, [counts]);
  const greatestCount = useMemo(
    () =>
      [...countArray].sort((a, b) => {
        if (a.count === b.count) {
          return b.score - a.score;
        } else {
          return b.count - a.count;
        }
      })[0],
    [countArray],
  );

  return (
    <ul className="score">
      {countArray.map((item, i) => (
        <li key={`count-${i}`} className={item.score === greatestCount.score ? 'greatest' : ''}>
          {item.score === greatestCount.score && <div className="tooltip">{item.count}</div>}
          <div className="bar">
            <span style={{ height: (item.count / greatestCount.count) * 100 + '%' }} />
          </div>
          <div className="text">{i + 1}점</div>
        </li>
      ))}
    </ul>
  );
}

function TemplateReview() {
  return (
    <>
      <div className="review-report">
        <div className="rounded-primary-box">
          <span className="font-weight-bold">{0}%</span>의 구매자가 만족했습니다.
        </div>
        <div>
          <div className="star-rate">
            <div className="rating-average">0</div>
            <Rate value={0} disabled />
          </div>
          <ScoreGraph counts={[0, 0, 0, 0, 0]} />
        </div>
      </div>
    </>
  );
}

export default TemplateReview;
