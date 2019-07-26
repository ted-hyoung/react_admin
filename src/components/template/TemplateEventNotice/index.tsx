// base
import React, { useEffect } from 'react';

// modules
import anime from 'animejs';

import './index.less';
import { ResponseEventNotice } from 'types/EventNotice';

interface Props {
  eventNotices: ResponseEventNotice[];
}

function TemplateEventNotice(props: Props) {
  const { eventNotices } = props;

  const innerWidth = window.innerWidth;

  useEffect(() => {
    anime({
      targets: '.event-notice-screen p',
      duration: innerWidth < 1080 ? 4000 : 8000,
      translateX: innerWidth * 2,
      delay: (el, i) => el && i * 1000,
      loop: true,
      easing: 'linear',
    });
  }, [anime]);

  return (
    <div className="event-notice">
      <hr style={{ margin: '40px 0', borderStyle: 'dashed', opacity: 0.5 }} />
      <div className="event-notice-screen">
        {eventNotices.map(eventNotice => (
          <p key={eventNotice.eventNoticeId} style={{ left: -innerWidth }}>
            {eventNotice.contents}
          </p>
        ))}
      </div>
    </div>
  );
}

export default TemplateEventNotice;
