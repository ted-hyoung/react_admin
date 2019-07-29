// base
import React from 'react';

// modules
import { Row, Col } from 'antd';

// assets
import { GageIcon } from 'components/template/TemplateIcons';

import './index.less';

const getGageColor = (percentage: number) => {
  if (percentage === 0) {
    return '#c6c6c6';
  } else if (percentage < 25) {
    return '#e47da2';
  } else if (percentage < 50) {
    return '#e47da2';
  } else if (percentage < 75) {
    return '#ec538a';
  } else if (percentage < 100) {
    return '#ff317b';
  } else {
    return '#ff002a';
  }
};

interface Props {
  targetAmountAttainmentRate: number;
}

function TemplateEventAttainment(props: Props) {
  const { targetAmountAttainmentRate } = props;

  const color = getGageColor(targetAmountAttainmentRate);

  return (
    <div className="event-attainment">
      <Row type="flex" align="middle">
        <Col span={8} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <GageIcon percentage={targetAmountAttainmentRate} fill={color} />
          <p className="event-attainment-percentage" style={{ color }}>
            <strong>{targetAmountAttainmentRate}</strong>
            <span>%</span>
          </p>
        </Col>
        <Col span={16}>
          <strong className="event-attainment-title">100% 달성 시 공구 성공!</strong>
          <ul className="event-attainment-list">
            <li className="event-attainment-item">
              공구 마감 전 목표액 100% 이상 <br /> 달성 시 배송이 시작됩니다.
            </li>
            <li className="event-attainment-item">
              공구 마감 전 목표 미 달성 시 <br /> 주문은 자동 취소될 수 있습니다.
            </li>
          </ul>
        </Col>
      </Row>
    </div>
  );
}

export default TemplateEventAttainment;
