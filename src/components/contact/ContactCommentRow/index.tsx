import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { CreateContactComment, UpdateContactComment, ResponseContact } from 'types';
import Form, { FormComponentProps } from 'antd/lib/form';
import { Avatar, Comment, Button, Input } from 'antd';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { deleteContactCommentAsync, updateContactCommentAsync, createContactCommentAsync } from 'store/reducer/contact';

// define
const { TextArea } = Input;

export interface RequestContact {
  createComment: (parentId: number, data: CreateContactComment) => void;
  updateComment: (id: number, data: UpdateContactComment) => void;
  deleteComment: (id: number) => void;
}

interface ContactCommentFormProps extends FormComponentProps {
  contactId: number;
  onCancel: () => void;
  value?: string;
}

const answerAvatar = <Avatar icon="check" style={{ background: '#1DA57A' }} />;

const ContactCommentForm = Form.create<ContactCommentFormProps>()((props: ContactCommentFormProps) => {
  const { contactId, value = '', onCancel, form } = props;
  const { getFieldDecorator, validateFieldsAndScroll } = form;

  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    validateFieldsAndScroll((err, data) => {
      if (!err) {
        if (value) {
          dispatch(
            updateContactCommentAsync.request({
              id: contactId,
              data,
            }),
          );
        } else {
          dispatch(
            createContactCommentAsync.request({
              parentId: contactId,
              data,
            }),
          );
        }
      }
    });
  }, [validateFieldsAndScroll, dispatch, contactId, value]);

  return (
    <Comment
      avatar={answerAvatar}
      actions={[
        <Button key="createReview" onClick={handleClick} type="primary">
          등록
        </Button>,
        value && (
          <Button key="cancel" onClick={onCancel} style={{ marginLeft: 5 }}>
            취소
          </Button>
        ),
      ]}
      content={
        <Form>
          <Form.Item style={{ marginBottom: 0 }}>
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
        </Form>
      }
    />
  );
});

function ContactCommentRow(props: ResponseContact) {
  const { comment, contents, creator, contactId } = props;
  const dispatch = useDispatch();
  const commentCreated = useMemo(() => comment && moment(comment.created).format('YYYY-MM-DD HH:mm:ss'), [comment]);
  const [showForm, setShowForm] = useState(false);

  const handleModify = useCallback(() => {
    setShowForm(true);
  }, [setShowForm]);

  const handleDelete = useCallback(() => {
    dispatch(
      deleteContactCommentAsync.request({
        id: contactId,
      }),
    );
  }, [contactId, dispatch]);

  useEffect(() => {
    if (!comment) {
      setShowForm(true);
    } else {
      setShowForm(false);
    }
  }, [comment]);

  return (
    <div>
      <Comment
        avatar={<Avatar icon="question" />}
        author={
          <div>
            <span style={{ marginRight: '3em' }}>아이디 : {creator.loginId}</span>
            <span>주문번호 : 0000-0000-00-0</span>
          </div>
        }
        content={contents}
      />
      {comment && !showForm && (
        <Comment
          avatar={answerAvatar}
          content={comment.comment}
          datetime={commentCreated}
          actions={[
            <Button key="showForm" style={{ marginRight: 5 }} onClick={handleModify}>
              수정
            </Button>,
            <Button key="deleteComment" type="danger" onClick={handleDelete}>
              삭제
            </Button>,
          ]}
        />
      )}
      {showForm && (
        <ContactCommentForm
          contactId={contactId}
          value={comment && comment.comment}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

export default ContactCommentRow;
