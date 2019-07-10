import React, { useRef, useCallback, useState } from 'react';

import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button, Modal, Input } from 'antd';
import { InstagramBlot } from 'service';

declare global {
  interface Window {
    instgrm: any;
  }
}

Quill.register({ 'formats/instagramBlot': InstagramBlot });

interface InstagramFormProps {
  onChange: (value: string) => void;
  visible: boolean;
  onCancel: () => void;
}

const InstagramForm = (props: InstagramFormProps) => {
  const { onChange, visible, onCancel } = props;
  const [text, setText] = useState('');
  const handleOk = useCallback(() => {
    onChange(text);
    onCancel();
  }, [text]);
  return (
    <Modal visible={visible} onCancel={onCancel} onOk={handleOk} title="인스타그램 url">
      <Input onChange={e => setText(e.target.value)} value={text} />
    </Modal>
  );
};

function injectScript() {
  const script = document.createElement('script');
  script.async = script.defer = true;
  script.src = '//www.instagram.com/embed.js';
  script.id = 'instagram-embed';
  document.body.appendChild(script);
}

function instgrmProcess() {
  if (!window.instgrm) {
    injectScript();
  }
  window.instgrm.Embeds.process();
}

function UpdateCelebReviewForm() {
  const quillRef = useRef<ReactQuill>(null);
  const [editorHtml, setEditorHtml] = useState('');
  const [visible, setVisible] = useState(false);

  const handleConfirm = useCallback(() => {
    console.log(editorHtml);
    if (quillRef.current) {
      console.log(quillRef.current.getEditor().getContents());
    }
  }, [editorHtml, quillRef]);

  const handleFormChange = useCallback(
    (value: string) => {
      if (quillRef.current) {
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection();
        editor.insertEmbed(
          range ? range.index : 0,
          'instagramBlot',
          {
            src: value,
          },
          'user',
        );
        instgrmProcess();
      }
    },
    [quillRef],
  );

  const test = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  const quillProps = {
    modules: {
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          [{ color: ['red', 'green', 'blue', 'black'] }, 'background'],
          ['image', 'video', 'instagramBlot', 'link'],
        ],
        handlers: {
          instagramBlot: test,
        },
      },
    },
  };

  return (
    <div>
      <ReactQuill ref={quillRef} {...quillProps} />
      <Button onClick={handleConfirm}>확인</Button>
      <InstagramForm onChange={handleFormChange} visible={visible} onCancel={() => setVisible(false)} />
    </div>
  );
}

export default UpdateCelebReviewForm;
