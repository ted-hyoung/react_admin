// base
import React, { useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

// modules
import {
  TemplateHeader,
  TemplateSeller,
  TemplateEventTimer,
  TemplateEventBanner,
  TemplateEventAttainment,
  TemplateEventNotice,
  TemplateMainTabs,
} from 'components';

import './index.less';
import { useSelector, useDispatch } from 'react-redux';
import { StoreState } from 'store';
import { getEventByIdAsync } from 'store/reducer/event';
import { MainTabsKey } from 'components/template/TemplateMainTabs';
import TempalteQna from './TempalteQna';
import TemplateReview from './TemplateReview';
import TemplateCelebrity from './TemplateCelebrity';
import TemplateProduct from './TemplateProduct';

interface Match {
  id: string;
}

function EventTemplate(props: RouteComponentProps<Match>) {
  const { match } = props;
  const { id } = match.params;

  const [activeKey, setActiveKey] = useState<MainTabsKey>(MainTabsKey.CELEBRITY);
  const { event } = useSelector((state: StoreState) => state.event);
  const dispatch = useDispatch();

  const handleChangeTabs = (activeKey: string) => {
    setActiveKey(activeKey as MainTabsKey);
  };

  useEffect(() => {
    dispatch(getEventByIdAsync.request({ id: Number(id) }));
  }, []);

  const { name, salesStarted, salesEnded, images } = event;

  return (
    <div className="event-template">
      <div className="event-template-header">
        <TemplateHeader />
      </div>
      <div className="event-template-content">
        <TemplateSeller />
        <TemplateEventBanner
          name={name}
          salesStarted={salesStarted}
          salesEnded={salesEnded}
          like={30}
          images={images}
        />
        <div style={{ padding: '46px 50px' }}>
          <TemplateEventTimer />
          <TemplateEventAttainment targetAmountAttainmentRate={0} />
          <TemplateEventNotice eventNotices={event.eventNotices} />
        </div>
        <TemplateMainTabs onChange={handleChangeTabs} />
        {activeKey === MainTabsKey.CELEBRITY && <TemplateCelebrity />}
        {activeKey === MainTabsKey.PRODUCT && <TemplateProduct />}
        {activeKey === MainTabsKey.REVIEW && <TemplateReview />}
        {activeKey === MainTabsKey.QNA && <TempalteQna />}
      </div>
    </div>
  );
}

export default withRouter(EventTemplate);
