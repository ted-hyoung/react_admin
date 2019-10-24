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
import { uploadImage } from 'lib/protocols';
import { getThumbUrl } from 'lib/utils';
import { QlImageIcon } from 'components/Icons';
import Spinner from '../Spinner';

// const fontSize = Quill.import('attributors/style/size');

// fontSize.whitelist = ['14px', '16px', '18px', '20px', '22px', '24px', '28px', '32px'];

// Quill.register(fontSize, true);
Quill.register({
  'formats/instagram': InstagramBlot,
});

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
    <Modal visible={visible} onCancel={onCancel} onOk={handleOk} title="인스타그램 URL" okText="확인" cancelText="취소">
      <Input onChange={e => setText(e.target.value)} value={text} />
    </Modal>
  );
};

interface ToolbarProps {
  name: string;
  instagramTool: boolean;
  imageHandler: (file: File) => void;
  instagramHandler: (url: string) => void;
  saveLastRange: () => void;
}

const Toolbar = (props: ToolbarProps) => {
  const { name, imageHandler, instagramTool, saveLastRange, instagramHandler } = props;

  const [instagramUrlModalVisible, setInstagramUrlModalVisible] = useState(false);
  const fileInputEl = useRef<HTMLInputElement>(null);

  const handleClickFileInput = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (fileInputEl.current) {
      fileInputEl.current.click();
      saveLastRange();
    }
  };

  return (
    <div id={`${name}-toolbar`}>
      <span className="ql-formats">
        <select className="ql-header" />
        <button type="button" className="ql-bold" />
        <button type="button" className="ql-italic" />
        <button type="button" className="ql-underline" />
      </span>
      <span className="ql-formats">
        <select className="ql-size">
          {/* {fontSize.whitelist.map((value: string, index: number) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))} */}
        </select>
      </span>
      <span className="ql-formats">
        <select className="ql-align" />
      </span>
      <span className="ql-formats">
        <select className="ql-color" />
        <select className="ql-background" />
      </span>
      <span className="ql-formats">
        <button type="button" onClick={handleClickFileInput}>
          <QlImageIcon />
          <input
            ref={fileInputEl}
            style={{ display: 'none' }}
            type="file"
            onClick={e => {
              e.stopPropagation();
              e.currentTarget.value = '';
            }}
            onChange={e => {
              if (!e.target.files) {
                return false;
              }
              imageHandler(e.target.files[0]);
            }}
          />
        </button>
        <button type="button" className="ql-video" />
        <button type="button" className="ql-link" />
        {instagramTool && (
          <button
            type="button"
            onClick={() => {
              setInstagramUrlModalVisible(true);
              saveLastRange();
            }}
          >
            <Icon type="instagram" />
          </button>
        )}
      </span>
      {instagramTool && (
        <InstagramForm
          visible={instagramUrlModalVisible}
          onOk={instagramHandler}
          onCancel={() => setInstagramUrlModalVisible(false)}
        />
      )}
    </div>
  );
};

interface ReactQuillProps {
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  initialValue?: string;
  instagramTool?: boolean;
}

const TextEditor = React.forwardRef<ReactQuill, ReactQuillProps>((props: ReactQuillProps, ref) => {
  const { name = 'editor', value, initialValue, onChange, instagramTool = true } = props;

  const quillRef = useRef<ReactQuill>(null);

  const [lastSelection, setLastSelection] = useState(0);
  const [inProgress, setInProgress] = useState(false);

  const instagramHandler = (value: string) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();

      editor.insertEmbed(lastSelection, 'instagram', value);
      editor.blur();
    }
  };

  const imageHandler = async (file: File) => {
    setInProgress(true);

    const res = await uploadImage(file);

    if (quillRef.current) {
      const editor = quillRef.current.getEditor();

      editor.insertEmbed(lastSelection, 'image', getThumbUrl(res.data.fileKey, 540, 540, 'scale'));
      editor.blur();
    }

    setInProgress(false);
  };

  const instgramProcess = (delta: Delta) => {
    if (delta.ops) {
      delta.ops.forEach(op => {
        if (op.insert) {
          if (op.insert.instagram) {
            window.instgrm.Embeds.process();
          }
        }
      });
    }
  };

  const handleChange = (editor: any) => {
    if (onChange) {
      const contents = editor.getContents();

      instgramProcess(contents);

      onChange(editor.getHTML());
    }
  };

  const saveLastRange = () => {
    const editor = quillRef.current;
    if (editor) {
      const range = editor.getEditor().getSelection();

      if (range) {
        setLastSelection(range.index);
      }
    }
  };

  useEffect(() => {
    if (quillRef.current && initialValue) {
      const editor = quillRef.current.getEditor();

      editor.clipboard.dangerouslyPasteHTML(initialValue);

      window.scrollTo(0, 0);
    }
  }, [initialValue]);

  return (
    <div className={`text-editor ${name}`}>
      <Toolbar
        name={name}
        imageHandler={imageHandler}
        instagramHandler={instagramHandler}
        saveLastRange={saveLastRange}
        instagramTool={instagramTool}
      />
      <ReactQuill
        id={name}
        ref={quillRef}
        modules={{
          toolbar: `#${name}-toolbar`,
        }}
        onChange={(content, delta, source, editor) => handleChange(editor)}
        style={{
          height: 500,
        }}
      />
      {inProgress && <Spinner />}
    </div>
  );
});

export default TextEditor;
