import React, { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// store
import { StoreState } from 'store';
import {
  getContactsAsync,
  createContactCommentAsync,
  updateContactCommentAsync,
  deleteContactCommentAsync,
} from 'store/reducer/contact';

// types
import { SearchContact, ResponseContact, UpdateContactComment, CreateContactComment } from 'types';
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

interface RequestContact {
  createComment: (parentId: number, data: CreateContactComment) => void;
  updateComment: (id: number, data: UpdateContactComment) => void;
  deleteComment: (id: number) => void;
}

interface ContactCommentFormProps extends FormComponentProps, RequestContact {
  contactId: number;
  disable: boolean;
  value?: string;
}

const ContactCommentForm = Form.create<ContactCommentFormProps>()((props: ContactCommentFormProps) => {
  const { contactId, value = '', disable, createComment, updateComment, deleteComment, form } = props;
  const { getFieldDecorator, validateFieldsAndScroll } = form;

  const handleClick = useCallback(() => {
    validateFieldsAndScroll((err, val) => {
      if (!err) {
        createComment(contactId, val);
      }
    });
  }, [validateFieldsAndScroll, createComment, contactId]);

  const handleModify = useCallback(() => {
    validateFieldsAndScroll((err, val) => {
      if (!err) {
        updateComment(contactId, val);
      }
    });
  }, [validateFieldsAndScroll, updateComment, contactId]);

  const handleDelete = useCallback(() => {
    deleteComment(contactId);
  }, [deleteComment, contactId]);

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
          <Button onClick={handleModify}>수정</Button>
          <Button type="danger" onClick={handleDelete}>
            삭제
          </Button>
        </>
      ) : (
        <Button onClick={handleClick}>등록</Button>
      )}
    </Form>
  );
});

function ContactCommentRow(props: ResponseContact & RequestContact) {
  const { comment, contents, creator, contactId, createComment, updateComment, deleteComment } = props;
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
        <ContactCommentForm
          contactId={contactId}
          value={comment && comment.comment}
          disable={comment ? true : false}
          createComment={createComment}
          updateComment={updateComment}
          deleteComment={deleteComment}
        />
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

  const createComment = useCallback(
    (parentId: number, data: CreateContactComment) => {
      dispatch(
        createContactCommentAsync.request({
          parentId,
          data,
        }),
      );
    },
    [dispatch],
  );

  const updateComment = useCallback(
    (id: number, data: UpdateContactComment) => {
      dispatch(
        updateContactCommentAsync.request({
          // comment update시에는 commentId가 아니라 contactId를 사용
          id,
          data,
        }),
      );
    },
    [dispatch],
  );

  const deleteComment = useCallback(
    (id: number) => {
      dispatch(
        deleteContactCommentAsync.request({
          id,
        }),
      );
    },
    [dispatch],
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
        expandedRowRender={contact => (
          <ContactCommentRow
            {...contact}
            createComment={createComment}
            updateComment={updateComment}
            deleteComment={deleteComment}
          />
        )}
        expandRowByClick
      />
    </div>
  );
}

export default Contact;
