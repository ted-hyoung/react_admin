// base
import React from 'react';

// modules
import { Layout, Button, Modal } from 'antd';

// utils
import { logout } from 'lib/utils';

const { Header: AntdHeader } = Layout;

function Header() {
  const handleClick = () => {
    Modal.confirm({
      title: '로그아웃 하시겠습니까?',
      cancelText: '취소',
      okText: '확인',
      onOk: () => {
        logout();
      },
    });
  };
  return (
    <AntdHeader style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e8e8e8' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>FROM C</span>
        <Button onClick={handleClick}>로그아웃</Button>
      </div>
    </AntdHeader>
  );
}

export default Header;
