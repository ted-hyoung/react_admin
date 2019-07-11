import React, { useRef, useState, useCallback } from 'react';

import ReactQuill, { Quill } from 'react-quill';
import { Delta, Sources } from 'quill';

import { InstagramBlot } from 'service';

import 'react-quill/dist/quill.snow.css';

Quill.register({
  'formats/instagram': InstagramBlot,
});

interface ReactQuillProps {
  value?: string | Delta;
  onChange?: (content: string, delta?: Delta, source?: Sources) => void;
}

// interface InstagramFormProps {
//   onChange: (value: string) => void;
//   visible: boolean;
//   onCancel: () => void;
// }

// const InstagramForm = (props: InstagramFormProps) => {
//   const { onChange, visible, onCancel } = props;
//   const [text, setText] = useState('');
//   const handleOk = useCallback(() => {
//     onChange(text);
//     onCancel();
//   }, [text]);
//   return (
//     <Modal visible={visible} onCancel={onCancel} onOk={handleOk} title="인스타그램 url">
//       <Input onChange={e => setText(e.target.value)} value={text} />
//       <Button>미리보기</Button>
//     </Modal>
//   );
// };

// const Toolbar = (props: { instagramHandler: (url: string) => void }) => {
//   const [instagramUrlModalVisible, setInstagramUrlModalVisible] = useState(false);
//   return (
//     <div id="toolbar">
//       <span className="ql-formats">
//         <select className="ql-header" />
//         <button className="ql-bold" />
//         <button className="ql-italic" />
//         <button className="ql-underline" />
//       </span>
//       <span className="ql-formats">
//         <select className="ql-color" />
//         <select className="ql-background" />
//       </span>
//       <span className="ql-formats">
//         <button className="ql-image" />
//         <button className="ql-video" />
//         <button className="ql-link" />
//         <button onClick={() => setInstagramUrlModalVisible(true)}>
//           insta
//         </button>
//       </span>
//       <InstagramForm
//         visible={instagramUrlModalVisible}
//         onChange={props.instagramHandler}
//         onCancel={() => setInstagramUrlModalVisible(false)}
//       />
//     </div>
//   );
// };

const TextEditor = React.forwardRef<ReactQuill, ReactQuillProps>((props: ReactQuillProps, ref) => {
  const quillRef = useRef<ReactQuill>(null);

  const quillProps = {
    modules: {
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          [{ color: ['red', 'green', 'blue', 'black'] }, 'background'],
          ['image', 'video', 'link', 'instagram'],
        ],
      },
    },
  };

  return <ReactQuill ref={quillRef} {...quillProps} value={props.value} onChange={props.onChange} />;
});

export default TextEditor;
