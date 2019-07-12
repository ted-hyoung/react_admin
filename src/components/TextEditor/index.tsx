// base
import React, { useRef, useState, useCallback, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import { Delta } from 'quill';

// modules
import { Modal, Input, Button, Icon } from 'antd';

// lib
import { deltaToHtml } from 'lib/utils';

// service
import { InstagramBlot } from 'service';

// assets
import 'react-quill/dist/quill.snow.css';
import './index.less';

Quill.register({
  'formats/instagram': InstagramBlot,
});

declare global {
  interface Window {
    instgrm: any;
  }
}

interface InstagramFormProps {
  onOk: (value: string) => void;
  visible: boolean;
  onCancel: () => void;
}

const InstagramForm = (props: InstagramFormProps) => {
  const { onOk, visible, onCancel } = props;
  const [text, setText] = useState('');
  const handleOk = useCallback(() => {
    onCancel();
    onOk(text);
  }, [text]);
  return (
    <Modal visible={visible} onCancel={onCancel} onOk={handleOk} title="인스타그램 url">
      <Input onChange={e => setText(e.target.value)} value={text} />
      <Button>미리보기</Button>
    </Modal>
  );
};

const Toolbar = (props: { instagramHandler: (url: string) => void; saveLastRange: () => void }) => {
  const [instagramUrlModalVisible, setInstagramUrlModalVisible] = useState(false);
  return (
    <div id="toolbar">
      <span className="ql-formats">
        <select className="ql-header" />
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
      </span>
      <span className="ql-formats">
        <select className="ql-color" />
        <select className="ql-background" />
      </span>
      <span className="ql-formats">
        <button className="ql-image" />
        <button className="ql-video" />
        <button className="ql-link" />
        <button onClick={() => setInstagramUrlModalVisible(true)}>
          <Icon type="instagram" />
        </button>
      </span>
      <InstagramForm
        visible={instagramUrlModalVisible}
        onOk={props.instagramHandler}
        onCancel={() => setInstagramUrlModalVisible(false)}
      />
    </div>
  );
};

export interface QuillContentProp {
  editorContent?: string;
  resultContent?: string;
}

interface ReactQuillProps {
  value?: QuillContentProp;
  onChange?: (value: QuillContentProp) => void;
  defaultValue?: string;
}

const TextEditor = React.forwardRef<ReactQuill, ReactQuillProps>((props: ReactQuillProps, ref) => {
  const quillRef = useRef<ReactQuill>(null);
  const [lastSelection, setLastSelection] = useState(0);

  const { onChange, value: propValue, defaultValue } = props;

  const instagramHandler = (value: string) => {
    // quill focus 문제로 setTimeout 추가
    setTimeout(() => {
      quillRef.current!.getEditor().insertEmbed(lastSelection, 'instagram', value);
    }, 100);
  };

  const instgramProcess = useCallback((delta: Delta) => {
    if (delta.ops) {
      delta.ops.some(op => {
        if (op.insert && op.insert.instagram) {
          if (window.instgrm) {
            window.instgrm.Embeds.process();
          }
        }
        return op.insert && op.insert.instagram;
      });
    }
  }, []);

  const handleChange = useCallback(
    (editorContent: string) => {
      if (quillRef.current) {
        const contentDelta = quillRef.current!.getEditor().getContents();
        instgramProcess(contentDelta);
        // editor에 보여지는 html과 실제로 보내야 하는 html이 다른 경우가 있어 resultContent를 따로 추가
        const resultContent = contentDelta.ops ? deltaToHtml(contentDelta.ops).convert() : '';
        if (onChange) {
          onChange({
            editorContent,
            // <br>만 들어간 행은 빈 문자열로 바뀌는 문제가 있어 빈 줄 추가함
            resultContent: resultContent + (resultContent === '<p><br></p>' ? '<p><br></p>' : ''),
          });
        }
      }
    },
    [quillRef, onChange],
  );

  const saveLastRange = () => {
    const editor = quillRef.current;
    const range = editor!.getEditor().getSelection();
    if (editor && range) {
      setLastSelection(range.index);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (quillRef.current && defaultValue) {
        quillRef.current.getEditor().pasteHTML(defaultValue);
      }
    }, 0);
  }, [defaultValue, quillRef]);

  return (
    <>
      <Toolbar instagramHandler={instagramHandler} saveLastRange={saveLastRange} />
      <ReactQuill
        ref={quillRef}
        modules={{
          toolbar: '#toolbar',
        }}
        onChange={handleChange}
      />
    </>
  );
});

export default TextEditor;
