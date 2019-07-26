// base
import React, { useMemo } from 'react';

// modules
import { Typography, Carousel } from 'antd';
import moment from 'moment';

// components
import { HeartOnIcon, PlayIcon } from 'components/template/TemplateIcons';

// types
import { FileObject } from 'types';

// assets
import mainImage from 'assets/images/main-image.png';

import './index.less';
import { getThumbUrl } from 'lib/utils';

// defines
const { Paragraph } = Typography;

interface Props {
  name: string;
  salesStarted: string;
  salesEnded: string;
  like: number;
  images: FileObject[];
  href?: string;
}

const DATE_FORMAT = 'M.D ddd';

function TemplateEventBanner(props: Props) {
  const { name, salesStarted, salesEnded, like, images, href } = props;

  const [startDate, endDate] = useMemo(() => {
    const startDate = moment(salesStarted).format(DATE_FORMAT);
    const endDate = moment(salesEnded).format(DATE_FORMAT);

    return [startDate, endDate];
  }, [salesStarted, salesEnded]);

  return (
    <div className="event-banner">
      <div className="event-banner-carousel">
        <Carousel autoplay effect="fade">
          {images.map(image => (
            <div key={image.fileObjectId} className="event-banner-carousel-image">
              <img src={getThumbUrl(image.fileKey)} alt={image.fileName} />
            </div>
          ))}
          {/* <div className="event-banner-carousel-image">
            <img src={mainImage} alt="" />
          </div>
          <div className="event-banner-carousel-image">
            <img src={mainImage} alt="" />
          </div>
          <div className="event-banner-carousel-image">
            <img src={mainImage} alt="" />
          </div>
          <div className="event-banner-carousel-image">
            <img src={mainImage} alt="" />
          </div> */}
        </Carousel>
      </div>
      <div className="event-banner-contents">
        <Paragraph className="event-banner-name">{name}</Paragraph>
        <Paragraph className="event-banner-term">{`${startDate} - ${endDate}`}</Paragraph>
        <Paragraph className="event-banner-like">
          <HeartOnIcon />
          <strong>좋아요</strong>
          {like}
        </Paragraph>
      </div>
      {href && (
        <a className="event-banner-link" href={href} target="_blank" rel="noopener noreferrer">
          <PlayIcon />
        </a>
      )}
    </div>
  );
}

export default TemplateEventBanner;
