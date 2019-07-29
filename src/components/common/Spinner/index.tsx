// base
import React from 'react';

// modules
import { Icon } from 'antd';

import './index.less';

function Spinner() {
  return (
    <div className="spinner">
      <Icon type="loading" />
    </div>
  );
}

export default Spinner;
