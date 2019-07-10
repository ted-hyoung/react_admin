import { Quill } from 'react-quill';

const QuillBlot = Quill.import('blots/block');

class InstagramBlot extends QuillBlot {
  private static blotName = 'instagramBlot';
  private static className = 'instagram-media';
  private static tagName = 'blockquote';

  private static create(data: any) {
    const node: HTMLElement = super.create();
    console.log(data);
    if (data.src) {
      // node.setAttribute('src', data.src);
      // node.setAttribute('width', '540');
      // node.setAttribute('height', '640');

      node.setAttribute('data-instgrm-captioned', 'true');
      node.setAttribute('style', 'width: 540px;min-height: 500px');
      node.setAttribute('data-instgrm-permalink', data.src);
      node.setAttribute('data-instgrm-version', '12');
    }
    return node;
  }

  private static value(domNode: HTMLElement) {
    const { src } = domNode.dataset;
    return { src };
  }
}

export default InstagramBlot;
