// base
import React, { useCallback, useEffect, useState, useRef, Dispatch, SetStateAction } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactToPrint from 'react-to-print';

// store
import { StoreState } from 'store';

// modules
import { Table, Button, Row, Col, message, Divider, Tag } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';



// containers
import { AccountDetailModal, AccountSearchBar } from 'containers';

// enums
import { SocialProviderCode } from 'enums';

// utils
import { dateTimeFormat, createExcel } from 'lib/utils';
import { ResponseAccounts, SearchAccounts, SearchOrder } from '../../models';
import { getAccountsAsync } from '../../store/action/account.action';
import './index.less';




const Account = () => {
  const dispatch = useDispatch();
  const printRef = useRef<any>();
  const { accounts } = useSelector((storeState: StoreState) => storeState.accountState);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[] | number[]>([]);
  const { size: pageSize, totalElements, content } = accounts;
  const [excelDownload, setExcelDownload] = useState<boolean>(false);

  const [lastSearchCondition, setLastSearchCondition] = useState<SearchOrder>();
  const [account, setAccount] = useState<ResponseAccounts>();
  const [visible, setVisible] = useState<boolean>(false);

  const getAccounts = useCallback(

    (page: number, size = pageSize, searchCondition?: SearchAccounts) => {
      dispatch(
        getAccountsAsync.request({
          page,
          size,
          searchCondition,
        }),
      );
      setLastSearchCondition(searchCondition);
    },
    [dispatch, pageSize, setLastSearchCondition],
  );

  const handlePaginationChange = useCallback(
    (currentPage: number) => {
      getAccounts(currentPage - 1, pageSize, lastSearchCondition);
    },
    [getAccounts, pageSize, lastSearchCondition],
  );

  useEffect(() => {
    getAccounts(0, pageSize);
  }, [getAccounts, pageSize]);

  useEffect(() => {
    if (excelDownload) {
      createAccountExcel();
      setExcelDownload(false);
    }
  }, [excelDownload]);


  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: string[] | number[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const handleChangeBlackMember = (ids: string[] | number[]) => {
    message.info("준비중입니다.");
  };

  const handleDeleteAccount = (ids: string[] | number[]) => {
    message.info("준비중입니다.");
  };

  const handleVisible = (id : string) => {
    setVisible(true);
    setAccount(content.find(item => item.consumerId === id));
  };

  const columns: Array<ColumnProps<ResponseAccounts>> = [
    { title: '가입일', dataIndex: 'created', key: 'created'},
    { title: '이름', dataIndex: 'username', key: 'username' },
    { title: '아이디', dataIndex: 'loginId', key: 'loginId' },
    { title: '가입수단', dataIndex: 'socialProvider', key: 'socialProvider',
      render: (text: string, account: ResponseAccounts, index: number) => {
        if(SocialProviderCode[account.socialProvider] === SocialProviderCode.KAKAO){
          return (
            <Tag
              className="tag-badge"
              style={{ color:  '#381e1f' }}
              color={'#e4d533'}
            >
              {SocialProviderCode[account.socialProvider]}
            </Tag>
          )
        }else if(SocialProviderCode[account.socialProvider] === SocialProviderCode.NAVER){
          return (
            <Tag
              className="tag-badge"
              style={{ color: '#ffffff' }}
              color={'#1bba00'}
            >
              {SocialProviderCode[account.socialProvider]}
            </Tag>
          )
        }else{
          return (
            <Tag
              className="tag-badge"
              style={{ color: '#ffffff' }}
              color={'#909090'}>
              {SocialProviderCode[account.socialProvider]}
            </Tag>
          )
        }
      }
    },
    { title: '연락처', dataIndex: 'phone', key: 'phone' },
    { title: '광고 수신동의',
      dataIndex: 'marketingInfoAgree',
      key: 'marketingInfoAgree',
      render: (text: string, account: ResponseAccounts, index: number) => {
        return account.marketingInfoAgree ? ('수신동의') : ('수신거부');
      }
    },
    {
      title: '관련 내역 보기',
      dataIndex: 'button',
      key: 'button',
      render: (text, account) =>
        <>
          <Button style={{ marginRight: '5px' }} type="primary" onClick={() => handleVisible(account.consumerId)}>
            보기
          </Button>
          <Button style={{ marginRight: '5px' }} disabled={true} type="primary" onClick={() => console.log('적립금')}>
            적립금
          </Button>
          <Button style={{ marginRight: '5px' }} disabled={true} type="primary" onClick={() => console.log('쿠폰')}>
            쿠폰
          </Button>
        </>
    }
  ];

  const dataSource: ResponseAccounts[] = accounts.content.map((account, i) => {
    return {
      created: moment(account.created).format(dateTimeFormat),
      username: account.username,
      loginId:account.loginId,
      consumerId: account.consumerId,
      socialProvider: account.socialProvider,
      phone: account.phone,
      marketingInfoAgree: account.marketingInfoAgree,
      button: account.consumerId,
    };
  });

  const getAccountExcel = useCallback(() => {
    dispatch(getAccountsAsync.request({ lastSearchCondition }));
    setExcelDownload(true);
  }, [dispatch, lastSearchCondition]);

  const createAccountExcel = () => {
    const data = [
      [
        'NO',
        '가입일',
        '이름',
        '아이디',
        '가입수단',
        '연락처',
        '광고수신동의'
      ],
    ];

    if (content.length > 0) {
      content.forEach((item, i) => {
        data.push([
          (i+1).toString(),
          moment(item.created).format(dateTimeFormat),
          item.username,
          item.loginId,
          SocialProviderCode[item.socialProvider],
          item.phone,
          item.marketingInfoAgree ? '동의' : '미동의',
        ]);
      });
      createExcel(data);
    }
  };

  return (
    <div className="account">
      <AccountSearchBar
        onSearch={value => getAccounts(0, pageSize, value)}
        onReset={() => (alert('onReset'))}
      />
      <Divider />
      {accounts.size > 0 &&
      <Table style={{ padding: '16px 10px'}}
             rowKey={accounts => accounts.consumerId.toString()+'_'+accounts.username}
             title={() => (
               <>
                 <Row type="flex" justify="space-between">
                   <Col>
                     <p style={{marginBottom: '10px'}}>검색결과 총 {accounts.totalElements}건</p>
                   </Col>
                 </Row>
                 <Row type="flex" justify="space-between">
                   <Col>
                     <Button style={{ marginRight: '5px' }} icon= "frown" onClick={() => handleChangeBlackMember(selectedRowKeys)}>
                       블랙회원 설정
                     </Button>
                     <Button type="danger" icon="user-delete" onClick={() => handleDeleteAccount(selectedRowKeys)}>
                       삭제
                     </Button>
                   </Col>
                   <Col>
                     <Button type="primary" icon="download" onClick={getAccountExcel}>
                       엑셀 다운로드
                     </Button>
                     <ReactToPrint
                       trigger={() => (
                         <Button style={{ marginLeft: 4 }} type="danger">
                           인쇄
                         </Button>
                       )}
                       content={() => printRef.current}
                     />
                   </Col>
                 </Row>
               </>
             )}
             rowSelection={rowSelection}
             ref={printRef}
             columns={columns}
             dataSource={dataSource}
             pagination={{
               total: accounts.totalElements,
               pageSize: accounts.size,
               onChange: handlePaginationChange,
             }}
      />
      }
      { account &&
      <AccountDetailModal
        visible={visible}
        onCancel={() => setVisible(false)}
        account={account}
      />
      }
    </div>
  );
};

export default Account;
