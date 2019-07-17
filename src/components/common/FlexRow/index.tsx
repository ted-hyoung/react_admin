// base
import React from 'react';

// modules
import { Row } from 'antd';
import { RowProps } from 'antd/lib/row';

function FlexRow(props: RowProps) {
  return (
    <Row type="flex" align="middle" gutter={10} {...props}>
      {props.children}
    </Row>
  );
}

export default FlexRow;
