// base
import React, { useState, useRef } from 'react';

// modules
import { Icon, Select } from 'antd';

// components
import { InstagramIcon } from 'components/Icons';
import InstagramForm from './InstagramForm';

interface CustomToolbarProps {
  name: string;
  quill: any;
  instagramTool: boolean;
  saveSelection: () => void;
  imageHandler: (file: File) => void;
  instagramHandler: (url: string) => void;
  quotationHandler: (value: string) => void;
  lineHandler: () => void;
}

const { Option } = Select;

const CustomToolbar = (props: CustomToolbarProps) => {
  const { name, instagramTool, saveSelection, imageHandler, instagramHandler, quotationHandler, lineHandler, quill } = props;

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
        <Select defaultValue="인용구" className="ql-quotation" size={'small'} onChange={quotationHandler}>
          <Option value="small" style={{fontSize: '12px'}}>
            "　" / Small
          </Option>
          <Option value="medium" style={{fontSize: '12px'}}>
            "　" / Medium
          </Option>
          <Option value="large" style={{fontSize: '12px'}}>
            "　" / Large
          </Option>
        </Select>
      </span>
      <span className="ql-formats">
        <button type="button" onClick={() => { lineHandler() }} >
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
