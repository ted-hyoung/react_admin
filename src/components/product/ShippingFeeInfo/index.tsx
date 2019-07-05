// base
import React from 'react';

// modules
import { Input, Row, Col, Button } from 'antd';

// types
import { ResponseShippingFeeInfo } from 'types';

// less
import './index.less';

interface Props {
  shippingFreeInfo : ResponseShippingFeeInfo;
  onClickShippingFreeInfo: () => void;
  setShippingFreeInfoValue: any;
}

function ShippingFeeInfo(props: Props) {

  const { shippingFreeInfo, onClickShippingFreeInfo, setShippingFreeInfoValue } = props;
console.log(shippingFreeInfo)
  return (
    <div className="shippingFee-info">
      {shippingFreeInfo.shippingFee}
      <br />
      {shippingFreeInfo.shippingFreeCondition}
      <div className="shippingFee-info-title">
        <h2>배송비 설정</h2>
      </div>
      <Row className="shippingFee-info-row" justify="space-around">
        <Col span={3} className="shippingFee-info-col-center">
          배송비
        </Col>
        <Col span={2} className="shippingFee-info-col-right">
          배송비
        </Col>
        <Col span={3} className="shippingFee-info-col-padding">
          <Input
            className="shippingFee-info-input"
            name="shippingFee"
            value={shippingFreeInfo.shippingFee}
            size="small"
            type="Number"
            onChange={e => setShippingFreeInfoValue(e)}
          />
        </Col>
        <Col span={1} className="shippingFee-info-col-right">
          원
        </Col>
        <Col span={4} className="shippingFee-info-col-right">
          * 배송비 무료 조건 (금액 :
        </Col>
        <Col span={3} className="shippingFee-info-col-padding">
          <Input
            className="shippingFee-info-input"
            name="shippingFreeCondition"
            value={shippingFreeInfo.shippingFreeCondition}
            size="small"
            type="Number"
            onChange={e => setShippingFreeInfoValue(e)}
          />
        </Col>
        <Col span={4} className="shippingFee-info-col-left">
          원 이상 구매시 무료)
        </Col>
      </Row>
      <div className="shippingFee-info-button">
        <Button type="primary" size="large" onClick={onClickShippingFreeInfo}>배송비 수정</Button>
      </div>
    </div>
  )
}

export default ShippingFeeInfo;