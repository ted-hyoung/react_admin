// base
import React from 'react';

// modules

import './index.less';

function TemplateEventTimer() {
  return (
    <div className="template-timer">
      <div className="template-timer-head">
        <span>공구진행 까지 남은 시간은</span>
      </div>
      <div
        className="template-timer-body"
        // style={isPurchase(purchaseStatus) ? { backgroundColor: 'rgba(106, 152, 248, 0.7)' } : undefined}
      >
        <div className="template-timer-item">
          <strong>00</strong>
          <p>days</p>
        </div>
        <span className="template-timer-item--colon">:</span>
        <div className="template-timer-item">
          <strong>00</strong>
          <p>hrs</p>
        </div>
        <span className="template-timer-item--colon">:</span>
        <div className="template-timer-item">
          <strong>00</strong>
          <p>min</p>
        </div>
        <span className="template-timer-item--colon">:</span>
        <div className="template-timer-item">
          <strong>00</strong>
          <p>sec</p>
        </div>
      </div>
    </div>
  );
}

export default TemplateEventTimer;
