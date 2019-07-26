// base
import React from 'react';

// modules
import { Row, Col, Avatar } from 'antd';

// components
import { InstagramIcon, YoutubeIcon } from 'components/template/TemplateIcons';

// assets
import exampleAvatar from 'assets/images/template/example-avatar.png';
import './index.less';

interface Props {
  src?: string;
  alt?: string;
  size?: number;
}

function TemplateSeller(props: Props) {
  const { src, alt, size = 80 } = props;

  return (
    <div className="seller" style={{ padding: '20px 30px' }}>
      <Row type="flex">
        <Col>
          <Avatar size={size} src={exampleAvatar} alt={alt} />
        </Col>
        <Col style={{ marginLeft: 20, padding: '12px 0' }}>
          <strong className="seller-name">조민영</strong>
          <ul className="seller-sns">
            <li className="seller-sns-item">
              <InstagramIcon />
              <span>42.1K</span>
            </li>
            <li className="seller-sns-item">
              <YoutubeIcon />
              <span>84,594</span>
            </li>
          </ul>
        </Col>
      </Row>
    </div>
  );
}

export default TemplateSeller;
