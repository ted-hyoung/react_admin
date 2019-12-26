import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { Button, Input, message, Modal, Table } from 'antd';
import {
  SearchAccount,
} from 'models';
import { useDispatch, useSelector } from 'react-redux';
import { getCelebsAsync } from '../../store/action/banner.action';
import { StoreState } from '../../store';

import { setPagingIndex } from '../../lib/utils';

import { ColumnProps, TableRowSelection } from 'antd/lib/table';

// defines
interface Props  {
  setAccountId : Dispatch<SetStateAction<string>>;
  setUsername : Dispatch<SetStateAction<string>>;
  setLoginId : Dispatch<SetStateAction<string>>;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

export interface AccountCelebForList {
  no:number
  loginId: string;
  username: string;
  accountId: string;
}

function SellerListModal(props: Props) {
  const { setAccountId, setUsername, setLoginId ,visible, setVisible } = props;
  const { selebs } = useSelector((state: StoreState) => state.banner);
  const { totalElements, size: pageSize, page } = selebs;
  const [searchValue, setSearchValue] = useState();
  const [lastSearchCondition, setLastSearchCondition] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const dispatch = useDispatch();

  const getCelebs = useCallback(

    (page: number, size = pageSize, searchText?: SearchAccount) => {

      dispatch(
        getCelebsAsync.request({
          page,
          size,
          searchText,
        }),
      );
      setLastSearchCondition(searchText);
    },
    [dispatch, pageSize, setLastSearchCondition],
  );

  useEffect(() => {
    getCelebs(0);
  }, []);

  const onCancel = useCallback(() => {
    setVisible(false);
  }, []);

  const columns: Array<ColumnProps<AccountCelebForList>> = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: '셀럽ID',
      dataIndex: 'loginId',
      key: 'loginId',
    },
    {
      title: '셀럽성명',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '선택',
      dataIndex: 'button',
      key: 'button',
      render: (text,selebs ) =>
        <>
          <Button style={{ marginRight: '5px' }} type="primary" onClick={() => handleSelectedSeleb({no:selebs.no, loginId : selebs.loginId, accountId : selebs.accountId, username : selebs.username})}>
            선택
          </Button>
      </>
    }
  ];


  const handleSelectedSeleb = (value:AccountCelebForList) => {
    message.info(`${value.loginId}/${value.username} 선택되었습니다.`);
    setUsername(value.username);
    setAccountId(value.accountId);
    setLoginId(value.loginId);
  };
  const dataSource: Array<AccountCelebForList> = selebs.content.map((item, i )=> {
    return {
      no: setPagingIndex(totalElements, page, pageSize, i),
      accountId: item.accountId,
      loginId: item.loginId,
      username: item.username,
    };
  });

  const handlePaginationChange = useCallback(
    (currentPage: number) => {
      getCelebs(currentPage - 1, pageSize, lastSearchCondition);
    },
    [getCelebs, pageSize, lastSearchCondition],
  );


  const handleSearchAccount = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setSearchValue(e.target.value)
  };

  const searchSeleb = () => {
    if (searchValue) {
      getCelebs(0, 10, searchValue);
    }
  };

  return (
    <Modal
      centered
      destroyOnClose
      visible={visible}
      footer={null}
      title="셀럽 ID/성명 검색"
      onCancel={onCancel}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' ,marginBottom: '10px'}}>
        <Input placeholder="ID 또는 성명을 입력해주세요"  onChange={handleSearchAccount}/>
        <Button type="primary"  icon="search" style={{marginLeft: '9px', width: '60px'}} onClick={searchSeleb}/>
      </div>
      <Table
        scroll={{ x: 320 }}
        rowKey={record => record.loginId}
        dataSource={dataSource}
        columns={columns}
        pagination={{
          total: selebs.totalElements,
          pageSize: selebs.size,
          onChange: handlePaginationChange,
        }}
      />
    </Modal>
  );
}

export default SellerListModal;
