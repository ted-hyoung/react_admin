// base
import React, { useState, useEffect } from 'react';

// modules
import { Affix, Tabs } from 'antd';

// assets
import './index.less';

// defines
const { TabPane } = Tabs;

export enum MainTabsKey {
  CELEBRITY = 'CELEBRITY',
  PRODUCT = 'PRODUCT',
  REVIEW = 'REVIEW',
  QNA = 'QNA',
}

interface Props {
  onChange?: (activeKey: string) => void;
}

function MainTabs(props: Props) {
  const { onChange } = props;

  const [affixed, setAffixed] = useState(false);

  const handleChangeAffix = (affixed: boolean | undefined) => {
    affixed ? setAffixed(affixed) : setAffixed(false);
  };

  return (
    <div className="main-tabs">
      <Affix offsetTop={70} onChange={handleChangeAffix}>
        <Tabs animated={false} tabBarStyle={affixed === false ? { border: 0 } : undefined} onChange={onChange}>
          <TabPane tab="CELEBRITY" key={MainTabsKey.CELEBRITY} />
          <TabPane tab="PRODUCT" key={MainTabsKey.PRODUCT} />
          <TabPane tab="REVIEW" key={MainTabsKey.REVIEW} />
          <TabPane tab="Q&A" key={MainTabsKey.QNA} />
        </Tabs>
      </Affix>
    </div>
  );
}

export default MainTabs;
