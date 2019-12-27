import { Quill } from 'react-quill';

const Embed = Quill.import('blots/embed');


class HtmlFormat extends Embed {
  public static create(data: string) {
    const node: HTMLElement = super.create(data);

    // Html Element Property Set
    // if(data === 'line') {
    //   node.setAttribute('style', 'margin: 5px 0 5px 0; border:1px solid #ddd;');
    // }

    return node;
  }
}

HtmlFormat.blotName = 'html';
HtmlFormat.tagName = 'hr';

export default HtmlFormat;
