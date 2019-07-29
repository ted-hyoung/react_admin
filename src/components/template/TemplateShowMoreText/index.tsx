import React, { useState } from 'react';
import { Button } from 'antd';
import './index.less';
import { splitToLine } from 'lib/utils';
import runes from 'runes';

interface Props {
  type: 'line' | 'length';
  limit: number;
  text: string;
}

function ShowMoreText(props: Props) {
  const { type, limit, text } = props;
  const [open, setOpen] = useState(false);

  const lengthType = type === 'length';
  const splitText = (!lengthType && splitToLine(text, limit)) || [];
  const reduce = lengthType ? runes(text).length > limit : splitText.length > limit;

  return (
    <>
      <pre style={{ whiteSpace: 'pre-line', fontFamily: 'inherit' }}>
        {reduce && !open
          ? (lengthType ? runes.substr(text, 0, limit) : splitText.slice(0, limit).join('\n')) + '...'
          : text}
      </pre>
      {reduce && (
        <Button className="btn-more" size="large" type="link" onClick={() => setOpen(!open)}>
          {open ? '숨기기' : '더 보기'}
          <span className={`arrow ${open ? '' : 'reverse'}`} />
        </Button>
      )}
    </>
  );
}

export default ShowMoreText;
