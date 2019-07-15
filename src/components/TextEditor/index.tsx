// base
import React, { useRef, useState, useCallback, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import { Delta } from 'quill';

// modules
import { Modal, Input, Icon } from 'antd';

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
  }, [text, onCancel, onOk]);
  return (
    <Modal visible={visible} onCancel={onCancel} onOk={handleOk} title="인스타그램 url">
      <Input onChange={e => setText(e.target.value)} value={text} />
    </Modal>
  );
};

interface ToolbarProps {
  instagramHandler: (url: string) => void;
  saveLastRange: () => void;
}

const Toolbar = (props: ToolbarProps) => {
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
        <button
          onClick={() => {
            setInstagramUrlModalVisible(true);
            props.saveLastRange();
          }}
        >
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

interface ReactQuillProps {
  value?: string;
  onChange?: (value: string) => void;
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
    }, 0);
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
      const contentDelta = quillRef.current!.getEditor().getContents();

      // instagram 있는지 체크해서 instgram.Embeds.process() 실행
      instgramProcess(contentDelta);

      if (onChange) {
        onChange(editorContent);
      }
    },
    [quillRef, onChange, instgramProcess],
  );

  const saveLastRange = () => {
    const editor = quillRef.current;
    const range = editor!.getEditor().getSelection();
    if (range) {
      setLastSelection(range.index);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (defaultValue) {
        quillRef.current!.getEditor().pasteHTML(defaultValue);
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
        value={propValue || ''}
        onChange={handleChange}
        style={{
          height: 500,
        }}
      />
    </>
  );
});

export default TextEditor;
