import { Quill } from 'react-quill';

const Embed = Quill.import('blots/embed');


class HtmlFormat extends Embed {
  public static create(data: string) {
    const node: HTMLElement = super.create(data);

    if(data === 'line') {
      node.setAttribute('style', 'width: 100%; border-bottom: 1px solid #ddd; border-left: 0; margin: 5px 0 5px 0; height: 1px;');
    }

    return node;
  }
}

HtmlFormat.blotName = 'html';
HtmlFormat.tagName = 'div';

export default HtmlFormat;
