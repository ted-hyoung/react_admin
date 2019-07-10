import { Quill } from 'react-quill';

const QuillBlot = Quill.import('blots/embed');

declare global {
  interface Window {
    instgrm: any;
  }
}

class InstagramBlot extends QuillBlot {
  static create(data: any) {
    console.log('inner', data);
    const node: HTMLElement = super.create(data);
    if (typeof data === 'string') {
      node.setAttribute('data-instgrm-captioned', 'true');
      node.setAttribute('style', 'width: 540px;min-height: 500px');
      node.setAttribute('data-instgrm-permalink', data);
      node.setAttribute('data-instgrm-version', '12');
    }
    return node;
  }

  // static formats(domNode: HTMLElement) {
  //   // return { src: domNode.getAttribute('src') };
  //   return { src: 'https://www.instagram.com/p/BzpV6WfAazW/' };
  // }

  // constructor(domNode: HTMLElement, value?: any) {
  //   super(domNode, value);
  //   console.log('constructor');
  //   this.process();
  // }

  // private static value(domNode: HTMLElement) {
  //   const { src } = domNode.dataset;
  //   return { src };
  // }

  // format(name: string, value: any) {
  //   if (name === 'instagram') {
  //     this.domNode.setAttribute('data-instgrm-captioned', 'true');
  //     this.domNode.setAttribute('style', 'width: 540px;min-height: 500px');
  //     this.domNode.setAttribute('data-instgrm-permalink', value);
  //     this.domNode.setAttribute('data-instgrm-version', '12');
  //     console.log('format');
  //   } else {
  //     super.format(name, value);
  //   }
  // }

  // formats() {
  //   const formats = super.formats();
  //   formats.instagram = InstagramBlot.formats(this.domNode);
  //   return formats;
  // }

  // private injectScript() {
  //   const script = document.createElement('script');
  //   script.async = script.defer = true;
  //   script.src = '//www.instagram.com/embed.js';
  //   script.id = 'instagram-embed';
  //   document.body.appendChild(script);
  // }

  // private process() {
  //   console.log('process');
  //   if (!window.instgrm) {
  //     debugger;
  //     this.injectScript();
  //   }
  //   window.instgrm.Embeds.process();
  // }
}

InstagramBlot.blotName = 'instagram';
InstagramBlot.className = 'instagram-media';
InstagramBlot.tagName = 'blockquote';

export default InstagramBlot;
