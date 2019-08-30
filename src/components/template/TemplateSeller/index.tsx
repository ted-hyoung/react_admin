// base
import React from 'react';

// modules
import { Row, Col, Avatar } from 'antd';

// lib
import { getThumbUrl } from 'lib/utils';

// components
import { InstagramIcon, YoutubeIcon, HeartTopIcon } from 'components/template/TemplateIcons';

// types
import { ResponseEvent } from 'types';

// assets
import './index.less';

interface Props {
  event: ResponseEvent;
  src?: string;
  alt?: string;
  size?: number;
}

function TemplateSeller(props: Props) {
  const { event, size = 80 } = props;
  const { creator } = event;

  return (
    <div className="seller" style={{ padding: '20px 30px' }}>
      <Row type="flex">
        <Col>
          <Avatar
            size={size}
            src={creator.avatar ? getThumbUrl(creator.avatar.fileKey, 120, 120, 'scale') : ''}
            alt={creator.username}
          />
        </Col>
        <Col style={{ marginLeft: 20, padding: '12px 0' }}>
          <strong className="seller-name">{creator.username}</strong>
          <ul className="seller-sns">
            <li className="seller-sns-item">
              <InstagramIcon />
              <span>{creator.sns.instagramFollowers}</span>
            </li>
            <li className="seller-sns-item">
              <YoutubeIcon />
              <span>{creator.sns.youtubeSubscriberCount}</span>
            </li>
            <li className="seller-sns-item" style={{ width: 16, height: 16 }}>
              <HeartTopIcon />
              <span>{event.likeCnt.toLocaleString()}</span>
            </li>
          </ul>
        </Col>
      </Row>
    </div>
  );
}

export default TemplateSeller;
