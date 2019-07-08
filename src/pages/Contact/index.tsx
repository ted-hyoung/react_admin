import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// store
import { StoreState } from 'store';
import { getContactsAsync, getContactsCountAsync } from 'store/reducer/contact';

// types
import { SearchContact, ResponseContact } from 'types';
import { QnaStatus, CsrCategory } from 'enums';
import { ColumnProps } from 'antd/lib/table';

// modules
import { Tag, Divider, Select, Input, Form } from 'antd';
import moment from 'moment';

// components
import { ContactCommentRow, PaginationTable, GalleryModal, SearchBar } from 'components';

const dummy = Array(5).fill({ src: 'http://placehold.it/300x300' });

function Contact() {
  const dispatch = useDispatch();
  const { contacts, counts } = useSelector((state: StoreState) => state.contact);
  const { content, size: pageSize } = contacts;

  const [galleryVisible, setGalleryVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getContacts = useCallback(
    (page: number, size = pageSize, searchCondition?: SearchContact) => {
      dispatch(
        getContactsAsync.request({
          page,
          size,
          searchCondition,
        }),
      );
    },
    [dispatch, pageSize],
  );

  const getCounts = useCallback(() => {
    dispatch(getContactsCountAsync.request({}));
  }, [dispatch]);

  const handleChangePageSize = useCallback(
    (value: string) => {
      getContacts(Number(value));
    },
    [getContacts],
  );

  const handleClickImage = useCallback(
    (imageIndex: number) => {
      setCurrentImageIndex(imageIndex);
      setGalleryVisible(true);
    },
    [setCurrentImageIndex, setGalleryVisible],
  );

  const handleSearch = useCallback(
    (val: any) => {
      Object.keys(val).map(key => {
        if (key === 'status' && val[key] === 'ENTIRE') {
          delete val[key];
          return;
        }
      });
      getContacts(0, pageSize, val);
    },
    [getContacts, pageSize],
  );

  // componentDidMount
  useEffect(() => {
    getContacts(0);
    getCounts();
  }, []);

  const contactColumns: Array<ColumnProps<ResponseContact>> = useMemo(
    () => [
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
          <Tag color={QnaStatus[status] === QnaStatus.COMPLETE ? 'blue' : 'gold'}>{QnaStatus[status]}</Tag>
        ),
      },
      {
        title: '분류',
        dataIndex: 'category',
        key: 'category',
        render: category => CsrCategory[category],
      },
      {
        title: '공구명',
        dataIndex: 'eventName',
        key: 'eventName',
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
    ],
    [],
  );

  return (
    <div>
      <SearchBar
        onSearch={handleSearch}
        onReset={() => getContacts(0)}
        customFormItems={form => [
          <div style={{ display: 'flex' }} key="test">
            <Form.Item>
              {form.getFieldDecorator('status', {
                initialValue: 'ENTIRE',
              })(
                <Select style={{ width: 120, marginRight: 5 }}>
                  <Select.Option value="ENTIRE">전체</Select.Option>
                  {Object.keys(QnaStatus).map((key: any) => (
                    <Select.Option key={key} value={key}>
                      {QnaStatus[key]}
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
        onChangePageSize={handleChangePageSize}
        rowKey={contact => contact.contactId.toString()}
        dataSource={content}
        columns={contactColumns}
        expandedRowRender={contact => <ContactCommentRow {...contact} onClickImage={handleClickImage} />}
        expandRowByClick
      />
      <GalleryModal
        visible={galleryVisible}
        setVisible={setGalleryVisible}
        // todo : images
        // images={contact.images}
        images={dummy}
        currentIndex={currentImageIndex}
      />
    </div>
  );
}

export default Contact;
