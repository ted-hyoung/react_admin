import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { CreateContactComment, UpdateContactComment, ResponseContact } from 'types';
import Form, { FormComponentProps } from 'antd/lib/form';
import { Avatar, Comment, Button, Input, Modal, Popconfirm } from 'antd';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { deleteContactCommentAsync, updateContactCommentAsync, createContactCommentAsync } from 'store/reducer/contact';
import { getThumbUrl } from 'lib/utils';

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

  const [textLength, setTextLength] = useState(0);

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
                  required: true,
                  message: '내용을 입력해주세요.',
                },
                {
                  max: 500,
                  message: '500자 이하로 입력해주세요',
                },
              ],
            })(<TextArea style={{ height: 100 }} onChange={e => setTextLength(e.target.value.length)} />)}
          </Form.Item>
          <div style={{ float: 'right', marginTop: '-1.5em' }}>
            <span
              style={{
                color: textLength > 500 ? 'red' : 'inherit',
              }}
            >
              {textLength}
            </span>
            /500
          </div>
        </Form>
      }
    />
  );
});

interface ContactCommentRowProps extends ResponseContact {
  onClickImage: (contactId: number, index: number) => void;
}

function ContactCommentRow(props: ContactCommentRowProps) {
  const { contactComment, contents, creator, contactId, onClickImage, images, order } = props;
  const dispatch = useDispatch();
  const commentCreated = useMemo(() => contactComment && moment(contactComment.created).format('YYYY-MM-DD HH:mm:ss'), [
    contactComment,
  ]);
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
    if (!contactComment) {
      setShowForm(true);
    } else {
      setShowForm(false);
    }
  }, [contactComment]);

  return (
    <div>
      <Comment
        avatar={<Avatar icon="question" />}
        author={
          <div>
            <span style={{ marginRight: '3em' }}>주문자 연락처 : {creator.loginId}</span>
            <span>주문번호 : {order.orderNo}</span>
          </div>
        }
        content={
          <>
            <div style={{ marginBottom: 10 }}>{contents}</div>
            <div>
              {images.map((image, i) => (
                <img
                  key={i}
                  src={getThumbUrl(image.fileKey, 100, 100)}
                  onClick={() => onClickImage(contactId, i)}
                  alt={image.fileName}
                  style={{ marginRight: 5, marginBottom: 5 }}
                />
              ))}
            </div>
          </>
        }
      />
      {contactComment && !showForm && (
        <Comment
          avatar={answerAvatar}
          content={contactComment.comment}
          datetime={commentCreated}
          actions={[
            <Button key="showForm" style={{ marginRight: 5 }} onClick={handleModify}>
              수정
            </Button>,
            <Popconfirm key="deleteComment" title="답글이 삭제됩니다. 삭제하시겠습니까?" onConfirm={handleDelete}>
              <Button type="danger">삭제</Button>
            </Popconfirm>,
          ]}
        />
      )}
      {showForm && (
        <ContactCommentForm
          contactId={contactId}
          value={contactComment && contactComment.comment}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

export default ContactCommentRow;
