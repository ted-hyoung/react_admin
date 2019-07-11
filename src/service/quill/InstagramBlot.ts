import { Quill } from 'react-quill';

const QuillBlot = Quill.import('blots/embed');

// declare global {
//   interface Window {
//     instgrm: any;
//   }
// }

class InstagramBlot extends QuillBlot {
  static create(data: string) {
    const node: HTMLElement = super.create(data);
    if (typeof data === 'string') {
      if (data.indexOf('embed') < 0) {
        if (data.substr(data.length - 1, 1) !== '/') {
          data += '/';
        }
        data += 'embed';
      }
      node.setAttribute('src', data);
    }
    return node;
  }
}

InstagramBlot.blotName = 'instagram';
InstagramBlot.className = 'instagram-media';
InstagramBlot.tagName = 'iframe';

export default InstagramBlot;
