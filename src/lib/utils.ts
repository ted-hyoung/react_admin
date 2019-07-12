import { DeltaOperation } from 'quill';
import { QuillDeltaToHtmlConverter, DeltaInsertOp } from 'quill-delta-to-html';

export const calcStringByte = (str: string) => {
  if (str) {
    return String(str).length;
  } else {
    return 0;
  }
};

export const dateFormat = 'YYYY-MM-DD HH:mm:ss';

export function deltaToHtml(deltaOps: DeltaOperation[]) {
  const converter = new QuillDeltaToHtmlConverter(deltaOps, {
    multiLineParagraph: false,
  });
  converter.renderCustomWith((customOp: DeltaInsertOp, contextOp: DeltaInsertOp) => {
    if (customOp.insert.type === 'instagram') {
      const val = customOp.insert.value;
      return `<blockquote class="instagram-media" data-instgrm-permalink="${val}" data-instgrm-captioned data-instgrm-version="12" style="width:540px"></blockquote>`;
    }
    return '';
  });
  return converter;
}
