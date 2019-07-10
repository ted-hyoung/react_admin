import React, { useRef, useCallback, useState, useEffect } from 'react';

import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button, Modal, Input } from 'antd';
import { InstagramBlot } from 'service';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { StoreState } from 'store';
import { updateCelebReviewAsync, getCelebReviewAsync } from 'store/reducer/celebReview';

Quill.register({
  'formats/instagram': InstagramBlot,
});

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

// function injectScript() {
//   const script = document.createElement('script');
//   script.async = script.defer = true;
//   script.src = '//www.instagram.com/embed.js';
//   script.id = 'instagram-embed';
//   document.body.appendChild(script);
// }

// function instgrmProcess() {
//   if (!window.instgrm) {
//     injectScript();
//   }
//   window.instgrm.Embeds.process();
// }

function UpdateCelebReviewForm(props: RouteComponentProps<{ id: string }>) {
  const { match } = props;
  const quillRef = useRef<ReactQuill>(null);
  const dispatch = useDispatch();
  const { celebReview } = useSelector((state: StoreState) => state.celebReview);
  const [visible, setVisible] = useState(false);

  const handleConfirm = useCallback(() => {
    // console.log(editorHtml);
    if (quillRef.current) {
      const contents = quillRef.current.getEditor().root.innerHTML;
      const id = Number(match.params.id);
      if (id) {
        dispatch(
          updateCelebReviewAsync.request({
            id,
            data: {
              contents,
              instagramUrl: 'asdf',
            },
          }),
        );
      }
    }
  }, [quillRef, dispatch]);

  const handleFormChange = useCallback(
    (value: string) => {
      if (quillRef.current) {
        // const editor = quillRef.current.getEditor();
        // const range = editor.getSelection();
        // editor.insertEmbed(range ? range.index : 0, 'instagram', value);
        quillRef.current.getEditor().insertEmbed(0, 'instagram', 'https://www.instagram.com/p/BzpV6WfAazW/');
      }
    },
    [quillRef],
  );

  const test = useCallback(async () => {
    if (quillRef.current) {
      quillRef.current.getEditor().insertEmbed(0, 'instagram', 'https://www.instagram.com/p/BzpV6WfAazW/');
    }
    // quillRef(true);
  }, [quillRef]);

  const quillProps = {
    modules: {
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          [{ color: ['red', 'green', 'blue', 'black'] }, 'background'],
          ['image', 'video', 'instagram', 'link'],
        ],
        handlers: {
          instagram: () => {
            setVisible(true);
            // test();
          },
        },
      },
    },
  };

  useEffect(() => {
    if (Number(match.params.id)) {
      dispatch(getCelebReviewAsync.request({ id: Number(match.params.id) }));
    }
  }, [match.params.id]);

  useEffect(() => {
    if (celebReview.contents && celebReview.contents.length > 0 && quillRef.current) {
      quillRef.current.getEditor().clipboard.dangerouslyPasteHTML(0, celebReview.contents);
    }
  }, [celebReview.contents, quillRef]);

  console.log('render', visible);
  return (
    <div>
      <ReactQuill ref={quillRef} {...quillProps} />
      <Button onClick={handleConfirm}>확인</Button>
      <InstagramForm onChange={test} visible={visible} onCancel={() => setVisible(false)} />
    </div>
  );
}

// export default UpdateCelebReviewForm;
export default withRouter(UpdateCelebReviewForm);
