import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// store
import { StoreState } from 'store';
import { getContactsAsync, createContactCommentAsync } from 'store/reducer/contact';

// types
import { SearchContact, ResponseContact, UpdateContactComment } from 'types';
import { QnaStatus, CsrCategory } from 'enums';
import { FormComponentProps } from 'antd/lib/form';
import { ColumnProps } from 'antd/lib/table';
import { SearchCondition } from 'components/SearchBar';

// modules
import { Table, Button, Divider, Form, Input } from 'antd';
import moment from 'moment';

// components
import { PageSizeSelect, SearchBar } from 'components';

const { TextArea } = Input;

const searchCondition: SearchCondition[] = [
  { key: 'status', text: '상태' },
  { key: 'category', text: '분류' },
  { key: 'keyword', text: '키워드' },
];

interface ContactCommentFormProps extends FormComponentProps {
  contactId: number;
  disable: boolean;
  value?: string;
}

const ContactCommentForm = Form.create<ContactCommentFormProps>()((props: ContactCommentFormProps) => {
  const dispatch = useDispatch();
  const { contactId, value = '', disable, form } = props;
  const { getFieldDecorator, validateFieldsAndScroll } = form;

  const createComment = useCallback(
    (value: string) => {
      dispatch(
        createContactCommentAsync.request({
          parentId: contactId,
          data: {
            comment: value,
          },
        }),
      );
    },
    [dispatch],
  );

  const updateComment = useCallback((props: UpdateContactComment) => {}, [dispatch]);

  const handleClick = useCallback(() => {
    validateFieldsAndScroll((err, val) => {
      if (!err) {
        createComment(val.comment);
      }
    });
  }, [validateFieldsAndScroll, createComment]);

  return (
    <Form>
      <Form.Item>
        {getFieldDecorator('comment', {
          initialValue: value,
          rules: [
            {
              max: 500,
              message: '500자 이하로 입력해주세요',
            },
          ],
        })(<TextArea style={{ height: 100 }} />)}
      </Form.Item>
      {disable ? (
        <>
          <Button>수정</Button>
          <Button type="danger">삭제</Button>
        </>
      ) : (
        <Button onClick={handleClick}>등록</Button>
      )}
    </Form>
  );
});

function ContactCommentRow(props: ResponseContact) {
  const { comment, contents, creator, contactId } = props;
  const commentCreated = useMemo(() => comment && moment(comment.created).format('YYYY-MM-DD HH:mm:ss'), [comment]);
  return (
    <div>
      <div>
        <div>
          <span>아이디 : {creator.loginId}</span>
          {/* todo : 주문번호
          <span>주문번호 : </span> */}
        </div>
        <div>질문 : {contents}</div>
      </div>
      <Divider />
      <div>
        {comment && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{comment.creator.loginId}</span>
            <span>{commentCreated}</span>
          </div>
        )}
        <ContactCommentForm contactId={contactId} value={comment && comment.comment} disable={comment ? true : false} />
      </div>
    </div>
  );
}

function Contact() {
  const dispatch = useDispatch();
  const { content, size: pageSize } = useSelector((state: StoreState) => state.contact.contacts);

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
        render: status => QnaStatus[status],
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
      <SearchBar searchConditions={searchCondition} getData={getContacts} pageSize={pageSize} />
      <PageSizeSelect getData={getContacts} />
      <Table
        rowKey={contact => contact.contactId.toString()}
        dataSource={content}
        columns={contactColumns}
        expandedRowRender={contact => <ContactCommentRow {...contact} />}
        expandRowByClick
      />
    </div>
  );
}

export default Contact;
