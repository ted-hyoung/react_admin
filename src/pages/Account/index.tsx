// base
import React, { useCallback, useEffect, useState, useRef, Dispatch, SetStateAction } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactToPrint from 'react-to-print';

// store
import { StoreState } from 'store';

// modules
import { Table, Button, Row, Col, Select, Modal, message, Statistic, Divider, Tag } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';

// lib
import { payCancelHost } from 'lib/protocols';

// containers
import { AccountDetailModal, AccountSearchBar } from 'containers';

// utils
import { startDateFormat, endDateFormat, dateTimeFormat, createExcel } from 'lib/utils';
import { ResponseAccounts, ResponseOption, SearchAccounts, SearchOrder } from '../../models';
import { getAccountsAsync } from '../../store/action/account.action';
import './index.less';

// defines
const { Option } = Select;
const { confirm } = Modal;
const defaultSearchCondition = {
  startDate: moment(new Date()).format(startDateFormat),
  endDate: moment(new Date()).format(endDateFormat),
};

const Account = () => {
  const dispatch = useDispatch();
  const printRef = useRef<any>();
  const { accounts } = useSelector((storeState: StoreState) => storeState.accountState);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[] | number[]>([]);
  const { size: pageSize, totalElements, content } = accounts;
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

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: string[] | number[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const handleChangeBlackMember = (ids: string[] | number[]) => {
    console.log(ids);
  };
  const handleDeleteAccount = (ids: string[] | number[]) => {
    console.log(ids);
  };

  const handleVisible = (id : string) => {
    setVisible(true);
    setAccount(content.find(item => item.loginId === id));
  };

  const columns: Array<ColumnProps<ResponseAccounts>> = [
    { title: '가입일', dataIndex: 'created', key: 'created'},
    { title: '이름', dataIndex: 'userName', key: 'userName' },
    { title: '아이디', dataIndex: 'loginId', key: 'loginId' },
    {
      title: '가입수단', dataIndex: 'loginMethod', key: 'loginMethod',
      render: (text: string, account: ResponseAccounts, index: number) => {
        return <Tag style={{color: '#381e1f'}} color={account.loginMethod === '카카오톡' ? '#e4d533' : '#a6a6a6'}>{account.loginMethod}</Tag>;
      }
    },
    { title: '등급', dataIndex: 'grade', key: 'grade' },
    { title: '연락처', dataIndex: 'phone', key: 'phone' },
    { title: '광고 수신동의',
      dataIndex: 'isAdvertise',
      key: 'isAdvertise',
      render: (text: string, account: ResponseAccounts, index: number) => {
        return account.isAdvertise ? ('수신동의') : ('수신거부');
      }
    },
    {
      title: '관련 내역 보기',
      dataIndex: 'button',
      key: 'button',
      render: (text, account) =>
        <>
          <Button style={{ marginRight: '5px' }} type="primary" onClick={() => handleVisible(account.loginId)}>
            보기
          </Button>
          <Button style={{ marginRight: '5px' }} disabled={true} type="primary" onClick={() => console.log()}>
            적립금
          </Button>
          <Button style={{ marginRight: '5px' }} disabled={true} type="primary" onClick={() => console.log()}>
            쿠폰
          </Button>
        </>
    }
  ];

  const dataSource: ResponseAccounts[] = accounts.content.map((account, i) => {
    return {
      created: moment(account.created).format(dateTimeFormat),
      userName: account.userName,
      loginId: account.loginId,
      loginMethod: account.loginMethod,
      grade: account.grade,
      phone: account.phone,
      isAdvertise: account.isAdvertise,
      button: account.loginId,
    };
  });
  return (
    <div className="account">
      <AccountSearchBar
        onSearch={value => console.log('onSearch : ' ,value)}
        onReset={() => (alert('onReset'))}
      />
      <Divider />
      {accounts.size > 0 &&
        <Table style={{ padding: '16px 10px'}}
          rowKey={accounts => accounts.loginId.toString()+'_'+accounts.userName}
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
                  <Button type="primary" icon="download" onClick={() => console.log('excelDownload')}>
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
