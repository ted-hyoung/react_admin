// base
import React, { useEffect, useMemo } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

// modules
import { Menu as AntMenu, Icon } from 'antd';
import { ClickParam } from 'antd/lib/menu';

const MENU_LIST = [
  {
    key: 'store',
    name: '상점 관리',
    subMenus: [
      {
        key: 'account',
        name: '계정 관리',
      },
      {
        key: 'celeb',
        name: '셀럽 관리',
      },
      {
        key: 'settlement',
        name: '결산 관리',
      },
    ],
  },
  {
    key: 'product',
    name: '상품 관리',
    subMenus: [
      {
        key: 'events',
        name: '공구 관리',
      },
    ],
  },
  {
    key: 'order',
    name: '주문 관리',
    subMenus: [
      {
        key: 'orders',
        name: '전체 주문 조회',
      },
      {
        key: 'shipping',
        name: '배송 관리',
      },
    ],
  },
  {
    key: 'statistics',
    name: '통계 관리',
    subMenus: [
      {
        key: 'sales',
        name: '매출 통계',
      },
    ],
  },
  {
    key: 'board',
    name: '게시판 관리',
    subMenus: [
      {
        key: 'review',
        name: '후기 관리',
      },
      {
        key: 'qna',
        name: 'Q & A 관리',
      },
      {
        key: 'contact',
        name: '1:1 문의 관리',
      },
      {
        key: 'cs',
        name: 'cs 관리',
      },
    ],
  },
];

function Menu(props: RouteComponentProps) {
  const { history, location } = props;

  const defaultSelectedKeys = location.pathname.split('/')[1];
  const defaultOpenKeys = useMemo(
    () =>
      MENU_LIST.reduce((ac, menu) => {
        if (menu.subMenus.find(subMenu => subMenu.key === defaultSelectedKeys)) {
          return menu.key;
        }

        return ac;
      }, ''),
    [defaultSelectedKeys],
  );

  const handleClickMenu = (param: ClickParam) => {
    const { key } = param;

    history.push('/' + key);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.key]);

  return (
    <AntMenu
      defaultOpenKeys={[defaultOpenKeys]}
      defaultSelectedKeys={[defaultSelectedKeys]}
      mode="inline"
      style={{ width: 200, height: '100%' }}
      onClick={handleClickMenu}
    >
      {MENU_LIST.map(menu => (
        <AntMenu.SubMenu
          key={menu.key}
          title={
            <span>
              <Icon type="appstore" />
              <span>{menu.name}</span>
            </span>
          }
        >
          {menu.subMenus.map(subMenu => (
            <AntMenu.Item key={subMenu.key}>{subMenu.name}</AntMenu.Item>
          ))}
        </AntMenu.SubMenu>
      ))}
    </AntMenu>
  );
}

export default withRouter(Menu);
