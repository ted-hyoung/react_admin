import { Quill } from 'react-quill';

const Embed = Quill.import('blots/embed');

function convertUrl(data: string) {
  if (data && typeof data === 'string') {
    if (data.indexOf('/embed') !== -1) {
      data = data.substring(0, data.indexOf('/embed'));
    }

    if (data.indexOf('http') === -1) {
      data = 'https://' + data;
    } else if (data.indexOf('http://') !== -1) {
      data.replace('http://', 'https://');
    }
  }

  return data;
}

class InstagramFormat extends Embed {
  public static create(data: string) {
    const node: HTMLElement = super.create(data);

    if (typeof data === 'string') {
      node.setAttribute('data-instgrm-permalink', convertUrl(data));
      node.setAttribute('data-instgrm-captioned', 'true');
      node.setAttribute('data-instgrm-version', '12');
      node.setAttribute('style', 'width: 480px; max-width: 100%; border: 1px solid #ddd;');
    }

    return node;
  }

  public static value(element: Element) {
    const data = element.getAttribute('src') || element.getAttribute('data-instgrm-permalink');

    return convertUrl(data as string);
  }
}

InstagramFormat.blotName = 'instagram';
InstagramFormat.className = 'instagram-media';
InstagramFormat.tagName = 'blockquote';

export default InstagramFormat;
