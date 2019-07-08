// base
import React, { useState, useEffect, useMemo } from 'react';
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
        key: 'question',
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

  const defaultSelectedKeys = useMemo(() => location.pathname.split('/')[1], []);
  const defaultOpenKeys = useMemo(
    () =>
      MENU_LIST.reduce((ac, menu) => {
        if (menu.subMenus.find(subMenu => subMenu.key === defaultSelectedKeys)) {
          return menu.key;
        }

        return ac;
      }, ''),
    [],
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
      style={{ width: 200, height: '100vh' }}
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
    // <AntMenu
    //   defaultOpenKeys={['dep1']}
    //   defaultSelectedKeys={['1']}
    //   mode="inline"
    //   style={{ width: 200, height: '100vh' }}
    // >
    //   <AntMenu.SubMenu
    //     key="dep1"
    //     title={
    //       <span>
    //         <Icon type="appstore" />
    //         <span>상점 관리</span>
    //       </span>
    //     }
    //   >
    //     <AntMenu.Item key="1">계정 관리</AntMenu.Item>
    //     <AntMenu.Item key="2">셀럽 페이지 관리</AntMenu.Item>
    //     <AntMenu.Item key="3">결산 관리</AntMenu.Item>
    //   </AntMenu.SubMenu>
    //   <AntMenu.SubMenu
    //     key="dep2"
    //     title={
    //       <span>
    //         <Icon type="shopping" />
    //         <span>상품 관리</span>
    //       </span>
    //     }
    //   >
    //     <AntMenu.Item key="4">공구 관리</AntMenu.Item>
    //   </AntMenu.SubMenu>
    //   <AntMenu.SubMenu
    //     key="dep3"
    //     title={
    //       <span>
    //         <Icon type="appstore" />
    //         <span>주문 관리</span>
    //       </span>
    //     }
    //   >
    //     <AntMenu.Item key="5">전체 주문 조회</AntMenu.Item>
    //     <AntMenu.Item key="6">배송 관리</AntMenu.Item>
    //   </AntMenu.SubMenu>
    //   <AntMenu.SubMenu
    //     key="dep4"
    //     title={
    //       <span>
    //         <Icon type="appstore" />
    //         <span>통계 관리</span>
    //       </span>
    //     }
    //   >
    //     <AntMenu.Item key="7">매출 통계</AntMenu.Item>
    //   </AntMenu.SubMenu>
    //   <AntMenu.SubMenu
    //     key="dep5"
    //     title={
    //       <span>
    //         <Icon type="appstore" />
    //         <span>게시판 관리</span>
    //       </span>
    //     }
    //   >
    //     <AntMenu.Item key="8">후기 관리</AntMenu.Item>
    //     <AntMenu.Item key="9">Q & A 관리</AntMenu.Item>
    //     <AntMenu.Item key="10">1 : 1 문의 관리</AntMenu.Item>
    //     <AntMenu.Item key="11">CS 관리</AntMenu.Item>
    //   </AntMenu.SubMenu>
    // </AntMenu>
  );
}

export default withRouter(Menu);
