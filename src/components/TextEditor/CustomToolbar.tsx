// base
import React, { useState, useRef } from 'react';

// modules
import { Icon } from 'antd';

// components
import { InstagramIcon } from 'components/Icons';
import InstagramForm from './InstagramForm';

interface CustomToolbarProps {
  name: string;
  instagramTool: boolean;
  saveSelection: () => void;
  imageHandler: (file: File) => void;
  instagramHandler: (url: string) => void;
  inputQuotation: (value: string) => void;
  inputLine: () => void;
}

const CustomToolbar = (props: CustomToolbarProps) => {
  const { name, instagramTool, saveSelection, imageHandler, instagramHandler, inputQuotation, inputLine } = props;

  const [visible, setVisible] = useState(false);

  const fileInputEl = useRef<HTMLInputElement>(null);

  const handleClickFileInput = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (fileInputEl.current) {
      fileInputEl.current.click();
      saveSelection();
    }
  };

  return (
    <div id={`${name}-toolbar`}>
      <span className="ql-formats">
        <select className="ql-size" />
      </span>
      <span className="ql-formats">
        {/* 기획팀 요청으로 인한 주석 처리 */}
        {/* <select className="ql-header" /> */}
        <button type="button" className="ql-bold" />
        <button type="button" className="ql-italic" />
        <button type="button" className="ql-underline" />
      </span>
      <span className="ql-formats">
        <select className="ql-align" />
      </span>
      <span className="ql-formats">
        <select className="ql-color" />
        <select className="ql-background" />
      </span>
      <span className="ql-formats">
        <select className="ql-insertCustomTags">
          <option value="1" onClick={() => { inputQuotation('small'); }} />
          <option value="2" onClick={() => { inputQuotation('medium'); }} />
          <option value="3" onClick={() => { inputQuotation('large'); }} />
        </select>
        <button
          type="button"
          onClick={() => {
            inputLine();
          }}
        >
          <Icon type="line" />
        </button>
      </span>
      <span className="ql-formats">
        <button type="button" onClick={handleClickFileInput}>
          <InstagramIcon />
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
              setVisible(true);
              saveSelection();
            }}
          >
            <Icon type="instagram" />
          </button>
        )}
      </span>
      {instagramTool && <InstagramForm visible={visible} onOk={instagramHandler} onCancel={() => setVisible(false)} />}
    </div>
  );
};

export default CustomToolbar;
