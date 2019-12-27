// base
import React, { useEffect, useMemo } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

// modules
import { Menu as AntMenu, Icon } from 'antd';
import { ClickParam } from 'antd/lib/menu';
import { getAdminProfile } from 'lib/utils';
const roleType = getAdminProfile() ? true : false;
const MENU_LIST = [
  {
    key: 'product',
    name: '상품 관리',
    icon: 'shop',
    role: false,
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
    icon: 'snippets',
    role: false,
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
    key: 'account',
    name: '회원 관리',
    icon: 'team',
    subMenus: [
      {
        key: 'account',
        name: '회원정보 조회',
      },
      // {
      //   key: 'withdrawal',
      //   name: '회원탈퇴 관리',
      // },
      // {
      //   key: 'resting',
      //   name: '회원휴먼 관리',
      // },
      // {
      //   key: 'level',
      //   name: '회원등급 관리',
      // },
    ],
  },
  {
    key: 'celeb',
    name: '셀럽',
    icon: 'star',
    subMenus: [
      {
        key: 'celebrity',
        name: '셀럽정보 조회',
      },
    ],
  },
  {
    key: 'statistics',
    name: '통계 관리',
    icon: 'bar-chart',
    role: false,
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
    icon: 'read',
    role: false,
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
      // {
      //   key: 'cs',
      //   name: 'cs 관리',
      // },
    ],
  },
  {
    key: 'event',
    name: '이벤트',
    icon: 'schedule',
    role: false,
    subMenus: [
      {
        key: 'exps',
        name: '체험단 후기',
      },
    ],
  },
  {
    key: 'banner',
    name: '배너 관리',
    icon: 'idcard',
    role: true,
    subMenus: [
      {
        key: 'banner',
        name: '배너 오픈 관리',
      },
      {
        key: 'bannerAdd',
        name: '배너 신규 등록',
      }
    ],
  },
];

  MENU_LIST.map((value , i) => {
    // INFLUENCER
    if(!roleType){
      if(value.role === true) {
        delete MENU_LIST[i];
      }
    }
  });

function Menu(props: RouteComponentProps) {
  const { history, location } = props;
  const defaultSelectedKeys = location.pathname.split('/')[1];
  const defaultOpenKeys = useMemo(
    () =>
      MENU_LIST.reduce((key, menu) => {
        if (menu.subMenus.find(subMenu => subMenu.key === defaultSelectedKeys)) {
          return menu.key;
        }
        return key;
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
              <Icon type={menu.icon} />
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