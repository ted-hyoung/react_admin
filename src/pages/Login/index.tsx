import React, { useCallback } from 'react';
import { Form, Input, Button, Icon } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import './index.less';
import { login } from 'lib/protocols';

function Login(props: FormComponentProps) {
  const { form } = props;
  const { getFieldDecorator, validateFieldsAndScroll } = form;

  const handleConfirm = useCallback(() => {
    validateFieldsAndScroll((err, val) => {
      if (!err) {
        login(val);
      }
    });
  }, []);
  return (
    <div className="login-box">
      <h2>FROM C</h2>
      <Form className="login-form">
        <Form.Item>
          {getFieldDecorator('loginId', {
            rules: [
              {
                required: true,
                message: '아이디를 입력해주세요',
              },
            ],
          })(<Input size="large" placeholder="아이디" prefix={<Icon type="user" />} />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '비밀번호를 입력해주세요',
              },
            ],
          })(
            <Input.Password
              size="large"
              placeholder="비밀번호"
              prefix={<Icon type="lock" />}
              onPressEnter={handleConfirm}
            />,
          )}
        </Form.Item>
      </Form>
      <Button block type="primary" size="large" onClick={handleConfirm}>
        로그인
      </Button>
    </div>
  );
}

export default Form.create()(Login);
