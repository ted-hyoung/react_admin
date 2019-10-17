import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// store
import { StoreState } from 'store';
import { getContactsAsync, getContactsCountAsync } from 'store/reducer/contact';

// types
import { SearchContact, ResponseContact } from 'models';
import { QnaStatus, CsrCategory } from 'enums';
import { ColumnProps } from 'antd/lib/table';

// modules
import { Tag, Divider, Select, Input, Form } from 'antd';
import moment from 'moment';

// components
import { ContactCommentRow, PaginationTable, SearchBar } from 'components';

// lib
import useModal from 'lib/hooks/useModal';
import { mapEnums } from 'lib/utils';

const contactColumns: Array<ColumnProps<ResponseContact>> = [
  {
    title: 'No',
    dataIndex: 'contactId',
    key: 'contactId',
  },
  {
    title: '상태',
    dataIndex: 'status',
    key: 'status',
    render: status => (
      <Tag color={QnaStatus[status as QnaStatus] === QnaStatus.COMPLETE ? 'blue' : 'gold'}>
        {QnaStatus[status as QnaStatus]}
      </Tag>
    ),
  },
  {
    title: '분류',
    dataIndex: 'category',
    key: 'category',
    render: category => CsrCategory[category as CsrCategory],
  },
  {
    title: '공구명',
    dataIndex: 'event',
    key: 'event',
    render: event => event && event.name,
  },
  {
    title: '문의 내용',
    dataIndex: 'contents',
    key: 'contents',
    width: 500,
  },
  {
    title: '접수일',
    dataIndex: 'created',
    key: 'created',
    render: created => moment(created).format('YYYY-MM-DD HH:mm:ss'),
  },
];

const qnaStatus = mapEnums(QnaStatus);

function Contact() {
  const dispatch = useDispatch();
  const openModal = useModal();
  const { contacts, counts } = useSelector((state: StoreState) => state.contact);
  const { content, size: pageSize, totalElements } = contacts;
  const [lastSearchCondition, setLastSearchCondition] = useState<SearchContact>();

  const getContacts = useCallback(
    (page: number, size = pageSize, searchCondition?: SearchContact) => {
      dispatch(
        getContactsAsync.request({
          page,
          size,
          searchCondition,
        }),
      );
      setLastSearchCondition(searchCondition);
    },
    [dispatch, pageSize, setLastSearchCondition],
  );

  const getCounts = useCallback(() => {
    dispatch(getContactsCountAsync.request({}));
  }, [dispatch]);

  const handleChangePageSize = useCallback(
    (value: number) => {
      getContacts(0, value, lastSearchCondition);
    },
    [getContacts, lastSearchCondition],
  );

  const handleClickImage = useCallback(
    (contactId: number, imageIndex: number) => {
      const selectedContact = contacts.content.find(contact => contact.contactId === contactId);
      if (selectedContact) {
        openModal({
          type: 'gallery',
          content: {
            images: selectedContact.images,
            currentIndex: imageIndex,
          },
        });
      }
    },
    [openModal, contacts],
  );

  const handleSearch = useCallback(
    (val: any) => {
      Object.keys(val).forEach(key => {
        if (key === 'status' && val[key] === '') {
          delete val[key];
          return;
        }
      });
      getContacts(0, pageSize, val);
    },
    [getContacts, pageSize],
  );

  // pagination onChange
  const handlePaginationChange = useCallback(
    (currentPage: number) => {
      getContacts(currentPage - 1, pageSize, lastSearchCondition);
    },
    [getContacts, lastSearchCondition, pageSize],
  );

  // componentDidMount
  useEffect(() => {
    getContacts(0);
    getCounts();
  }, []);

  return (
    <div>
      <SearchBar
        onSearch={handleSearch}
        onReset={() => getContacts(0)}
        customFormItems={form => [
          <div style={{ display: 'flex' }} key="test">
            <Form.Item>
              {form.getFieldDecorator('status', {
                initialValue: '',
              })(
                <Select style={{ width: 120, marginRight: 5 }}>
                  <Select.Option value="">전체</Select.Option>
                  {qnaStatus.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.key}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
            <Form.Item style={{ flexGrow: 1 }}>{form.getFieldDecorator('keyword')(<Input />)}</Form.Item>
          </div>,
        ]}
      />
      <Divider />
      <div style={{ float: 'left', marginTop: 10 }}>답변대기 : {counts.wait}건</div>
      <PaginationTable
        scroll={{ x: 720 }}
        onChangePageSize={handleChangePageSize}
        rowKey={contact => contact.contactId.toString()}
        dataSource={content}
        columns={contactColumns}
        pagination={{
          total: totalElements,
          pageSize,
          onChange: handlePaginationChange,
        }}
        expandedRowRender={contact => <ContactCommentRow {...contact} onClickImage={handleClickImage} />}
        expandRowByClick
      />
    </div>
  );
}

export default Contact;
