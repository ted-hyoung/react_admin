// base
import React from 'react';

// modules
import { Row, Col, Affix, Button } from 'antd';

// components
import { MenuIcon, LogoIcon } from 'components/template/TemplateIcons';

// assets
import './index.less';

function TemplateHeader() {
  return (
    <header className="header">
      <Affix style={{ borderBottom: '1px solid #f6f6f6' }}>
        <Row type="flex" align="middle">
          <Col>
            <Button className="btn-menu" ghost shape="circle">
              <MenuIcon />
            </Button>
          </Col>
          <Col className="header-logo">
            <LogoIcon />
          </Col>
        </Row>
      </Affix>
    </header>
  );
}

export default TemplateHeader;
