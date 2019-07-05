import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// store
import { StoreState } from 'store';
import { getContactsAsync } from 'store/reducer/contact';

// types
import { SearchContact, ResponseContact } from 'types';
import { QnaStatus, CsrCategory } from 'enums';
import { ColumnProps } from 'antd/lib/table';

// modules
import { Tag, Divider } from 'antd';
import moment from 'moment';

// components
import { ContactCommentRow, ContactSearch, PaginationTable, GalleryModal } from 'components';

const dummy = Array(5).fill({ src: 'http://placehold.it/300x300' });

function Contact() {
  const dispatch = useDispatch();
  const { contacts, contact } = useSelector((state: StoreState) => state.contact);
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

  // componentDidMount
  useEffect(() => {
    getContacts(0);
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
      <ContactSearch getData={getContacts} />
      <Divider />
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
