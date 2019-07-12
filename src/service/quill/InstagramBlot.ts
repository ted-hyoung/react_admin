import { Quill } from 'react-quill';

const QuillBlot = Quill.import('blots/embed');
const attributes = ['data-instgrm-permalink', 'data-instgrm-captioned', 'data-instgrm-version'];

function removeEmbed(text: string) {
  if (typeof text === 'string' && text && text.indexOf('/embed') > -1) {
    text = text.substring(0, text.indexOf('/embed'));
  }
  return text;
}

class InstagramBlot extends QuillBlot {
  static create(data: string) {
    const node: HTMLElement = super.create(data);
    if (typeof data === 'string') {
      node.setAttribute('data-instgrm-permalink', removeEmbed(data));
      node.setAttribute('data-instgrm-captioned', 'true');
      node.setAttribute('data-instgrm-version', '12');
      node.setAttribute('style', 'width: 540px; min-height: 500px; border: 1px solid #ddd;');
    }
    return node;
  }

  static value(domNode: any) {
    const data = domNode.getAttribute('src') || domNode.getAttribute('data-instgrm-permalink');
    return removeEmbed(data);
  }
}

InstagramBlot.blotName = 'instagram';
InstagramBlot.className = 'instagram-media';
InstagramBlot.tagName = 'blockquote';
export default InstagramBlot;
