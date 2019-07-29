import { Quill } from 'react-quill';

const QuillBlot = Quill.import('blots/embed');

function convertUrl(text: string) {
  if (text && typeof text === 'string') {
    if (text.indexOf('/embed') > -1) {
      text = text.substring(0, text.indexOf('/embed'));
    }
    if (text.indexOf('http') === -1) {
      text = 'https://' + text;
    } else if (text.indexOf('http://') > -1) {
      text.replace('http://', 'https://');
    }
  }
  return text;
}

class InstagramBlot extends QuillBlot {
  public static create(data: string) {
    const node: HTMLElement = super.create(data);

    if (typeof data === 'string') {
      node.setAttribute('data-instgrm-permalink', convertUrl(data));
      node.setAttribute('data-instgrm-captioned', 'true');
      node.setAttribute('data-instgrm-version', '12');
      node.setAttribute('style', `width: 540px; border: 1px solid #ddd;`);
    }

    return node;
  }

  public static value(domNode: any) {
    const data = domNode.getAttribute('src') || domNode.getAttribute('data-instgrm-permalink');

    return convertUrl(data);
  }
}

InstagramBlot.blotName = 'instagram';
InstagramBlot.className = 'instagram-media';
InstagramBlot.tagName = 'blockquote';

export default InstagramBlot;
